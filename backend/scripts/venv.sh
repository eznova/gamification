# Создаем виртуальное окружение в текущей директории
python3 -m venv venv

if [ $? -ne 0 ]; then
    echo "Не удалось создать виртуальное окружение!"
    sudo apt install python3.10-venv
    python3 -m venv venv
fi

# Активируем виртуальное окружение
source venv/bin/activate

# Меняем PS1 на user@hostname:$(pwd)-venv
# export PS1="[\u@\h:\w (venv)]$ "

# Устанавливаем зависимости из requirements.txt
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "Файл requirements.txt не найден!"
fi
