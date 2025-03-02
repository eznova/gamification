import logging
import requests
import sys
sys.path.append('../')
from tg import send_message, show_keyboard
from config import BACKEND_BASE_URL

user_cache = {}
thank_colleague_data = {}  # Для хранения данных о том, кто и какой текст благодарности написал

def handle_thanks_callback(chat_id, callback_data):
    logging.info(f"Обработка callback_data: {callback_data}")
    global user_cache
    # Обработчик выбора первой буквы фамилии
    if callback_data.startswith("letter_"):
        letter = callback_data.split("_")[1]

        if letter in user_cache:
            user_list = user_cache[letter]

            # Создаем клавиатуру с ФИО пользователей
            keyboard = [[{"text": name, "callback_data": f"user_{name}"}] for name in user_list]
            reply_markup = {"inline_keyboard": keyboard}

            send_message(chat_id, f"Выбери коллегу:", reply_markup)
        else:
            send_message(chat_id, "Нет пользователей с этой буквой.")
    
    # Обработчик выбора ФИО
    elif callback_data.startswith("user_"):
        selected_name = callback_data.split("_")[1].split(".")[0]
        logging.debug(f"Выбран пользователь: {callback_data}")
        response = requests.post(f'{BACKEND_BASE_URL}/users/get/id', json={"tg_id": chat_id})
        response.raise_for_status()
        user_id = response.json().get("user_id")
        status = response.json().get("status")
        if user_id is None or status == "User not found":
            send_message(chat_id, "❌ Пользователь бота не авторизован для этой операции")
            return
        else:
            # send_message(chat_id, "✅ Пользователь бота авторизован.")
            response = requests.get(f'{BACKEND_BASE_URL}/thx/get/{user_id}')
            response.raise_for_status()
            data = response.json()
            thx_count = data.get("thx_count", 0)
            max_thx = data.get("max_thx", 0)
            if thx_count > 0:
                send_message(chat_id, f"Сейчас у тебя {thx_count} / {max_thx} благодарностей")
                send_message(chat_id, f"Кратко напиши, за что хочешь поблагодарить коллегу")
                # Сохраняем, что пользователь собирается отправить благодарность
                thank_colleague_data[chat_id] = selected_name
            else:
                send_message(chat_id, f"Ты потратил все Спасибо, круто, что ты не забываешь благодарить коллег!")
                show_keyboard(chat_id)

def handle_thank_colleague_text(chat_id, text):
    response = requests.post(f'{BACKEND_BASE_URL}/users/get/id', json={"tg_id": chat_id})
    response.raise_for_status()
    user_id = response.json().get("user_id")
    status = response.json().get("status")
    if user_id is None or status == "User not found":
        send_message(chat_id, "❌ Пользователь бота не авторизован для этой операции")
        del thank_colleague_data[chat_id]
        return
    else:
        """Обработчик текста благодарности от пользователя."""
        # Проверим, есть ли данные о текущем процессе благодарности
        if chat_id in thank_colleague_data:
            selected_name = thank_colleague_data[chat_id]
            
            # Запишем текст благодарности
            response = requests.post(f'{BACKEND_BASE_URL}/thx',
                                    json={"sender_id": user_id, "receiver_id": selected_name, "message": text})
            response.raise_for_status()
            logging.debug(f"Текст благодарности сохранен: {text}")
            
            # Подтверждаем, что благодарность отправлена
            send_message(chat_id, f"Благодарность успешно отправлена!")

            # send_message(chat_id, "✅ Пользователь бота авторизован.")
            response = requests.get(f'{BACKEND_BASE_URL}/thx/get/{user_id}')
            response.raise_for_status()
            data = response.json()
            thx_count = data.get("thx_count", 0)
            max_thx = data.get("max_thx", 0)
            send_message(chat_id, f"Сейчас у тебя {thx_count} / {max_thx} благодарностей")
            # Очистим данные о процессе благодарности
            del thank_colleague_data[chat_id]
            show_keyboard(chat_id)
        else:
            send_message(chat_id, "Процесс отправки благодарности не был инициирован. Попробуйте снова.")

def handle_thank_colleague(chat_id):
    global user_cache
    try:
        response = requests.get(f'{BACKEND_BASE_URL}/users/get/all')
        response.raise_for_status()
        users = response.json()

        grouped_users = {}
        for user in users:
            id = user.get('id')
            surname = user.get('surname', '').strip()
            first_letter = surname[0].upper() if surname else '#'
            full_name = f"{id}. {surname} {user.get('name', '')} {user.get('patronymic', '')}".strip()

            if first_letter not in grouped_users:
                grouped_users[first_letter] = []
            grouped_users[first_letter].append(full_name)

        user_cache = grouped_users  # Сохраняем кэш пользователей по буквам

        # Создаем inline-клавиатуру с уникальными первыми буквами
        keyboard = []
        row = []
        for letter in sorted(grouped_users.keys()):
            row.append({"text": letter, "callback_data": f"letter_{letter}"})
            # Если в строке 3 элемента, то добавляем строку в клавиатуру и начинаем новую строку
            if len(row) == 3:
                keyboard.append(row)
                row = []

        # Если есть остаток (меньше 3 букв), добавляем их как отдельную строку
        if row:
            keyboard.append(row)

        reply_markup = {"inline_keyboard": keyboard}

        send_message(chat_id, "Выбери первую букву фамилии:", reply_markup)

    except requests.RequestException as e:
        logging.error(f"Ошибка при получении данных из store: {e}")
        send_message(chat_id, "Произошла ошибка при получении данных. Попробуйте позже.")
