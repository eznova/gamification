from flask import jsonify, request
from db import get_db_connection
from datetime import datetime
from notifier import *


# Эндпоинт для получения новостей
from flask import request, jsonify

def get_news():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Получаем параметры пагинации из запроса
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    offset = (page - 1) * limit  # Вычисляем смещение

    query = """
        SELECT news.id, title, content, name, surname, created_at,
            (SELECT COUNT(*) FROM news_likes WHERE news_id = news.id) AS likes_count
        FROM news
        JOIN users ON news.author_id = users.id
        ORDER BY created_at DESC
        LIMIT %s OFFSET %s
    """
    
    cursor.execute(query, (limit, offset))
    news = cursor.fetchall()
    conn.close()

    results = []
    for new in news:
        results.append({
            'id': new[0],
            'title': new[1],
            'content': new[2],
            'author': {
                'name': new[3],
                'surname': new[4]
            },
            'created_at': new[5],
            'likes_count': new[6]
        })

    return jsonify(results), 200



# Эндпоинт для добавления новости
def add_news():
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        author_id = data.get('author_id')
        created_at = datetime.now()
        image = data.get('image') if data.get('image') else None

        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO news (title, content, author_id, created_at, image)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (title, content, author_id, created_at, image))
        conn.commit()

        # Проверяем, был ли добавлен хотя бы один ряд
        if cursor.rowcount > 0:
            conn.close()
            notification = {'title': title, 'content': content, 'image': image, 'author': author_id, 'created_at': created_at}
            send_news_notification(notification)
            return jsonify({'message': 'Новость успешно добавлена', 'result': 'success'}), 200
        else:
            conn.close()
            return jsonify({'message': 'Ошибка при добавлении новости', 'result': 'error'}), 400

    except Exception as e:
        # Общая обработка других ошибок
        conn.close()
        return jsonify({'message': f'Произошла ошибка: {str(e)}', 'result': 'error'}), 500

from flask import jsonify

def like_news(news_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Добавляем лайк
    query = """
        INSERT INTO news_likes (news_id, user_id)
        VALUES (%s, %s)
    """
    cursor.execute(query, (news_id, user_id))
    conn.commit()

    # Получаем обновленное количество лайков
    query_count = """
        SELECT COUNT(*) FROM news_likes WHERE news_id = %s
    """
    cursor.execute(query_count, (news_id,))
    likes_count = cursor.fetchone()[0]

    conn.close()
    return jsonify({'message': 'News liked successfully', 'likes_count': likes_count})

def unlike_news(news_id, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Удаляем лайк
    query = """
        DELETE FROM news_likes
        WHERE news_id = %s AND user_id = %s
    """
    cursor.execute(query, (news_id, user_id))
    conn.commit()

    # Получаем обновленное количество лайков
    query_count = """
        SELECT COUNT(*) FROM news_likes WHERE news_id = %s
    """
    cursor.execute(query_count, (news_id,))
    likes_count = cursor.fetchone()[0]

    conn.close()
    return jsonify({'message': 'News unliked successfully', 'likes_count': likes_count})


def get_user_liked_news(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT news_id
        FROM news_likes
        WHERE user_id = %s
    """
    cursor.execute(query, (user_id,))
    news_ids = [row[0] for row in cursor.fetchall()]
    conn.close()
    return {'news_ids': news_ids }

def get_news_likes_count(news_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT COUNT(*) FROM news_likes WHERE news_id = %s
    """
    cursor.execute(query, (news_id,))
    count = cursor.fetchone()[0]
    conn.close()
    return {'likes_count': count}

def remove_news(news_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        DELETE FROM news WHERE id = %s
    """
    cursor.execute(query, (news_id,))
    conn.commit()
    conn.close()
    return {'message': 'News removed successfully'}