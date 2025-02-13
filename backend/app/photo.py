from db import get_db_connection
from flask import Response, jsonify, request
import base64

def get_user_photo(user_id):
    res = get_photo(user_id)
    return res

def get_photo(user_id):
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
      cursor.execute("SELECT photo FROM user_photos WHERE user_id = %s;", (user_id,))
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

def upload_photo(user_id):
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
    data = request.get_json()

    # Получаем фото в формате base64
    photo_base64 = data.get('photo')

    if not photo_base64:
        return jsonify({"error": "Photo is required"}), 400

    try:
        # Декодируем фото из Base64
        photo_data = base64.b64decode(photo_base64)

        # Подключаемся к базе данных
        conn = get_db_connection()
        cursor = conn.cursor()

        # Проверяем, существует ли пользователь
        cursor.execute("SELECT id FROM users WHERE id = %s;", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Записываем фото в базу данных
        cursor.execute("""
            UPDATE user_photos
            SET photo = %s
            WHERE user_id = %s;
        """, (photo_data, user_id))

        conn.commit()

         # Сброс кеша: обновляем ETag или устанавливаем свежий Cache-Control
        response = Response("Photo uploaded successfully")
        response.cache_control.must_revalidate = True

        return jsonify({"message": response}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()
