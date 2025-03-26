from db import get_db_connection
from flask import jsonify, request
from psycopg2.extras import RealDictCursor


# get_user_id by tg_id
def get_user_id():
    data = request.get_json()
    tg_id = data.get('tg_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE tg_id = %s", (tg_id,))
    user_id = cursor.fetchone()
    cursor.close()
    conn.close()
    if user_id:
        print(user_id)
        return jsonify({"user_id": user_id[0], "status": "success"}), 200
    else:
        return jsonify({"user_id": None, "status": "User not found"}), 200


# Эндпоинт для получения ncoins и рейтинга пользователя по user_id
def get_user_details(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        SELECT ncoins, npoints, interests
        FROM user_details
        WHERE user_id = %s;
        """
        cursor.execute(query, (user_id,))
        details = cursor.fetchone()

        cursor.close()
        conn.close()

        if not details:
            return jsonify({"message": "No details found for this user"}), 404

        return jsonify({
            "user_id": user_id,
            "ncoins": details[0],
            "npoints": details[1],
            "interests": details[2]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT u.id, name, surname, patronymic, job_role, department_name, job_title
        FROM users u
        JOIN user_details ud ON u.id = ud.user_id
        JOIN user_job_titles ujt ON u.id = ujt.user_id
        JOIN departments d ON u.department_id = d.id
        WHERE u.is_active = true
        """
        cursor.execute(query)
        users = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(users), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_user_team_members(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        departmentQuery = """
        SELECT department_id
        FROM users u
        WHERE u.id = %s
        """

        cursor.execute(departmentQuery, (user_id,))
        department_id = cursor.fetchone()['department_id']
        # get user team members by department_id
        query = """
        SELECT u.id, name, surname, job_role, department_name
        FROM users u
        JOIN user_job_titles ujt ON u.id = ujt.user_id
        JOIN departments d ON u.department_id = d.id
        WHERE d.id = %s and u.is_active = true
        """
        cursor.execute(query, (department_id,))
        team = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(team), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_user_personal(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT id, tg_id, login, jira_login, name, patronymic, surname, birthdate, tg_nickname, phone, department_id, grade_id
        FROM users
        WHERE id = %s;
        """
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_user_job_titles_and_departments(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT ujt.job_title, d.department_name, ujt.job_role, ujt.projects
        FROM user_job_titles ujt
        JOIN users u ON u.id = ujt.user_id 
        JOIN departments d ON u.department_id = d.id
        JOIN user_roles ur ON ujt.user_id = ur.user_id
        WHERE ujt.user_id = %s;
        """
        cursor.execute(query, (user_id,))
        job_details = cursor.fetchall()

        cursor.close()
        conn.close()

        if not job_details:
            return jsonify({"message": "No job titles or departments found for this user"}), 404

        result = {
            "user_id": user_id,
            "job_titles": [{"title": job["job_title"], "department": job["department_name"], "role": job["job_role"], "projects": job["projects"]} for job in job_details]
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_departments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT id, department_name
        FROM departments;
        """
        cursor.execute(query)
        departments = cursor.fetchall()

        department_info = []
        for department in departments:
            department_info.append({
                "id": department["id"],
                "department_name": department["department_name"]
            })

        cursor.close()
        conn.close()
        departments = department_info
        return jsonify(departments), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_user_roles(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT r.id, role_name
        FROM roles r
        JOIN user_roles ON user_roles.role_id = r.id
        WHERE user_id = %s;
        """
        cursor.execute(query, (user_id,))
        roles = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(roles), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_user_available_roles(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT id, role_name
        FROM roles
        WHERE id NOT IN (SELECT role_id FROM user_roles WHERE user_id = %s);
        """
        cursor.execute(query, (user_id,))
        roles = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(roles), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def add_user_role():
    try:
        data = request.get_json()
        role_id = data.get('role_id')
        user_id = data.get('user_id')
        print(data)
        conn = get_db_connection()
        cursor = conn.cursor()
        if role_id != 11:
            query = """
            INSERT INTO user_roles (role_id, user_id) VALUES (%s, %s);
            """
            # uncomment to add role
            cursor.execute(query, (role_id, user_id))
            conn.commit()

            # check if user is admin
            query = """
                SELECT 
                    CASE 
                        WHEN COUNT(*) > 0 THEN TRUE 
                        ELSE FALSE 
                    END AS result
                FROM user_roles ur
                JOIN users u ON u.id = ur.user_id
                WHERE ur.user_id = %s AND u.department_id = 1;
            """
            print(query)
            cursor.execute(query, (user_id,))
            admin_roles = cursor.fetchone()[0]
            print(f'admin_roles: {admin_roles}')
            cursor.execute("SELECT department_id FROM users WHERE id = %s", (user_id,))
            department_id = cursor.fetchone()[0]
            print(f'User {user_id} department id: {department_id}')

            if admin_roles == True:
                print(f"User {user_id} is in administration department")
                # get user department id
                # get role achievements max count
                cursor.execute("SELECT achievement_id, max_count FROM role_achievements WHERE role_id = %s and department_id = %s", (role_id, department_id))
                max_balance = cursor.fetchall()
                for balance in max_balance:
                    cursor.execute("INSERT INTO user_achievements_balance (user_id, achievement_id, count) VALUES (%s, %s, %s)", (user_id, balance[0], balance[1]))
                    conn.commit()
                if int(role_id) == 4:
                    cursor.execute("DELETE FROM users WHERE id = 1")
                    conn.commit()

            else:
                print(f"User {user_id} is not in administration department")
                query = """
                    select  id from achievements a where department_only = true;
                """
                cursor.execute(query)
                achievements = cursor.fetchall()
                # get users count in department
                cursor.execute("SELECT COUNT(*) FROM users WHERE department_id = %s", (department_id,))
                users_count = cursor.fetchone()[0]
                print(f'In department {department_id} users count: {users_count}')
                # get role achievements max count
                max_count = round(users_count / 5) if users_count > 5 else 1
                print(f'In department {department_id} max count: {max_count} for role {role_id}')
                for achievement in achievements:
                    # print(achievement)
                    # get max id
                    cursor.execute("SELECT MAX(id) FROM user_achievements_balance")
                    max_id = cursor.fetchone()[0]
                    if max_id is None:
                        max_id = 0
                    max_id += 1
                    cursor.execute("INSERT INTO user_achievements_balance (id, user_id, achievement_id, count) VALUES (%s, %s, %s, %s)", (max_id, user_id, achievement[0], max_count))
                    conn.commit()
                    # add max count to role_achievements
                    # get role achievements max count
                    cursor.execute("SELECT MAX(id) FROM role_achievements")
                    max_id = cursor.fetchone()[0]
                    if max_id is None:
                        max_id = 0
                    max_id += 1
                    cursor.execute("INSERT INTO role_achievements (id, role_id, achievement_id, department_id, max_count) VALUES (%s, %s, %s, %s, %s)", (max_id, role_id, achievement[0], department_id, max_count))
                    conn.commit()
                cursor.close()
                conn.close()
        else:
            query = """
                UPDATE users SET is_active = false WHERE id = %s;
            """
            cursor.execute(query, (user_id,))
            conn.commit()
            cursor.close()
            conn.close()
        return jsonify({"message": "User role added successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500

def remove_user_role():
    try:
        data = request.get_json()
        role_id = data.get('role_id')
        user_id = data.get('user_id')
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
          DELETE FROM user_roles WHERE role_id = %s AND user_id = %s;
        """
        cursor.execute(query, (role_id, user_id))
        conn.commit()
        # get user department id
        cursor.execute("SELECT department_id FROM users WHERE id = %s", (user_id,))
        department_id = cursor.fetchone()[0]
        # get role achievements
        cursor.execute("SELECT achievement_id FROM role_achievements WHERE role_id = %s and department_id = %s", (role_id, department_id))
        achievements = cursor.fetchall()
        for achievement in achievements:
            cursor.execute("DELETE FROM user_achievements_balance WHERE user_id = %s and achievement_id = %s", (user_id, achievement[0]))
            print(f"Deleting user_achievements_balance for user {user_id} and achievement {achievement[0]} and department {department_id}")
            if department_id != 1:
                # delete role_achievements
                print(f"Deleting role_achievements for user {user_id} and achievement {achievement[0]} and department {department_id}")
                cursor.execute("DELETE FROM role_achievements WHERE role_id = %s and achievement_id = %s and department_id = %s", (role_id, achievement[0], department_id))
            conn.commit()

        cursor.close()
        conn.close()
        return jsonify({"message": "User role removed successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "failed"}), 500
    
def get_roles():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT id, role_name
        FROM roles;
        """
        cursor.execute(query)
        roles = cursor.fetchall()
        roles = [{"id": role["id"], "role_name": role["role_name"]} for role in roles]
        cursor.close()
        conn.close()

        return jsonify(roles), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500