from db import get_db_connection
import requests
from config import TELEGRAM_BOT_TOKEN, FRONT_BASE_URL
import os
import tempfile

def get_users_tg_ids():
    # код для получения списка идентификаторов пользователей
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT tg_id FROM users")
    users = cursor.fetchall()
    print(users)
    conn.close()
    active_tg_ids = [user[0] for user in users if user[0] is not None]
    return active_tg_ids

def send_telegram_message(chat_id, message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": message, "parse_mode": "Markdown"}
    requests.post(url, data=payload)

def send_news_notification(notification):
    # код для отправки уведомления пользователю
    tg_ids = get_users_tg_ids()
    print(f"Sending news notification {notification} to {tg_ids}")
    # id = notification.get("id", "")
    title = notification.get("title", "")
    created_at = notification.get("created_at", "")
    content = notification.get("content", "")

    message = "📰 Выпущена новость:\n"
    # Формируем строку с отформатированным контентом
    # message += f"{id}. "  # ID новости (можно удалить, если не нужно)
    message += f"*{title}* "  # Жирный заголовок
    message += f"({created_at})\n"
    message += f"_{content}_\n\n"  # Курсивное содержание
    for tg_id in tg_ids:
        send_telegram_message(tg_id, message)
    return

def send_telegram_image(chat_id, image_path, message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
    files = {"photo": open(image_path, "rb")}
    payload = {"chat_id": chat_id, "caption": message, "parse_mode": "Markdown"}
    requests.post(url, files=files, data=payload)

def download_and_send_image(achievement_url, reciever_tg_id, message_text):
    # Скачиваем файл по URL
    response = requests.get(achievement_url)
    
    if response.status_code == 200:
        print("Файл успешно скачан!")
        # Создаем временный файл для хранения изображения
        with tempfile.NamedTemporaryFile(delete=False, suffix='.svg') as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        # Отправляем изображение
        send_telegram_image(reciever_tg_id, temp_file_path, message_text)

        # Удаляем временный файл после отправки
        os.remove(temp_file_path)
    else:
        print(f"Ошибка скачивания изображения: {response.status_code}")

def send_thx_notification(thx_data):
    print(f"Sending thx notification {thx_data}")
    sender_id = thx_data.get('sender_id')
    reciever_id = thx_data.get('reciever_id')
    message = thx_data.get('message')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT tg_id FROM users WHERE id = %s", (reciever_id,))
    reciever_tg_id = cursor.fetchone()[0]
    cursor.execute("SELECT name, surname, patronymic FROM users WHERE id = %s", (sender_id,))
    sender_name = cursor.fetchone()
    conn.close()

    message_text = f"Пользователь {sender_name[1]} {sender_name[0]} {sender_name[2]} благодарит тебя\n"
    message_text += f'_{message}_\n\n'
    achievement_url = f'{FRONT_BASE_URL}/imgs/achievements/webp/thanks.webp'
    # Пример использования
    download_and_send_image(achievement_url, reciever_tg_id, message_text)
    # код для отправки уведомления пользователю
    return

# def send_telegram_sticker(chat_id, sticker_url, message):
#     url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendSticker"
#     payload = {
#         "chat_id": chat_id,
#         "caption": message,
#         "parse_mode": "Markdown",
#         "sticker": sticker_url
#     }
#     requests.post(url, data=payload)

