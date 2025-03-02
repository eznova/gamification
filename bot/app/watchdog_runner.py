import os
import sys
import time
import subprocess
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

BOT_FILE = "bot.py"  # Укажи имя файла с кодом бота

class RestartBotHandler(FileSystemEventHandler):
    """Следит за изменениями и перезапускает бота"""
    def on_modified(self, event):
        if event.src_path.endswith(BOT_FILE):
            print("\n⚡ Файл изменен! Перезапускаем бота...\n")
            restart_bot()

def restart_bot():
    """Перезапуск бота"""
    global bot_process
    if bot_process:
        bot_process.terminate()
        bot_process.wait()
    bot_process = subprocess.Popen([sys.executable, BOT_FILE])

if __name__ == "__main__":
    print("👀 Запущен мониторинг изменений в коде...")
    event_handler = RestartBotHandler()
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=False)
    observer.start()

    bot_process = subprocess.Popen([sys.executable, BOT_FILE])  # Запускаем бота

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Остановка...")
        bot_process.terminate()
        observer.stop()

    observer.join()
