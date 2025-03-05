import os
import sys
import subprocess

def convert_svg_to_png(input_dir, output_dir, size=(500, 500), dpi=1000):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".svg"):
            svg_path = os.path.join(input_dir, filename)
            png_path = os.path.join(output_dir, os.path.splitext(filename)[0] + ".png")

            try:
                # Используем Inkscape для конвертации с DPI и размером
                subprocess.run([
                    "inkscape",
                    "--actions='select-all;Object-to-Path;export-png'",
                    svg_path,
                    "--export-filename=" + png_path,
                    "--export-width=" + str(size[0]),
                    "--export-height=" + str(size[1]),
                    "--export-dpi=" + str(dpi)
                ], check=True)

                print(f"Конвертировано: {filename} -> {png_path} (размер: {size[0]}x{size[1]}) с DPI: {dpi}")
            except Exception as e:
                print(f"Ошибка при обработке {filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Использование: python convert.py <input_dir> <output_dir>")
        sys.exit(1)

    input_directory = sys.argv[1]
    output_directory = sys.argv[2]

    convert_svg_to_png(input_directory, output_directory, dpi=1000)
