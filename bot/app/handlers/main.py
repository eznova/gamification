import logging
import requests
import sys
sys.path.append('../')
from tg import send_message
from handlers.wallet import *
from handlers.top10 import *
from handlers.news import *
from handlers.rating import *
from handlers.memes import *
from handlers.thanks import *

def answer_callback_query(callback_query_id):
    """Отправляем ответ на callback_query"""
    params = {"callback_query_id": callback_query_id, "text": "Выполнено!"}
    try:
        response = requests.post(URL + "answerCallbackQuery", json=params)
        response.raise_for_status()
        logging.info("Ответ на callback_query отправлен.")
    except requests.RequestException as e:
        logging.error(f"Ошибка при отправке ответа на callback_query: {e}")

def process_callback_query(callback_query):
    logging.debug(f"Обрабатываем callback_query: {callback_query}")
    """Обрабатываем callback_query от кнопок"""
    callback_data = callback_query["data"]
    chat_id = callback_query["message"]["chat"]["id"]
    callback_query_id = callback_query["id"]  # Получаем id для ответа на callback
    # send_message(chat_id, "Запрос обрабатывается ...", reply_markup=None)

    # Отправляем ответ на callback_query, чтобы уведомить Telegram
    answer_callback_query(callback_query_id)

    # Проверяем, что callback_data начинается с "mm_" для главного меню
    if callback_data.startswith("mm_"):
        logging.debug(f"Обрабатываем callback_data: {callback_data}")
        # Главные кнопки меню, например:
        if callback_data == "mm_thank_colleague":
            handle_thank_colleague(chat_id)
        elif callback_data == "mm_check_wallet":
            handle_check_wallet(chat_id)
        elif callback_data == "mm_check_points":
            handle_check_points(chat_id)
        elif callback_data == "mm_top_users":
            handle_top_users(chat_id)
        elif callback_data == "mm_meme_of_month":
            handle_meme_of_day(chat_id)
        elif callback_data == "mm_latest_news":
            handle_latest_news(chat_id)
    elif callback_data.startswith("letter_"):
        handle_thanks_callback(chat_id, callback_data)
    elif callback_data.startswith("user_"):
        handle_thanks_callback(chat_id, callback_data)
    else:
        # Если callback_data не начинается с "mm_", можно добавить обработку для других кнопок (например, кнопки с буквами)
        send_message(chat_id, "Неверная команда или формат callback_data.")
