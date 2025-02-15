from flask import jsonify, request
from db import get_db_connection
import hashlib
from datetime import datetime
from config import DEFAULT_USER_ROLE_ID, DEFAULT_TEAM_ID
import requests


def login():
    """
    Login endpoint
    ---
    parameters:
      - name: login
        in: body
        required: true
        schema:
          type: object
          properties:
            login:
              type: string
            password:
              type: string
    responses:
      200:
        description: Login success
        schema:
          type: object
          properties:
            login_status:
              type: string
              example: success
      401:
        description: Invalid login or password
        schema:
          type: object
          properties:
            login_status:
              type: string
              example: failed
      400:
        description: Missing login or password
        schema:
          type: object
          properties:
            error:
              type: string
              example: Login and password are required
    """
    data = request.get_json()
    login_input = data.get('login')
    password_input = data.get('password')

    if not login_input or not password_input:
        return jsonify({"error": "Login and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT id FROM users
        WHERE login = %s AND password = %s and is_active = TRUE;
        """
        cursor.execute(query, (login_input, password_input))
        user = cursor.fetchone()

        if user:
            return jsonify({"login_status": "success", "user_id": user[0]}), 200
        else:
            return jsonify({"login_status": "failed"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

def register():
    """
    Register user endpoint
    ---
    parameters:
      - name: user
        in: body
        required: true
        schema:
          type: object
          properties:
            code:
              type: string
            surname:
              type: string
            name:
              type: string
            patronymic:
              type: string
            birthdate:
              type: string
            hobbies:
              type: string
            jobTitle:
              type: string
            job_role:
              type: string
            department:
              type: string
            projects:
              type: string
            telegram:
              type: string
            phone:
              type: string
            jiraLogin:
              type: string
            password:
              type: string
            confirmPassword:
              type: string
    responses:
      200:
        description: User registered successfully
      400:
        description: Missing or invalid user data
      500:
        description: Server error
    """
    data = request.get_json()
    print(data)
    required_fields = [
        'code', 'surname', 'name', 'patronymic', 'birthdate', 'hobbies',
        'jobTitle', 'role', 'department', 'projects', 'telegram', 'phone',
        'jiraLogin', 'password', 'confirmPassword', 'onboarding_date'
    ]

    # Проверка наличия всех обязательных полей
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Проверка совпадения пароля и подтверждения пароля
    if data['password'] != data['confirmPassword']:
        return jsonify({"error": "Passwords do not match"}), 400

    # Хеширование пароля
    # hashed_password = hashlib.sha256(data['password'].encode('utf-8')).hexdigest()
    hashed_password = data['password']

    user_data = {
        "code": data["code"],
        "surname": data["surname"],
        "name": data["name"],
        "patronymic": data["patronymic"],
        "birthdate": data["birthdate"],
        "hobbies": data["hobbies"],
        "jobTitle": data["jobTitle"],
        "jobRole": data["role"],
        "department": data["department"],
        "onboarding_date": data["onboarding_date"],
        "projects": data["projects"],
        "telegram": data["telegram"],
        "phone": data["phone"],
        "jiraLogin": data["jiraLogin"],
        "password": hashed_password
    }

    try:
        res = register_user(user_data)
        return res
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def check_code(code):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM codes WHERE code_value = %s", (code,))
    result = cursor.fetchone()
    print(result)
    cursor.close()
    conn.close()
    return {
        "id": result[0],
        "value": result[1],
        "used": result[2]
    }

def register_user(data):
    # Разделение данных на группы
    user_info = {
        "login": data["jiraLogin"],
        "password": data["password"],
        "jira_login": data["jiraLogin"],
        "name": data["name"],
        "patronymic": data["patronymic"],
        "surname": data["surname"],
        "birthdate": datetime.strptime(data["birthdate"], "%d.%m.%Y").date(),
        "tg_nickname": data["telegram"],
        "phone": data["phone"],
        "department_id": int(data["department"]),
        "jobRole": data["jobRole"],
        "grade": 0
    }

    user_details = {
        "interests": data["hobbies"]
    }

    user_job_info = {
        "job_title": data["jobTitle"],
        "role": data["jobRole"],
        "onboarding_date": datetime.strptime(data["onboarding_date"], "%d.%m.%Y").date(),
        "projects": data["projects"]
    }

    user_roles = {
        "role_id": DEFAULT_USER_ROLE_ID
    }

    user_teams = {
        "team_id": DEFAULT_TEAM_ID
    }

    code = {
        "code": data["code"]
    }
    
    code_result = check_code(code["code"])
    # Проверка наличия кода
    if not code_result:
        print("!!! Code is invalid")
        return jsonify({"error": "Code is invalid"}), 400
    elif code_result["used"]:
        print("!!! Code is already used")
        return jsonify({"error": "Code is already used",
                        "code": code_result}), 400
    
    conn = get_db_connection()

    cursor = conn.cursor()
    # get last user id
    cursor.execute("SELECT id FROM users ORDER BY id DESC LIMIT 1")
    last_user_id = cursor.fetchone()[0]
    # hobbies, job_title, role, , projects,  , 
    # SQL-запрос для вставки данных в таблицу users
    insert_user_query  = """
    INSERT INTO users (id, login, password, jira_login, name, patronymic, surname, birthdate, tg_nickname, phone, department_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id;
    """

    cursor.execute(insert_user_query , (last_user_id + 1,
        user_info["login"], user_info["password"], user_info["jira_login"],
        user_info["name"], user_info["patronymic"], user_info["surname"],
        user_info["birthdate"], user_info["tg_nickname"], user_info["phone"],
        user_info["department_id"]
    ))

    # Получаем сгенерированный id
    user_id = cursor.fetchone()[0]
    # print(user_id)

    # Выполняем вставку роли пользователя
    # add_default_role(user_id, DEFAULT_USER_ROLE_ID)

    # SQL-запрос для вставки данных в user_roles
    insert_role_query = """
    INSERT INTO user_roles (user_id, role_id)
    VALUES (%s, %s);
    """
    # Выполняем вставку роли пользователя
    cursor.execute(insert_role_query, (user_id, user_roles["role_id"]))
    # print("role_id", user_roles["role_id"])

    insert_photo_role_query = """
    INSERT INTO user_photos (user_id)
    VALUES (%s);
    """
    # Выполняем вставку роли пользователя
    cursor.execute(insert_photo_role_query, (user_id,))

    # print("photo_id", user_roles["role_id"])
    # SQL-запрос для вставки данных в user_details
    insert_details_query = """
    INSERT INTO user_details (user_id, interests)
    VALUES (%s, %s);
    """
    # Выполняем вставку роли пользователя
    cursor.execute(insert_details_query, (user_id, user_details["interests"]))
    # print("interests", user_details["interests"])
    
    # SQL-запрос для вставки данных в user_job_titles
    insert_job_title_query = """
    INSERT INTO user_job_titles (user_id, job_title, job_role, projects, onboarding_date)
    VALUES (%s, %s, %s, %s, %s);
    """
    # Выполняем вставку роли пользователя
    cursor.execute(insert_job_title_query, (user_id, user_job_info["job_title"], user_job_info["role"], user_job_info["projects"], user_job_info["onboarding_date"]))
    # print("job_title", user_job_info["job_title"])
    # return code_result

    # SQL-запрос для вставки данных в user_teams
    insert_team_query = """
    INSERT INTO user_teams (user_id, team_id)
    VALUES (%s, %s);
    """
    # Выполняем вставку роли пользователя
    cursor.execute(insert_team_query, (user_id, user_teams["team_id"]))
    # print("team_id", user_teams["team_id"])

    # update codes table: code_is_used = True (boolean)
    update_code_query = """
        UPDATE codes
        SET code_is_used = TRUE
        WHERE id = %s;
    """

    cursor.execute(update_code_query, (int(code_result["id"]),))
    conn.commit()  # Фиксируем изменения
    # add initial achievements via json request to endpoint /achievements/add
    add_default_achievement(user_id, 17)

    print(f"Новый пользователь добавлен с id: {user_id}")
    cursor.close()
    conn.close()

    return jsonify({"user_id": user_id}), 200

def add_default_achievement(user_id, achievement_id):
    requests.post("http://localhost:5000/achievements/add", json={
        "user_id": user_id, 
        "achievement_id": achievement_id, 
        "sender_id": 0
    })

def add_default_role(user_id, role_id):
    print(user_id, role_id)
    requests.post("http://localhost:5000/users/add/role", json={
        "user_id": user_id, 
        "role_id": role_id
    })


import random
import string
def random_code_generator():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

def add_codes():
    conn = get_db_connection()
    cursor = conn.cursor()

    # add code to table
    code = random_code_generator()
    insert_code_query = """
        INSERT INTO codes (code_value)
        VALUES (%s)
    """
    cursor.execute(insert_code_query, (code, ))
      
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"code": code}), 200

def get_codes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM codes WHERE code_is_used = FALSE LIMIT 1")
    codes = cursor.fetchall()
    cursor.close()
    conn.close()
    codes = [{"id": code[0], "code": code[1]} for code in codes]
    return jsonify(codes), 200