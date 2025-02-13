
const backendUrl = localStorage.getItem('backendUrl');

import { showResultMemsContent } from "./subpages/mems.js";

export function initMyPageEventHandlers() {
    const photoUploadInput = document.getElementById('photo-upload');
    const user_id = localStorage.getItem('user_id');
    const currentUserId = localStorage.getItem('current_user_id');
    if (user_id != currentUserId) {
        photoUploadInput.disabled = true;
        photoUploadInput.style.display = 'none';
    }
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', function(event) {
            if (user_id !== currentUserId) {
                alert('You can only upload your own photo');
                return;
            }
            const file = event.target.files[0];
            if (file) {
                compressAndUploadPhoto(file);
            } else {
                console.error('No file selected');
            }
        });
    }
}

function initMemsEventHandlers() {
    const photoUploadInput = document.getElementById('upload-mem-button');
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                compressAndUploadPhoto(file);
            } else {
                console.error('No file selected');
            }
        });
    }
}

export function compressAndUploadMem(file) {
    const MAX_SIZE = 70 * 1024; // 50 KB
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    let result;
    
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Устанавливаем размер холста равным размеру изображения
            canvas.width = img.width;
            canvas.height = img.height;

            // Рисуем изображение на холсте
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Попытка сжать изображение до нужного размера
            let quality = 0.9; // Начальное качество
            let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

            while (compressedBase64.length > MAX_SIZE && quality > 0.1) {
                quality -= 0.1;
                compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                console.log(`Quality: ${quality}, Size: ${compressedBase64.length}`);
            }

            if (compressedBase64.length > MAX_SIZE) {
                alert(`Unable to compress image to ${MAX_SIZE} B`);
                return;
            }

            // Убираем префикс 'data:image/jpeg;base64,' перед отправкой
            const base64Image = compressedBase64.split(',')[1];
            result = uploadMemToServer(base64Image, file.name);
            console.log(result);
            return  result;
        };
        
        console.log('compressAndUploadMem');
        img.src = event.target.result; // Загружаем изображение в элемент img
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        return {
            success: false,
            message: 'Error reading file'
        };
    };

    reader.readAsDataURL(file); // Читаем файл как Data URL
}

function createThumbnailAndUpload(file) {
    const MAX_WIDTH = 150; // Ширина thumbnail
    const MAX_HEIGHT = 150; // Высота thumbnail
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Вычисляем новый размер с сохранением пропорций
            let width = img.width;
            let height = img.height;
            if (width > height) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            } else {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }

            // Устанавливаем размер холста под thumbnail
            canvas.width = width;
            canvas.height = height;

            // Рисуем уменьшенное изображение
            ctx.drawImage(img, 0, 0, width, height);

            // Конвертируем в Blob для отправки
            canvas.toBlob((blob) => {
                if (blob.size > 10 * 1024) {
                    console.warn("Thumbnail больше 10KB, но будет загружен.");
                }
                uploadPhotoToServer(blob);
            }, 'image/jpeg', 0.7); // 70% качество
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}


function compressAndUploadPhoto(file) {
    const MAX_SIZE = 10 * 1024; // 10 KB
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Устанавливаем размер холста равным размеру изображения
            canvas.width = img.width;
            canvas.height = img.height;

            // Рисуем изображение на холсте
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Попытка сжать изображение до нужного размера
            let quality = 0.9; // Начальное качество
            let compressedBase64 = canvas.toDataURL('image/jpeg', quality);

            while (compressedBase64.length > MAX_SIZE && quality > 0.1) {
                quality -= 0.1;
                compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                console.log(`Quality: ${quality}, Size: ${compressedBase64.length}`);
            }

            if (compressedBase64.length > MAX_SIZE) {
                alert(`Unable to compress image to ${MAX_SIZE} B`);
                return;
            }

            // Убираем префикс 'data:image/jpeg;base64,' перед отправкой
            const base64Image = compressedBase64.split(',')[1];
            uploadPhotoToServer(base64Image);
        };

        img.src = event.target.result; // Загружаем изображение в элемент img
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file); // Читаем файл как Data URL
}

function uploadPhotoToServer(base64Image) {
    const userId = localStorage.getItem('user_id');
    fetch(`${backendUrl}/users/upload/${userId}/photo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            photo: base64Image
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);

        // Очистка кеша перед перезагрузкой страницы
        clearCache();

        // Перезагружаем страницу
        location.reload();
    })
    .catch(error => {
        console.error('Error uploading photo:', error);
    });
}

function uploadMemToServer(base64Image, fileName) {
    console.log('uploadMemToServer');
    const userId = localStorage.getItem('user_id');
    let data = {
        'author_id': userId,
        'name': fileName,
        'image': base64Image
    }
    console.log(data);
    fetch(`${backendUrl}/mems/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        showResultMemsContent(data);

        // Перезагружаем страницу
    })
    .catch(error => {
        console.error('Error uploading photo:', error);
        return error;
    });
}

// Очистка кеша
function clearCache() {
    // Пример очистки кеша в localStorage
    localStorage.removeItem('userPhotoCache'); // Если вы кешируете изображение в localStorage, можно удалить

    // Пример очистки кеша в sessionStorage (если используется)
    sessionStorage.removeItem('userPhotoCache'); // Если кеш хранится в sessionStorage

    // Очистка всех кешированных ресурсов (например, если используется Cache API в браузере)
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName); // Очистка всех кешей
            });
        });
    }
}

