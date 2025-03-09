#!/bin/bash

# Проверяем количество аргументов
if [ "$#" -ne 2 ]; then
    echo "Использование: $0 <директория с svg файлами> <целевая директория>"
    exit 1
fi

# Присваиваем переменные для директорий
src_dir="$1"
dst_dir="$2"

# Проверяем, существует ли исходная директория
if [ ! -d "$src_dir" ]; then
    echo "Ошибка: Исходная директория не существует."
    exit 1
fi

# Проверяем, существует ли целевая директория, если нет - создаем
if [ ! -d "$dst_dir" ]; then
    echo "Целевая директория не существует, создаем..."
    mkdir -p "$dst_dir"
else
    echo "Целевая директория уже существует."
    rm -rf "${dst_dir}"
    mkdir -p "$dst_dir"
fi

# Обрабатываем все svg файлы в исходной директории
for svg_file in "$src_dir"/*.svg; do
    # Проверяем, что это файл, а не директория
    if [ -f "$svg_file" ]; then
        # Получаем имя файла без расширения
        filename=$(basename "$svg_file" .svg)
        
        # Конвертируем SVG в PNG
        cairosvg "$svg_file" -o "$dst_dir/$filename.png" -f png --output-width 500 --output-height 500 -H 500 -W 500 -s 100
        
        # Конвертируем PNG в WebP
        # cwebp "$dst_dir/$filename.png" -o "$dst_dir/$filename.webp"
        
        # Удаляем промежуточный PNG файл
        # rm "$dst_dir/$filename.png"
        
        echo "Конвертирован: $filename.svg -> $filename.webp"
    fi
done

echo "Конвертация завершена!"
