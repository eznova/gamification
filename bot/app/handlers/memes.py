import logging
import requests
import sys
sys.path.append('../')
from tg import send_image, send_message, show_keyboard
from config import BACKEND_BASE_URL, FRONTEND_BASE_URL 

def handle_meme_of_day(chat_id):
    """Получение мема месяца с бэкенда и вывод его"""
    try:
        # Выполняем запрос к backend для получения мема месяца
        response = requests.get(f'{BACKEND_BASE_URL}/mems/get/best')
        response.raise_for_status()  # Проверяем на ошибки
        data = response.json()  # Преобразуем в JSON

        # Извлекаем мем месяца
        best_meme = data.get("id", "")

        if best_meme:
            image = requests.get(f'{BACKEND_BASE_URL}/mems/get/image/{best_meme}').content

            # Формируем сообщение с мемом месяца
            send_image(chat_id, image, f"[Посмотреть больше мемов ➡️]({FRONTEND_BASE_URL}/account?navItem=mems)")
        else:
            send_message(chat_id, "❌ Не удалось получить информацию о меме месяца.")
        show_keyboard(chat_id)
    except requests.RequestException as e:
        # Логируем ошибку при запросе
        logging.error(f"Ошибка при запросе к бэкенду: {e}")
        send_message(chat_id, "❌ Ошибка при получении данных с бэкенда.")