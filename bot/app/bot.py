import requests
import time
import logging
from config import *
from tg import send_message, get_updates
from auth import *
import sys
sys.path.append('handlers')
from handlers.main import *

def main():
    """Основная логика бота"""
    last_update_id = None

    while True:
        updates = get_updates(last_update_id)
        if updates.get("result"):
            for update in updates["result"]:
                last_update_id = update["update_id"] + 1

                if "message" in update:
                    chat_id = update["message"]["chat"]["id"]
                    text = update["message"].get("text", "")

                    logging.info(f"Получено сообщение от {chat_id}: {text}")
                    
                    # Обработка команд
                    if text == "/start":
                        send_message(chat_id, "Привет! Я бот NIIAS GAME", reply_markup=INLINE_KEYBOARD)
                    elif "linktg" in text:
                        token = text.split("linktg")[-1].strip()
                        status = send_token_to_backend(token, chat_id)
                        if status == 200:
                            send_message(chat_id, "✅ Токен успешно отправлен!")
                        else:
                            send_message(chat_id, "❌ Пользователь не зарегистрирован или телеграм аккаунт уже связан!")
                    elif text:  # Для остальных сообщений, проверим на благодарность
                        # Проверим, если чат в процессе отправки благодарности
                        if chat_id in thank_colleague_data:
                            # Это сообщение благодарности
                            handle_thank_colleague_text(chat_id, text)
                        elif chat_id in thank_colleague_input_data:
                            handle_thank_colleague_input(chat_id, text)
                        else:
                            # Обычное сообщение
                            send_message(chat_id, f"Ваше сообщение: {text}")

                # Обработка callback_query
                if "callback_query" in update:
                    process_callback_query(update["callback_query"])

        time.sleep(1)

if __name__ == "__main__":
    logging.info("Бот запущен...")
    main()
