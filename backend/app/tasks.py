from db import get_db_connection
from flask import jsonify
from datetime import datetime
from flask import request

def get_season_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT id, task_name, task_description, task_weight, is_open
            FROM tasks
            WHERE is_open = TRUE AND id NOT IN (SELECT task_id FROM user_tasks)
        """
        cursor.execute(query)
        tasks = cursor.fetchall()
        cursor.close()
        conn.close()
        task_info = []
        for task in tasks:
            task_info.append({
                "id": task[0],
                "task_name": task[1],
                "task_description": task[2],
                "task_weight": task[3],
                "is_open": task[4]
            })
        tasks = task_info
        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def add_task_result():
    try:
        # get from POST json
        data = request.get_json()
        task_id = data.get('task_id')
        user_id = data.get('user_id')
        result = data.get('result')

        conn = get_db_connection()
        cursor = conn.cursor()
        created_at = datetime.now()
        query = """
            INSERT INTO user_tasks (task_id, user_id, task_status, task_date, task_description)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (task_id, user_id, 'pending', created_at, result))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({
            "message": "Task result added successfully", 
            "result": "success"
            }), 200
    except Exception as e:
        return jsonify({
                "error": str(e),
                "result": "failed"
            }), 500
    
def get_tasks_for_moderation():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT ut.id, user_id, name, surname, task_name, ut.task_description 
            FROM user_tasks ut
            JOIN users ON ut.user_id = users.id
            JOIN tasks ON ut.task_id = tasks.id
            WHERE task_status = 'pending'
        """
        cursor.execute(query)
        tasks = cursor.fetchall()
        cursor.close()
        conn.close()
        tasks_info = [
            {
                "id": task[0],
                "user_id": task[1],
                "name": task[2],
                "surname": task[3],
                "task_name": task[4],
                "task_description": task[5]
            } for task in tasks
        ]

        return jsonify(tasks_info), 200
        
    except Exception as e:
        return jsonify({
                "error": str(e),
                "result": "failed"
            }), 500


def moderate_quest():
    try:
        # Получаем данные из запроса
        data = request.get_json()
        print(data)

        # Проверяем наличие необходимых полей
        if 'id' not in data or 'resolution' not in data:
            return jsonify({
                "status": "failed",
                "message": "Недостающие данные: id или resolution"
            }), 400
        
        # Открываем соединение с базой данных
        conn = get_db_connection()
        cursor = conn.cursor()

        # Проверяем, если решение "accepted" или "rejected"
        if data['resolution'] not in ['accepted', 'rejected']:
            return jsonify({
                "status": "failed",
                "message": "Некорректное значение для resolution"
            }), 400

        # Если решение "accepted", обновляем статус задачи
        if data['resolution'] == 'accepted':
            query = """
                UPDATE user_tasks 
                SET task_status = %s
                WHERE id = %s
                returning task_id
            """
            cursor.execute(query, (data['resolution'], data['id']))
            task_id = cursor.fetchall()[0]

            print(task_id)

            weightQuery = """
                SELECT task_weight FROM tasks WHERE id = %s
            """
            cursor.execute(weightQuery, task_id)
            task_weight = cursor.fetchall()[0]
            print(task_weight)
                        # Обновляем ncoins и npoints в таблице user_details
            updateQuery = """
                UPDATE user_details
                SET ncoins = ncoins + %s, npoints = npoints + %s
                WHERE user_id = %s
            """
            cursor.execute(updateQuery, (task_weight, task_weight, data['user_id']))
        
        # Если решение "rejected", удаляем строку из таблицы
        elif data['resolution'] == 'rejected':
            query = """
                DELETE FROM user_tasks 
                WHERE id = %s
            """
            cursor.execute(query, (data['id'],))

        # Подтверждаем транзакцию
        conn.commit()

        # Закрываем соединение с базой данных
        cursor.close()
        conn.close()

        # Возвращаем успешный ответ
        return jsonify({"status": "success"})
    
    except Exception as e:
        # В случае ошибки возвращаем сообщение об ошибке
        return jsonify({
            "status": "failed",
            "message": str(e)
        }), 500
