from flask import jsonify, request
from db import get_db_connection
from datetime import datetime
from config import DEFAULT_THX_COUNT
from notifier import send_thx_notification


def add_thx():
    try:
        data = request.get_json()
        print(data)
        reciever_id = data.get('receiver_id')
        sender_id = data.get('sender_id')
        created_at = datetime.now()
        message = data.get('message')

        if reciever_id == sender_id:
            return jsonify({'message': 'You cannot thx yourself', 'result': 'error'}), 400
        
        user_thx_response, status_code = get_user_thx(sender_id)
        if status_code != 200:
            return jsonify({'message': 'Error retrieving user thx', 'result': 'error'}), 500
        
        user_thx_count = user_thx_response.get_json()
        print(user_thx_count)
        
        if user_thx_count['thx_count'] <= 0:
            return jsonify({'message': 'You have no more thx', 'result': 'error'}), 400
        
        print(reciever_id, sender_id, created_at, message)

        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO thanks_details (reciever_id, sender_id, created_at, message)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (reciever_id, sender_id, created_at, message))
        # update thanks count for sender user and get updated thanks count back
        cursor.execute("UPDATE user_details SET thanks_count = thanks_count - 1 WHERE user_id = %s", (sender_id,))
        cursor.execute("SELECT thanks_count FROM user_details WHERE user_id = %s", (sender_id,))
        # add ncoins and npoints to reciever
        # get thanks weight from achievements table
        cursor.execute("SELECT achievement_weight FROM achievements WHERE id = 1")
        thx_weight = cursor.fetchone()[0]
        cursor.execute("UPDATE user_details SET ncoins = ncoins + %s, npoints = npoints + %s WHERE user_id = %s returning ncoins, npoints", (thx_weight, thx_weight, reciever_id))
        sender_thx_count = cursor.fetchone()[0]
        cursor.close()

        conn.commit()
        conn.close()

        # send thx notification
        thx_data = {
            "reciever_id": reciever_id,
            "sender_id": sender_id,
            "created_at": created_at,
            "message": message
        }
        send_thx_notification(thx_data)
        return jsonify(
            {
                'message': 'Thx added successfully',
                'sender_thx_count': sender_thx_count,
                'result': 'success'
                }), 200

    except Exception as e:
        return jsonify({'message': f'Произошла ошибка: {str(e)}', 'result': 'error'}), 500

    
def get_user_thx(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        qeuery = """
            SELECT user_id, thanks_count FROM user_details WHERE user_id = %s
        """
        cursor.execute(qeuery, (user_id,))
        thx = cursor.fetchall()[0]
        data ={
                "user_id": thx[0],
                "thx_count": thx[1],
                "max_thx": DEFAULT_THX_COUNT
            }
        cursor.close()
        conn.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def reset_thx():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # set thanks_count to default for column value
        qeuery = """
            UPDATE user_details SET thanks_count = %s
        """
        cursor.execute(qeuery, (DEFAULT_THX_COUNT,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Thanks count reset successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_user_thx_details(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        qeuery = """
            SELECT td.id, sender_id, name, surname, created_at, message 
            FROM thanks_details td
            JOIN users ON td.sender_id = users.id
            WHERE reciever_id = %s
        """
        cursor.execute(qeuery, (user_id,))
        thx = cursor.fetchall()
        cursor.close()
        conn.close()
        thx_details = []
        for thx_detail in thx:
            thx_details.append({
                "id": thx_detail[0],
                "sender_id": thx_detail[1],
                "sender_name": thx_detail[2] + " " + thx_detail[3],
                "created_at": thx_detail[4],
                "message": thx_detail[5]
            })
        thx = {
            "user_id": user_id,
            "thx_details": thx_details,
            "thx_count": len(thx)
        }
        return jsonify(thx), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500