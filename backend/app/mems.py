from db import get_db_connection
from flask import jsonify, request, Response
from datetime import datetime
import base64


def get_mems(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # get mems where id is not in user_mems
        query = """
            SELECT id, name, author_id, created_at, moderated
            FROM mems
            WHERE id NOT IN (SELECT mem_id FROM user_mems WHERE user_id = %s) AND moderated = TRUE
            ORDER BY created_at DESC
        """
        
        cursor.execute(query, (user_id,))
        mems = cursor.fetchall()
        cursor.close()
        conn.close()
        mem_info = []
        for mem in mems:
            mem_info.append({
                "id": mem[0],
                "name": mem[1],
                "author_id": mem[2],
                "created_at": mem[3],
                "moderated": mem[4],
                "user_id": user_id
            })
        return jsonify(mem_info), 200
    except Exception as e:
        return jsonify({"error": str(e), 'status': 'failed'}), 500
    

def add_mem():
    try:
        data = request.get_json()
        name = data.get('name')
        image = data.get('image')
        author_id = data.get('author_id')
        created_at = datetime.now()
        likes_count = 0

        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO mems (name, author_id, created_at)
            VALUES (%s, %s, %s)
            RETURNING id
        """
        cursor.execute(query, (name, author_id, created_at))
        conn.commit()
        # get id
        cursor.execute("SELECT MAX(id) FROM mems")
        mem_id = cursor.fetchone()[0]


        upload_mem(mem_id, data)
        cursor.close()
        conn.close()
        return jsonify({"message": "Mem added successfully", 'status': 'success'}), 200
    except Exception as e:
        return jsonify({"error": str(e), 'status': 'failed'}), 500
    

def upload_mem(mem_id, data):
    """
    Upload user photo in base64 format and store it in the database.
    ---
    parameters:
      - name: photo
        in: body
        required: true
        schema:
          type: object
          properties:
            photo:
              type: string
              description: Base64 encoded photo
    responses:
      200:
        description: Photo uploaded successfully
      400:
        description: Missing or invalid photo
      500:
        description: Server error
    """

    print(mem_id)
    # data = request.get_json()

    # Получаем фото в формате base64
    photo_base64 = data.get('image')

    if not photo_base64:
        return jsonify({"error": "Photo is required", 'status': 'failed'}), 400

    try:
        # Декодируем фото из Base64
        photo_data = base64.b64decode(photo_base64)

        # Подключаемся к базе данных
        conn = get_db_connection()
        cursor = conn.cursor()

        # Записываем фото в базу данных
        cursor.execute("""
            UPDATE mems
            SET image = %s
            WHERE id = %s;
        """, (photo_data, mem_id))

        conn.commit()

         # Сброс кеша: обновляем ETag или устанавливаем свежий Cache-Control
        response = Response("Photo uploaded successfully")
        response.cache_control.must_revalidate = True

        return jsonify({"message": response, 'status': 'success'}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

def get_mem_image(mem_id):
    res = get_image(mem_id)
    return res

def get_image(mem_id):
    from PIL import Image
    import io
    """
    Get user photo in binary format from the database.
    ---
    parameters:
      - name: user_id
        in: path
        required: true
        schema:
          type: integer
          description: ID of the user
    responses:
      200:
        description: Photo retrieved successfully
      404:
        description: User or photo not found
      500:
        description: Server error
    """
    try:
      # Подключаемся к базе данных
      conn = get_db_connection()
      cursor = conn.cursor()

      # Получаем фото из базы данных
      cursor.execute("SELECT image FROM mems WHERE id = %s;", (mem_id,))
      photo_data = cursor.fetchone()

      if photo_data and photo_data[0]:
          # Если данные есть, используем их
          user_photo = photo_data[0]
      else:
          # Если данных нет, загружаем фото по умолчанию
          with open("imgs/default_photo.png", "rb") as default_photo:
              user_photo = default_photo.read()

      # Возвращаем данные как изображение
      response = Response(user_photo, mimetype='image/png')
      # Можно добавить кеширование, если нужно
      # response.cache_control.max_age = 3600  # Кешируем на 1 час
      # response.cache_control.public = True  # Указывает, что фото может быть кешировано

      return response

    except Exception as e:
        return Response(f"Error: {str(e)}", status=500)

    finally:
        cursor.close()
        conn.close()

def get_best_mem():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT id 
            FROM mems 
            ORDER BY average_rate DESC 
            LIMIT 1;
        """
        cursor.execute(query)
        mem_id = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({'id': mem_id[0]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def rate_mem():
    # get from json post
    data = request.get_json()
    print(data)
    rating = data.get('rating')
    mem_id = data.get('mem_id')
    user_id = data.get('user_id')
    created_at = datetime.now()

    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Вставка нового рейтинга в таблицу user_mems
        query = """
            INSERT INTO user_mems (user_id, mem_id, created_at, likes_count)
            VALUES (%s, %s, %s, %s)
            returning id
        """
        cursor.execute(query, (user_id, mem_id, created_at, rating))
        cursor_id = cursor.fetchone()[0]
        print('cursor',cursor_id)
        print(rating, mem_id, user_id, created_at)
        conn.commit()
        
        # Пересчет среднего рейтинга для мема
        memRateQuery = """
            UPDATE mems
            SET average_rate = (
                SELECT AVG(likes_count) 
                FROM user_mems 
                WHERE mem_id = %s
            )
            WHERE id = %s
        """
        cursor.execute(memRateQuery, (mem_id, mem_id))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Rating updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def moderate_mem():
    try:
        data = request.get_json()
        print(data)
        mem_id = data.get('mem_id')
        result = data.get('result')
        conn = get_db_connection()
        cursor = conn.cursor()
        if result == 'true':
            query = """
                UPDATE mems
                SET moderated = %s
                WHERE id = %s;
            """
            cursor.execute(query, (result, mem_id))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "Mem approved successfully", "result": "success"}), 200
        else:
          # remove mem
          query = """
              DELETE FROM mems
              WHERE id = %s;
          """
          cursor.execute(query, (mem_id,))
          conn.commit()
          cursor.close()
          conn.close()
          return jsonify({"message": "Mem rejected successfully", "result": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "result": "failed"}), 500

def get_unmod_mems():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # get mems where id is not in user_mems
        query = """
            SELECT id, name, author_id, created_at, moderated
            FROM mems
            WHERE moderated = FALSE
            ORDER BY created_at DESC
        """
        
        cursor.execute(query)
        mems = cursor.fetchall()
        cursor.close()
        conn.close()
        mem_info = []
        for mem in mems:
            mem_info.append({
                "id": mem[0],
                "name": mem[1],
                "author_id": mem[2],
                "created_at": mem[3],
                "moderated": mem[4],
            })
        return jsonify(mem_info), 200
    except Exception as e:
        return jsonify({"error": str(e), 'status': 'failed'}), 500