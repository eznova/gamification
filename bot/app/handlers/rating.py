import requests
import sys
sys.path.append('../')
from tg import send_message, show_keyboard
from config import BACKEND_BASE_URL, FRONTEND_BASE_URL
import logging

def handle_check_points(chat_id):
    try:
        response = requests.post(f'{BACKEND_BASE_URL}/users/get/id', json={"tg_id": chat_id})
        response.raise_for_status()
        user_id = response.json().get("user_id")
        status = response.json().get("status")
        if user_id is None or status == "User not found":
            send_message(chat_id, "❌ Пользователь не найден.")
            return
        # Выполняем запрос к backend для получения баллов пользователя
        response = requests.get(f'{BACKEND_BASE_URL}/users/get/{user_id}/details')
        response.raise_for_status()  # Проверяем на ошибки
        data = response.json()  # Преобразуем в JSON
        npoints = data.get("npoints", 0)

        # Выполняем запрос к backend для получения ранга пользователя
        response = requests.get(f'{BACKEND_BASE_URL}/users/get/{user_id}/rank')
        response.raise_for_status()  # Проверяем на ошибки
        data = response.json()  # Преобразуем в JSON
        rank = data.get("rank", 0)

        message_text = f"Ты набрал {npoints} Npoints\nТвоя позиция в рейтинге {rank}"
        message_text += f"\n[Как зарабатывать баллы ➡️]({FRONTEND_BASE_URL})"
        send_message(chat_id, message_text)
    except requests.RequestException as e:
        # Логируем ошибку при запросе
        logging.error(f"Ошибка при запросе к бэкенду: {e}")
        send_message(chat_id, "❌ Ошибка при получении данных с бэкенда.")
    show_keyboard(chat_id)