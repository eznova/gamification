import requests
import logging
import sys
sys.path.append('../')
from config import BACKEND_BASE_URL
from tg import send_message, show_keyboard
def handle_top_users(chat_id):
    """Получение топ-10 пользователей с бэкенда и вывод первых 3"""
    try:
        # Выполняем запрос к backend для получения топ-10 пользователей
        response = requests.get(f'{BACKEND_BASE_URL}/users/get/top10')
        response.raise_for_status()  # Проверяем на ошибки
        data = response.json()  # Преобразуем в JSON

        # Извлекаем топ-3 пользователей
        top_users = data.get("top10_users", [])[:3]

        if top_users:
            # Формируем сообщение с топ-3 пользователями
            top_users_message = "⭐️⭐️⭐️ ТОП ЛИДЕРОВ ⭐️⭐️⭐️\n\n"
            for user in top_users:
                rank = user.get("rank", "")
                name = user.get("name", "")
                role = user.get("role", "")
                department = user.get("department", "")
                npoints = user.get("npoints", 0)
                # Добавляем эмодзи в зависимости от ранга
                if rank == 1:
                    rank_emoji = "🥇"
                elif rank == 2:
                    rank_emoji = "🥈"
                elif rank == 3:
                    rank_emoji = "🥉"
                else:
                    rank_emoji = str(rank)  # Если не 1, 2, 3 — показываем просто номер ранга

                # Формируем строку с данными пользователя
                top_users_message += f"{rank_emoji} {name} ({role}, {department}) — {npoints} Npoints\n\n"


            send_message(chat_id, top_users_message)
        else:
            send_message(chat_id, "❌ Не удалось получить информацию о пользователях.")
        show_keyboard(chat_id)
    except requests.RequestException as e:
        # Логируем ошибку при запросе
        logging.error(f"Ошибка при запросе к бэкенду: {e}")
        send_message(chat_id, "❌ Ошибка при получении данных с бэкенда.")