import logging
import requests
import sys
sys.path.append('../')
from tg import send_message, show_keyboard
from config import BACKEND_BASE_URL, FRONTEND_BASE_URL

def handle_latest_news(chat_id):
    """Получение новостей с бэкенда и вывод последних 3"""
    try:
        # Выполняем запрос к backend для получения новостей
        response = requests.get(f'{BACKEND_BASE_URL}/news/get')
        response.raise_for_status()  # Проверяем на ошибки
        data = response.json()  # Преобразуем в JSON

        # Извлекаем последние 3 новости
        last_3_news = data[:3]

        if last_3_news:
            # Формируем сообщение с последними новостями
            last_3_news_message = "📰 Последние новости\n\n"
            for article in last_3_news:
                id = article.get("id", "")
                title = article.get("title", "")
                created_at = article.get("created_at", "")
                content = article.get("content", "")

                # Формируем строку с отформатированным контентом
                last_3_news_message += f"{id}. "  # ID новости (можно удалить, если не нужно)
                last_3_news_message += f"*{title}* "  # Жирный заголовок
                last_3_news_message += f"({created_at})\n"
                last_3_news_message += f"_{content}_\n\n"  # Курсивное содержание

            # Добавляем кнопку "Подробнее"
            last_3_news_message += f"[Посмотреть ленту новостей ➡️ ]({FRONTEND_BASE_URL}/account?navItem=news)"

            send_message(chat_id, last_3_news_message, reply_markup=None)
        else:
            send_message(chat_id, "❌ Не удалось получить информацию о новостях.")
        show_keyboard(chat_id)
    except requests.RequestException as e:
        # Логируем ошибку при запросе
        logging.error(f"Ошибка при запросе к бэкенду: {e}")
        send_message(chat_id, "❌ Ошибка при получении данных с бэкенда.")