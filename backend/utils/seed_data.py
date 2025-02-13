import psycopg2
from faker import Faker
from psycopg2.extras import execute_values
import random

# Импорт конфигурации подключения из config.py
from config import DB_CONFIG

# Инициализация Faker
fake = Faker()

# Подключение к базе данных
def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

# Генерация тестовых данных для пользователей
def generate_test_user_data():
    return {
        "login": fake.user_name(),
        "password": "password",
        "name": fake.first_name(),
        "patronymic": fake.first_name(),
        "surname": fake.last_name(),
        "birthdate": fake.date_of_birth(minimum_age=20, maximum_age=60),
        "tg_nickname": f"@{fake.user_name()}",
        "tg_id": random.randint(100000000, 999999999),
        "phone": fake.phone_number(),
        "jira_login": fake.user_name(),  # Добавляем jira_login
        "interests": fake.sentence(),
        "ncoins": random.randint(1, 500),
        "npoints": random.randint(1, 100),
        "thanks_count": random.randint(1, 100),
        "photo": None  # Можно указать путь к изображению, если нужно
    }

# Вставка данных в таблицы roles, departments и job_titles
def insert_initial_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Вставка ролей
        roles = ["admin", "editor", "viewer"]
        cursor.executemany("INSERT INTO roles (role_name) VALUES (%s) ON CONFLICT DO NOTHING;", [(role,) for role in roles])

        # Вставка департаментов
        departments = ["IT", "HR", "Marketing"]
        cursor.executemany("INSERT INTO departments (department_name) VALUES (%s) ON CONFLICT DO NOTHING;", [(dept,) for dept in departments])

        # Вставка должностей
        job_titles = ["Software Engineer", "HR Manager", "Marketing Specialist"]
        cursor.executemany("INSERT INTO job_titles (title) VALUES (%s) ON CONFLICT DO NOTHING;", [(title,) for title in job_titles])

        # Вставка достижений
        achievements = ["Best Developer", "Top Manager", "Marketing Genius"]
        cursor.executemany("INSERT INTO achievements (name, description) VALUES (%s, %s) ON CONFLICT DO NOTHING;", 
                           [(ach, f"Description for {ach}") for ach in achievements])

        # Фиксируем изменения
        conn.commit()
        print("Данные для ролей, департаментов, должностей и достижений успешно добавлены.")
    except Exception as e:
        print(f"Ошибка при вставке начальных данных: {e}")
        conn.rollback()
    finally:
        cursor.close()

# Вставка данных в таблицу users и связанные таблицы
def seed_users_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Генерируем и вставляем 3 пользователя
        users = [generate_test_user_data() for _ in range(3)]
        user_values = [
            (
                user["tg_id"], user["login"], user["password"], user["name"], user["patronymic"], user["surname"],
                user["birthdate"], user["tg_nickname"], user["phone"], user["jira_login"]
            )
            for user in users
        ]

        # Вставляем пользователей в таблицу users
        query = """
        INSERT INTO users (tg_id, login, password, name, patronymic, surname, birthdate, tg_nickname, phone, jira_login) 
        VALUES %s RETURNING id;
        """
        execute_values(cursor, query, user_values)
        user_ids = [row[0] for row in cursor.fetchall()]

        # Вставка в таблицу user_details
        details_values = [
            (
                user_ids[i], users[i]["interests"], users[i]["ncoins"], users[i]["npoints"]
            )
            for i in range(3)
        ]
        cursor.executemany("""
        INSERT INTO user_details (user_id, interests, ncoins, npoints) 
        VALUES (%s, %s, %s, %s);
        """, details_values)

        # Вставка в таблицу user_photos
        photos_values = [(user_ids[i], None) for i in range(3)]  # Здесь можно заменить None на данные фото
        cursor.executemany("""
        INSERT INTO user_photos (user_id, photo) 
        VALUES (%s, %s);
        """, photos_values)

        # Вставка связей user_roles
        role_ids = [1, 2, 3]  # id для ролей (admin, editor, viewer)
        role_values = [(user_ids[i], role_ids[i % 3]) for i in range(3)]
        cursor.executemany("""
        INSERT INTO user_roles (user_id, role_id) 
        VALUES (%s, %s);
        """, role_values)

        # Вставка в таблицу teams
        department_ids = [1, 2, 3]  # id для департаментов (IT, HR, Marketing)
        team_names = ["Team IT", "Team HR", "Team Marketing"]
        team_values = [
            (department_ids[i], team_names[i])
            for i in range(3)
        ]
        cursor.executemany("""
        INSERT INTO teams (department_id, team_name) 
        VALUES (%s, %s);
        """, team_values)

        # Получаем team_id для вставки в user_teams
        cursor.execute("SELECT id FROM teams;")
        team_ids = [row[0] for row in cursor.fetchall()]

        # Вставка связей user_teams
        team_values = [(user_ids[i], team_ids[i % 3]) for i in range(3)]
        cursor.executemany("""
        INSERT INTO user_teams (user_id, team_id) 
        VALUES (%s, %s);
        """, team_values)

        # Вставка связей user_job_titles
        job_titles = [1, 2, 3]  # id для должностей
        job_title_values = [(user_ids[i], job_titles[i % 3]) for i in range(3), "job role"]
        cursor.executemany("""
        INSERT INTO user_job_titles (user_id, job_title, job_role) 
        VALUES (%s, %s);
        """, job_title_values)

        # Вставка достижений для пользователей
        achievement_ids = [1, 2, 3]  # id для достижений
        achievement_values = [(user_ids[i], achievement_ids[i % 3], fake.date_this_decade(), random.randint(1, 5)) for i in range(3)]
        cursor.executemany("""
        INSERT INTO user_achievements (user_id, achievement_id, date_achievement, achievement_count) 
        VALUES (%s, %s, %s, %s);
        """, achievement_values)

        # Вставка благодарностей
        thanks_values = [(user_ids[i], users[i]["thanks_count"]) for i in range(3)]
        cursor.executemany("""
        INSERT INTO user_thanks (user_id, thanks_count) 
        VALUES (%s, %s);
        """, thanks_values)

        # Фиксируем изменения
        conn.commit()
        print("Тестовые данные успешно добавлены в таблицы users и связанные таблицы.")
    except Exception as e:
        print(f"Ошибка при добавлении тестовых данных: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Основной блок выполнения
if __name__ == "__main__":
    insert_initial_data()  # Вставка начальных данных (роли, департаменты, должности, достижения)
    seed_users_data()      # Вставка пользователей и связанных данных
