from flask import jsonify
from db import get_db_connection

def get_user_rank(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Query to calculate rank for all users and filter by the specified user_id
        query = """
        WITH ranked_users AS (
            SELECT 
                u.id, 
                name, 
                surname, 
                job_role,
                department_name,
                job_title,
                ncoins, 
                npoints,  
                RANK() OVER (ORDER BY npoints DESC) AS rank
            FROM users u
            JOIN user_details ud ON u.id = ud.user_id
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN user_job_titles ujt ON u.id = ujt.user_id
            JOIN departments d ON u.department_id = d.id
        )
        SELECT * 
        FROM ranked_users 
        WHERE id = %s
        """
        
        # Execute the query with the given user_id
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        # Check if the user exists
        if not user:
            return jsonify({"error": f"User with ID {user_id} not found"}), 404

        # Return JSON response for the specified user
        return jsonify({
            "user_id": user[0],
            "name": f"{user[1]} {user[2]}",
            "role": user[3],
            "department": user[4],
            "title": user[5],
            "ncoins": user[6],
            "npoints": user[7],
            "rank": user[8]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_top10_users():
    """
    Get top 10 users by ncoins and rank by npoints
    ---
    responses:
      200:
        description: A list of top 10 users by ncoins and rank by npoints
        schema:
          id: Top10Users
          properties:
            user_id:
              type: integer
              description: The user's ID
            ncoins:
              type: integer
              description: The user's ncoins
            npoints:
              type: integer
              description: The user's npoints
            rank:
              type: integer
              description: The user's rank based on npoints
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
        SELECT 
            u.id, 
            name, 
            surname,
            job_role,
            department_name,
            job_title,
            ncoins, 
          npoints,
          RANK() OVER (ORDER BY npoints DESC) AS rank
        FROM users u
        JOIN user_job_titles ujt ON u.id = ujt.user_id
        JOIN departments d ON u.department_id = d.id
        JOIN user_details ud ON u.id = ud.user_id
        ORDER BY npoints DESC
        LIMIT 10;
        """


        cursor.execute(query)
        top10_users = cursor.fetchall()

        cursor.close()
        conn.close()
        
        return jsonify({
            "top10_users": [
                {
                    "user_id": user[0], 
                    "name": f"{user[1]} {user[2]}", 
                    "role": user[3], 
                    "department": user[4],
                    "title": user[5],
                    "ncoins": user[6],
                    "npoints": user[7],
                    "rank": user[8]
                } 
                for user in top10_users
            ]}), 200



    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_birthdays(month):
    """
    Get users with birthdays in the specified month and day
    ---
    parameters:
      - name: month
        in: path
        required: true
        schema:
          type: integer
          description: Month of the year
    responses:
      200:
        description: A list of users with birthdays in the specified month
        schema:
          type: array
          items:
            type: object
            properties:
              user_id:
                type: integer
                description: The user's ID
              name:
                type: string
                description: The user's name
              surname:
                type: string
                description: The user's surname
              patronymic:
                type: string
                description: The user's second name
              department:
                type: string
                description: The user's department
              month:
                type: integer
                description: The month of the birthday
              day:
                type: integer
                description: The day of the birthday
    """
    try:
        birthdays = get_birthdays_from_db(month)

        result = [
            {
                "user_id": user[0],
                "name": user[1],
                "patronymic": user[2],
                "surname": user[3],
                "department": user[4],
                "month": month,
                "day": user[5]
            }
            for user in birthdays
        ]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def get_birthdays_from_db(month):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
          SELECT 
            u.id, 
            name, 
            patronymic, 
            surname, 
            department_name,
            EXTRACT(DAY FROM birthdate)
          FROM users u 
          JOIN departments d ON u.department_id = d.id
          WHERE EXTRACT(MONTH FROM birthdate) = %s;
          """
        cursor.execute(query, (int(month),))
        birthdays = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return birthdays
    except Exception as e:
        raise e