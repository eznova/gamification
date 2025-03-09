import requests
import logging
from config import URL, INLINE_KEYBOARD

def get_updates(offset=None):
    """Получение обновлений от Telegram API"""
    params = {"timeout": 30, "offset": offset}
    try:
        response = requests.get(URL + "getUpdates", params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        logging.error(f"Ошибка при получении обновлений: {e}")
        return {}

def send_message(chat_id, text, reply_markup=None):
    """Отправка сообщения пользователю с возможной клавиатурой"""
    params = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    
    # Если reply_markup передан, добавляем его в параметры
    if reply_markup:
        params["reply_markup"] = reply_markup

    try:
        response = requests.post(URL + "sendMessage", json=params)
        response.raise_for_status()
        logging.debug(f"Сообщение отправлено в {chat_id}: {text}")
    except requests.RequestException as e:
        logging.error(f"Ошибка при отправке сообщения: {e} - Параметры: {params}")

def send_image(chat_id, image, text):
    params = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    """Отправка изображения пользователю"""
    response = requests.post(URL + "sendPhoto", files={"photo": image}, data={"chat_id": chat_id, "caption": text}, params=params)
    response.raise_for_status()
    logging.debug(f"Изображение отправлено в {chat_id}")

def show_keyboard(chat_id):
    send_message(chat_id, "Выберите действие:", reply_markup=INLINE_KEYBOARD)