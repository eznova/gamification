from db import get_db_connection
from flask import jsonify, request
from datetime import datetime
from notifier import send_achievement_notification

def get_all_achievements():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT achievements.id, achievements.name, img_name, achievement_weight, description, achievement_groups.id, achievement_groups.name 
            FROM achievements
            JOIN achievement_groups ON achievements.group_id = achievement_groups.id
        """
        cursor.execute(query)
        achievements = cursor.fetchall()

        result = []
        for achievement in achievements:
            result.append({
                "id": achievement[0],
                "name": achievement[1],
                "img_name": achievement[2],
                "weight": achievement[3],
                "description": achievement[4],
                "group_id": achievement[5],
                "group_name": achievement[6]
            })
        cursor.close()
        conn.close()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_user_achievements_detailed(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT achievement_id, COUNT(*) as count, user_id, achievement_date, sender_id
            FROM user_achievements
            WHERE user_achievements.user_id = %s
            GROUP BY achievement_id, user_id, achievement_date, sender_id
        """
        cursor.execute(query, (user_id,))
        achievements = cursor.fetchall()

        result = []
        for achievement in achievements:
            result.append({
                "achievement_id": achievement[0],
                "count": achievement[1],
                "user_id": achievement[2],
                "achievement_date": achievement[3],
                "sender_id": achievement[4]
            })
        cursor.close()
        conn.close()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from thx import get_user_thx_details

def get_user_achievements(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Получаем количество благодарностей заранее
        thx_response, status_code = get_user_thx_details(user_id)
        thx_count = 0
        if status_code == 200:
            thx_data = thx_response.get_json()
            thx_count = thx_data.get("thx_count", 0)

        query = """
            SELECT achievement_id, COUNT(*) as count, user_id, achievement_date
            FROM user_achievements
            WHERE user_achievements.user_id = %s
            GROUP BY achievement_id, user_id, achievement_date
        """
        cursor.execute(query, (user_id,))
        achievements = cursor.fetchall()

        result = []
        has_thx_achievement = False

        for achievement in achievements:
            achievement_id = achievement[0]
            if achievement_id == 1:
                quantity = thx_count
                has_thx_achievement = True
            else:
                quantity = achievement[1]

            result.append({
                "achievement_id": achievement_id,
                "quantity": quantity,
                "user_id": achievement[2],
                "achievement_date": achievement[3]
            })

        # Если достижение с ID 1 (благодарности) отсутствует, но есть благодарности, добавляем вручную
        if thx_count > 0 and not has_thx_achievement:
            result.append({
                "achievement_id": 1,
                "quantity": thx_count,
                "user_id": user_id,
                "achievement_date": None  # Дата неизвестна, можно заменить на `datetime.now()`
            })

        cursor.close()
        conn.close()

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def add_achievement():
    try:
        data = request.get_json()
        achievement_id = data.get('achievement_id')
        user_id = data.get('user_id')
        achievement_date = datetime.now()
        sender_id = data.get('sender_id')

        conn = get_db_connection()
        cursor = conn.cursor()

        # Проверяем, существует ли достижение
        query = """
            SELECT need_verification FROM achievements WHERE id = %s
        """
        cursor.execute(query, (achievement_id,))
        need_verification = cursor.fetchone()[0]
        
        verified = None
        if need_verification:
            verified = False
        else:
            verified = True

        query = """
            INSERT INTO user_achievements (achievement_id, user_id, achievement_date, sender_id, verified)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (achievement_id, user_id, achievement_date, sender_id, verified))

        getAchievmentWeightQuery = """
            SELECT achievement_weight FROM achievements WHERE id = %s
        """

        cursor.execute(getAchievmentWeightQuery, (achievement_id,))
        weight = cursor.fetchone()[0]
        # Add weight to ncoins and npoints

        updateUserWeightQuery = """
            UPDATE user_details
            SET ncoins = ncoins + %s, npoints = npoints + %s
            WHERE user_id = %s
        """

        cursor.execute(updateUserWeightQuery, (weight, weight, user_id))
        
        conn.commit()

        # Проверяем, был ли добавлен хотя бы один ряд
        if cursor.rowcount > 0:
            conn.close()
            return jsonify({'message': 'Достижение успешно добавлено', 'result': 'success'}), 200
        else:
            conn.close()
            return jsonify({'message': 'Ошибка при добавлении достижения', 'result': 'error'}), 400

    except Exception as e:
        # Общая обработка других ошибок
        conn.close()
        return jsonify({'message': f'Произошла ошибка: {str(e)}', 'result': 'error'}), 500
    
def send_achievement():
    try:
        data = request.get_json()
        print(data)
        achievement_id = data.get('achievement_id')
        user_id = data.get('user_id')
        sender_id = data.get('sender_id')
        achievement_date = datetime.now()
        achievement_weight = data.get('achievement_weight')

        conn = get_db_connection()
        cursor = conn.cursor()

        # check balance before actions
        cursor.execute("SELECT count FROM user_achievements_balance WHERE user_id = %s AND achievement_id = %s", (sender_id, achievement_id))
        balance = cursor.fetchone()
        
        if not balance or balance[0] == 0:
            conn.close()
            return jsonify({"error": "Недостаточно наградных монет для отправки достижения", "status": "failed"}), 200

        # Insert achievement
        query = """
            INSERT INTO user_achievements (achievement_id, user_id, sender_id, achievement_date, achievement_weight)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (achievement_id, user_id, sender_id, achievement_date, achievement_weight))
        conn.commit()

        # update user ncoins and npoints
        print("Balance", balance)
        query = """
            SELECT need_verification FROM achievements WHERE id = %s
        """
        cursor.execute(query, (achievement_id,))
        need_verification = cursor.fetchone()[0]
        print("need_verification", need_verification)
        if not need_verification:
            updateUserWeightQuery = """
                UPDATE user_details
                SET ncoins = ncoins + %s, npoints = npoints + %s
                WHERE user_id = %s
            """
            print("No verification needed")
            cursor.execute(updateUserWeightQuery, (achievement_weight, achievement_weight, user_id))
            conn.commit()

            updateAchievmentQuery = """
                UPDATE user_achievements
                SET verified = TRUE
                WHERE user_id = %s AND achievement_id = %s AND verified = FALSE AND sender_id = %s
            """

            cursor.execute(updateAchievmentQuery, (user_id, achievement_id, sender_id))
            conn.commit()
        print("removeAchievmentQuery", balance)
        # make count less in user_achievements_balance
        removeAchievmentQuery = """
            UPDATE user_achievements_balance
            SET count = count - 1
            WHERE user_id = %s AND achievement_id = %s and count > 0
        """

        cursor.execute(removeAchievmentQuery, (sender_id, achievement_id))

        conn.commit()
        cursor.close()
        conn.close()
        if not need_verification:
            achievement_data = {
                'reciever_id': user_id,
                'achievement_id': achievement_id
            }
            send_achievement_notification(achievement_data)
        return jsonify({'message': 'Достижение успешно отправлено', 'result': 'success'}), 200
    except Exception as e:
        # Общая обработка других ошибок
        conn.close()
        return jsonify({'message': f'Произошла ошибка: {str(e)}', 'result': 'error'}), 500
    
