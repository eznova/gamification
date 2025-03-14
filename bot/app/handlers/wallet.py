import sys
sys.path.append('../')
from tg import *
from config import BACKEND_BASE_URL, FRONTEND_BASE_URL
import requests

def get_store_items(ncoins):
    try:
        response = requests.get(f'{BACKEND_BASE_URL}/store/items')
        response.raise_for_status()
        store = response.json()
        store = [item for item in store if item['price'] <= ncoins]
        return store
    except requests.RequestException as e:
        logging.error(f"Ошибка при получении данных из store: {e}")
        return []
    
def handle_check_wallet(chat_id):
    try:
        response = requests.post(f'{BACKEND_BASE_URL}/users/get/id', json={"tg_id": chat_id})
        response.raise_for_status()
        user_id = response.json().get("user_id")
        status = response.json().get("status")
        if user_id is None or status == "User not found":
            send_message(chat_id, "❌ Пользователь не найден.")
            return
        # Выполняем запрос к backend для получения кошелька пользователя
        response = requests.get(f'{BACKEND_BASE_URL}/users/get/{user_id}/details')
        response.raise_for_status()  # Проверяем на ошибки
        data = response.json()  # Преобразуем в JSON
        ncoins = data.get("ncoins", 0)
        message_text = f"У тебя на балансе {int(ncoins)} Ncoins"
        send_message(chat_id, message_text)
        store_items = get_store_items(ncoins)
        if len(store_items) > 0:
            available_items = "Ты можешь купить:\n"
            for item in store_items:
                available_items += f"{item['name']} - {item['price']} Ncoins\n"

            available_items += f"\n[Перейти в магазин ➡️]({FRONTEND_BASE_URL}/account?navItem=store)"
            send_message(chat_id, available_items)
    except requests.RequestException as e:
        # Логируем ошибку при запросе
        logging.error(f"Ошибка при запросе к бэкенду: {e}")
    show_keyboard(chat_id)