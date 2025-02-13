from flask import jsonify
from db import get_db_connection
from flask import request
from datetime import datetime

def get_all_items():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM shop")
        items = cursor.fetchall()
        cursor.close()
        conn.close()
        store_items = []
        for item in items:
            store_items.append({
                "id": item[0],
                "name": item[1],
                "description": item[2],
                "image": item[3],
                "price": item[4],
                "quantity": item[5]
            })
        items = store_items
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def buy_cart():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        cart = data.get('cart')
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT ncoins FROM user_details WHERE user_id = %s", (user_id,))
        ncoins = cursor.fetchone()[0]
        
        cart_price = 0
        item_ids = []
        for item in cart:
            item_ids.append(item['id'] )

        cursor.execute("SELECT price FROM shop WHERE id = ANY(%s)", (item_ids,))
        prices = cursor.fetchall()

        for price in prices:
            cart_price += price[0]
        if ncoins < cart_price:
            return jsonify({
                "success": False,
                "ncoins": ncoins,
                "message": "Недостаточно средств",
                "cart": cart, 
                "cart_price": cart_price
            }), 200
        # Найти максимальное число в колонке order_id
        cursor.execute("SELECT MAX(order_id) FROM user_purchases")
        max_order_id = cursor.fetchone()[0]  # Получаем максимум только один раз
        order_id = max_order_id + 1 if max_order_id is not None else 1

        # Сделать покупку
        for item in cart:
            item_id = item['id']
            cursor.execute("SELECT price, count FROM shop WHERE id = %s", (item_id,))
            item_info = cursor.fetchone()
            item_price = item_info[0]
            item_quantity = item_info[1]
            if item_quantity == 0:
                return jsonify({
                    "success": False,
                    "ncoins": ncoins,
                    "message": "Товар закончился",
                    "cart": cart, 
                    "order_id": order_id,
                    "cart_price": cart_price
                }), 200
            cursor.execute("UPDATE shop SET count = count - 1 WHERE id = %s", (item_id,))
            transaction_date = datetime.now()
            transaction_status = "pending"
            query = "INSERT INTO user_purchases (user_id, item_id, order_id, transaction_date, transaction_status, money_spent) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (user_id, item_id, order_id,  transaction_date, transaction_status, item_price))

        # Уменьшить количество монет
        new_ncoins = ncoins - cart_price
        cursor.execute("UPDATE user_details SET ncoins = %s WHERE user_id = %s", (new_ncoins, user_id))
        conn.commit()
        cursor.close()

        return jsonify({
            "success": True,
            "ncoins": ncoins, 
            "message": "Покупка совершена!",
            "cart": cart, 
            "order_id": order_id,
            "cart_price": cart_price

        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500