def verify_achievement():
    try:
        data = request.get_json()
        print(data)
        achievement_id = data.get('achievement_id')
        user_id = data.get('user_id')
        sender_id = data.get('sender_id')
        resolution = data.get('resolution')


        conn = get_db_connection()
        cursor = conn.cursor()
        message = ''

        if resolution == 'accepted':
            # verify achievement
            query = """
                UPDATE user_achievements
                SET verified = TRUE
                WHERE achievement_id = %s AND user_id = %s AND verified = FALSE AND sender_id = %s
                returning achievement_weight
                """

            cursor.execute(query, (achievement_id, user_id, sender_id))
            conn.commit()
            achievement_weight = cursor.fetchone()[0]

            # update user ncoins and npoints
            updateUserWeightQuery = """
                UPDATE user_details
                SET ncoins = ncoins + %s, npoints = npoints + %s
                WHERE user_id = %s
            """

            cursor.execute(updateUserWeightQuery, (achievement_weight, achievement_weight, user_id))
            conn.commit()
            message = 'Достижение успешно подтверждено'
            achievement_data = {
                'reciever_id': user_id,
                'achievement_id': achievement_id
            }
            send_achievement_notification(achievement_data)
        else:
            # remove achievement
            query = """
                DELETE FROM user_achievements
                WHERE achievement_id = %s AND user_id = %s AND verified = FALSE AND sender_id = %s
            """
            cursor.execute(query, (achievement_id, user_id, sender_id))
            conn.commit()
            
            # update sender achievments balance
            query = """
                UPDATE user_achievements_balance
                SET count = count + 1
                WHERE user_id = %s AND achievement_id = %s
            """
            cursor.execute(query, (sender_id, achievement_id))
            conn.commit()
            message = 'Достижение успешно удалено'
        cursor.close()
        conn.close()            
        return jsonify({'message': message, 'result': 'success'}), 200
    except Exception as e:
        # Общая обработка других ошибок
        conn.close()
        return jsonify({'message': f'Произошла ошибка: {str(e)}', 'result': 'error'}), 500
    
def get_unverified_achievements():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT a.id , user_id, sender_id, verified, ua.achievement_weight, concat_ws(' ', ru.surname, ru.name, ru.patronymic), concat_ws(' ', su.surname, su.name, su.patronymic), a.name
            FROM user_achievements ua
            JOIN achievements a ON ua.achievement_id = a.id
            JOIN users su ON ua.sender_id = su.id
            JOIN users ru ON ua.user_id = ru.id
            WHERE verified = FALSE
        """

        cursor.execute(query)
        unverified_achievements = cursor.fetchall()
        achievements = []
        for achievement in unverified_achievements:
            achievements.append(
                {
                    'achievement_id': achievement[0],
                    'user_id': achievement[1],
                    'sender_id': achievement[2],
                    'verified': achievement[3],
                    'achievement_weight': achievement[4], 
                    'reciever_name': achievement[5],
                    'sender_name': achievement[6],
                    'achievement_name': achievement[7]
                }
            )

        cursor.close()
        conn.close()

        return jsonify(achievements), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500