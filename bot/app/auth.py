import logging
import requests
from config import BACKEND_BASE_URL

def send_token_to_backend(token, user_id):
    """Отправка токена на backend"""
    data = {"tg_id": user_id, "token": token}
    try:
        response = requests.post(f'{BACKEND_BASE_URL}/users/tg/set_token', json=data)
        response.raise_for_status()
        logging.info(f"Токен {token} отправлен на backend для user_id {user_id}")
        return response.status_code
    except requests.RequestException as e:
        logging.error(f"Ошибка при отправке токена на backend: {e}")
        return None