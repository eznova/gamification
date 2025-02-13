from db import get_db_connection
from flask import jsonify


def get_rules():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM rules ORDER BY id ASC")
        rules = cursor.fetchall()
        cursor.close()
        conn.close()
        rules_info = []
        for rule in rules:
            rules_info.append({
                "id": rule[0],
                "name": rule[1],
                "description": rule[2],
                "type": rule[3]                       
        })
        rules = rules_info
        return jsonify(rules), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500