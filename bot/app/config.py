import os
import logging
from dotenv import load_dotenv

# Настройка логирования
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("bot.log"),  # Запись в файл
        logging.StreamHandler()  # Вывод в консоль
    ]
)

# Загружаем переменные окружения
load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
BACKEND_BASE_URL = os.getenv("BACKEND_URL")  # URL твоего бэкенда
FRONTEND_BASE_URL = os.getenv("FRONTEND_URL")  # URL твоего бэкенда
URL = f"https://api.telegram.org/bot{TOKEN}/"

# Inline клавиатура с кнопками
INLINE_KEYBOARD = {
    "inline_keyboard": [
        [{"text": "Сказать «Спасибо!» коллеге", "callback_data": "mm_thank_colleague"}],
        [{"text": "Посмотреть кошелек", "callback_data": "mm_check_wallet"}],
        [{"text": "Посмотреть свои баллы", "callback_data": "mm_check_points"}],
        [{"text": "Кто в топе?", "callback_data": "mm_top_users"}],
        [{"text": "Мем дня", "callback_data": "mm_meme_of_month"}],
        [{"text": "Последние новости", "callback_data": "mm_latest_news"}]
    ]
}