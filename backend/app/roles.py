from db import get_db_connection
from flask import jsonify, request


def get_max_balance():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, role_id, achievement_id, max_count FROM role_achievements")
    roles = cursor.fetchall()
    roles_wallet = []
    for role in roles:
        roles_wallet.append({
            "id": role[0],
            "role_id": role[1],
            "achievement_id": role[2],
            "max_count": role[3]
        })
    cursor.close()
    conn.close()
    return jsonify(roles_wallet), 200

def append_role_wallet():
    try:
        data = request.get_json()
        role_id = data.get('role_id')
        achievement_id = data.get('achievement_id')
        max_count = data.get('max_count')
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO role_achievements (role_id, achievement_id, max_count) VALUES (%s, %s, %s);
        """
        cursor.execute(query, (role_id, achievement_id, max_count))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Role wallet added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_user_wallet(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT 
            uab.id, uab.user_id, a.id, uab.count,
            ra.max_count, 
            a.name,
            u.name, u.patronymic, u.surname, u.tg_nickname,
            d.department_name,
            ujt.job_title,
            r.role_name,
            a.achievement_weight, a.department_only
        FROM user_achievements_balance uab
        JOIN achievements a ON uab.achievement_id = a.id
        JOIN role_achievements ra ON ra.achievement_id = uab.achievement_id
        JOIN roles r ON r.id = ra.role_id 
        JOIN users u ON u.id = uab.user_id
        JOIN departments d ON d.id = u.department_id
        JOIN user_job_titles ujt ON ujt.user_id = u.id
        WHERE uab.user_id = %s
    """
    cursor.execute(query, (user_id,))
    roles = cursor.fetchall()

    # Инициализация структуры данных
    user = {
        "id": user_id,
        "name": roles[0][6] if roles else None,
        "patronymic": roles[0][7] if roles else None,
        "surname": roles[0][8] if roles else None,
        "tg_nickname": roles[0][9] if roles else None,
        "department_name": roles[0][10] if roles else None,
        "job_title": roles[0][11] if roles else None
    }

    roles_wallet = {}

    # Группировка данных по ролям
    for role in roles:
        role_name = role[12]
        if role_name not in roles_wallet:
            roles_wallet[role_name] = []

        roles_wallet[role_name].append({
            "id": role[0],
            "achievement_id": role[2],
            "count": role[3],
            "max_count": role[4],
            "achievement_name": role[5],
            "achievement_weight": role[13],
            "department_only": role[14]
        })

    # Преобразование в список ролей
    roles_info = [{"name": role_name, "wallet": wallet} for role_name, wallet in roles_wallet.items()]

    json_response = {
        "user": user,
        "role": roles_info
    }

    cursor.close()
    conn.close()
    return jsonify(json_response), 200