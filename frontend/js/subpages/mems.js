const backendUrl = localStorage.getItem('backendUrl');
import { reloadMenu } from '../navbar.js';
import { compressAndUploadMem } from '../upload.js';

export async function getmems(userId, backendUrl) {
    try {
        const response = await fetch(`${backendUrl}/mems/get/${userId}`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки мемов');
        }
        const mems = await response.json();
        return mems;
    } catch (error) {
        console.error('Error getting mems:', error);
        return [];
    }
}

export function createMemContainer() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.width = '100%';
    container.style.marginTop = '20px';

    return container;
}

export function createMemBox() {
    // Прямоугольник для мема
    const memBox = document.createElement('div');
    memBox.style.width = '700px';
    memBox.style.height = '400px';
    memBox.style.backgroundColor = '#d3d3d3'; // Серый фон
    memBox.style.display = 'flex';
    memBox.style.alignItems = 'center';
    memBox.style.justifyContent = 'center';
    memBox.style.margin = '20px 0';

    const img = document.createElement('img');
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    img.alt = 'Мем';
    img.src = 'imgs/default_mem.svg';

    memBox.appendChild(img);

    return { memBox, img };
}

export function fillMemBox(img, mode) {
    if (mode === 'best') {
        fetch(`${backendUrl}/mems/get/best`)
            .then(res => {
                if (!res.ok) throw new Error(`Ошибка получения лучшего мема: ${res.status}`);
                return res.json();
            })
            .then(res => {
                const id = res.id;
                return fetch(`${backendUrl}/mems/get/image/${id}`);
            })
            .then(res => {
                if (!res.ok) throw new Error(`Ошибка загрузки мема: ${res.status}`);
                return res.blob();
            })
            .then(photoBlob => {
                const photoUrl = URL.createObjectURL(photoBlob);
                img.src = photoUrl;
            })
            .catch(error => console.error(error));
    } else if (mode === 'rate') {
        console.log('rate');
    }
}

export function createTitle(text) {
        // Заголовок
        const title = document.createElement('h2');
        title.innerText = text;
        title.id = 'mem-title';
        title.style.textAlign = 'center';
        title.style.fontWeight = 'bold';

        return title;
}

export function loadNoMemsScreen() {
    // Если нет доступных мемов, выводим сообщение
    const content = document.getElementById('content');
    const noMemDiv = document.createElement('div');
    noMemDiv.innerText = 'Вы уже оценили все доступные мемы';
    noMemDiv.style.textAlign = 'center';
    noMemDiv.style.fontSize = '20px';
    noMemDiv.style.marginTop = '20px';
    content.innerHTML = ''; // Очищаем контент
    content.appendChild(noMemDiv); // Добавляем сообщение

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.marginTop = '20px';
    content.appendChild(buttonContainer);

    const backButton = document.createElement('button');
    backButton.innerText = 'НАЗАД';
    backButton.classList.add('btn', 'btn-primary');
    backButton.addEventListener('click', () => {
        reloadMenu('mems');
    });
    buttonContainer.appendChild(backButton);
}

export function createMemButtons() {
    let result;
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    // Кнопка "ОЦЕНИТЬ ДРУГИЕ"
    const rateButton = document.createElement('button');
    rateButton.innerText = 'ОЦЕНИТЬ ДРУГИЕ';
    rateButton.classList.add('btn', 'btn-disabled');
    rateButton.addEventListener('click', async () => {
        // Проверяем доступность мемов
        const mems = await getmems(userId, backendUrl);
        if (mems.length === 0) {
            loadNoMemsScreen();
        } else {
            // Если мемы есть, отображаем страницу с оценкой
            renderMemsPage(userId, backendUrl);
        }
    });

    // Кнопка "ЗАГРУЗИТЬ МЕМ"
    const uploadButton = document.createElement('button');
    uploadButton.innerText = 'ЗАГРУЗИТЬ МЕМ';
    uploadButton.id = 'upload-mem-button';
    uploadButton.classList.add('btn', 'btn-primary');
    uploadButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                result = compressAndUploadMem(file);
            }
        });
        fileInput.click();
    });

    return { buttonContainer, rateButton, uploadButton, result };
}


export async function loadMemsContent(userId, backendUrl) {
    const content = document.getElementById('content');
    try {
        const response = await fetch('subpages/mems.html'); // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template; // Вставляем шаблон в DOM

        // Основной контейнер
        const container = createMemContainer();

        // Заголовок
        const title = createTitle('МЕМ ДНЯ')

        const { memBox, img } = createMemBox();

        fillMemBox(img, 'best');

        // Контейнер кнопок
        const { buttonContainer, rateButton, uploadButton, addMemResult } = createMemButtons();

        console.log(addMemResult);

        // Добавляем кнопки в контейнер
        buttonContainer.appendChild(rateButton);
        buttonContainer.appendChild(uploadButton);

        // Добавляем элементы в контейнер
        container.appendChild(title);
        container.appendChild(memBox);
        container.appendChild(buttonContainer);

        // Вставляем контейнер в content
        content.appendChild(container);

        // Загружаем мемы
        const mems = await getmems(userId, backendUrl);
        for (const mem of mems) {
            console.log(mem);
        }

    } catch (error) {
        console.error('Error loading mems:', error);
    }
}


async function renderMemsPage(userId, backendUrl) {
    const content = document.getElementById('content');
    try {
        const response = await fetch('subpages/mems.html'); // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template; // Вставляем шаблон в DOM

        // Основной контейнер
        const container = createMemContainer();

        // Заголовок
        const title = createTitle('ОЦЕНКА МЕМОВ');

        // Контейнер для мема и стрелок
        const memContainer = document.createElement('div');
        memContainer.style.display = 'flex';
        memContainer.style.alignItems = 'center';
        memContainer.style.justifyContent = 'center';
        memContainer.style.width = '80%';
        memContainer.style.gap = '20px';

        // Стрелки
        const leftArrow = document.createElement('img');
        leftArrow.src = 'imgs/arrow_left.svg';
        leftArrow.style.border = 'none';
        leftArrow.style.background = 'none';
        leftArrow.style.fontSize = '32px';
        leftArrow.style.cursor = 'pointer';

        const rightArrow = document.createElement('img');
        rightArrow.src = 'imgs/arrow_right.svg';
        rightArrow.style.border = 'none';
        rightArrow.style.background = 'none';
        rightArrow.style.fontSize = '32px';
        rightArrow.style.cursor = 'pointer';

        // Мем-контейнер
        const { memBox, img } = createMemBox();

        // Контейнер для рейтинга
        const ratingContainer = document.createElement('div');
        ratingContainer.style.display = 'flex';
        ratingContainer.style.alignItems = 'center';
        ratingContainer.style.marginTop = '10px';

        // Этикетка для рейтинга
        const ratingLabel = document.createElement('span');
        ratingLabel.innerText = 'Оценка';
        ratingLabel.style.marginRight = '10px';
        ratingLabel.style.color = '#aaa';
        ratingLabel.style.fontWeight = 'bold';

        // Контейнер для звезд
        const starsContainer = document.createElement('div');
        starsContainer.style.display = 'flex';
        let currentMemIndex = 0; // Индекс для мемов
        let readyToRateMemId = 0
        let memsIds = [];

        function renderMem(index) {
            if (memsIds.length === 0) return;
            const memId = memsIds[index];
            // const mem = mems.find(m => m.id === memId);
            console.log(`Отрисовка мема ${memId}`);
            readyToRateMemId = memId;
            img.src = `${backendUrl}/mems/get/image/${memId}`;
        }

        // Функция отправки рейтинга на сервер
        async function rateMem(memId, rating) {
            console.log(`Отправляем рейтинг ${rating} для мема ${memId}`);
            try {
                // Отправляем рейтинг на сервер
                const response = await fetch(`${backendUrl}/mems/rate`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        'user_id': userId,
                        'mem_id': memId,
                        'rating': rating
                    })
                });
        
                if (!response.ok) {
                    throw new Error('Ошибка при отправке рейтинга');
                }
        
                console.log(`Рейтинг ${rating} отправлен для мема ${memId}`);
        
                // Получаем обновленный список мемов после отправки рейтинга
                const mems = await getmems(userId, backendUrl);
                memsIds = mems.map(mem => mem.id); // Обновляем массив ID мемов

                if (memsIds.length === 0) {
                    console.log('Нет мемов для отображения');
                    loadNoMemsScreen();
                }
        
                // Если есть следующие мемы, обновляем текущий индекс
                if (currentMemIndex < memsIds.length - 1) {
                    currentMemIndex++;
                } else {
                    currentMemIndex = 0; // Если это был последний мем, начинаем с первого
                }
        
                // Отрисовываем новый мем
                renderMem(currentMemIndex);
        
                // Обновляем отображение звезд
                updateStars(0);
        
            } catch (error) {
                console.error('Ошибка отправки рейтинга:', error);
            }
        }

        // Функция обновления звезд и отправки рейтинга
        function updateStars(rating) {
            starsContainer.innerHTML = ''; // Очищаем звезды
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('button');
                star.innerText = i <= rating ? '★' : '☆';
                star.style.color = i <= rating ? 'gold' : '#ccc';
                star.style.fontSize = '40px';
                star.style.background = 'transparent';
                star.style.border = 'none';
                star.style.cursor = 'pointer';
                star.id = i; // Присваиваем id звезды
                star.onclick = () => {
                    updateStars(i); // Обновляем визуальное отображение рейтинга
                    rateMem(readyToRateMemId, i); // Отправляем рейтинг на сервер
                };
                starsContainer.appendChild(star);
            }
        }
        

        // Добавляем элементы на страницу
        ratingContainer.appendChild(ratingLabel);
        ratingContainer.appendChild(starsContainer);
        document.body.appendChild(ratingContainer);

        // Инициализируем рейтинг
        updateStars(0);

        // Добавляем стрелки и мем в общий контейнер
        memContainer.appendChild(leftArrow);
        memContainer.appendChild(memBox);
        memContainer.appendChild(rightArrow);

        // Добавляем элементы в основную страницу
        container.appendChild(title);
        container.appendChild(memContainer);
        container.appendChild(ratingContainer);
        content.appendChild(container);

        try {
            // Загружаем мемы
            const mems = await getmems(userId, backendUrl);
            memsIds = mems.map(mem => mem.id); // Массив с id мемов

            if (memsIds.length === 0) {
                loadNoMemsScreen(); // Если мемов нет, показываем экран с сообщением
                return; // Прекращаем выполнение функции
            }

            console.log(memsIds);

            // Обработчики стрелок
            leftArrow.addEventListener('click', () => {
                if (currentMemIndex > 0) {
                    currentMemIndex--;
                    renderMem(currentMemIndex);
                }
            });

            rightArrow.addEventListener('click', () => {
                if (currentMemIndex < memsIds.length - 1) {
                    currentMemIndex++;
                    renderMem(currentMemIndex);
                }
            });

            // Отрисовка первого мема
            if (memsIds.length > 0) {
                renderMem(currentMemIndex);
            }
        } catch (error) {
            console.error('Ошибка загрузки мемов:', error);
        }
    } catch (error) {
        console.error('Error loading mems:', error);
    }
}


export function showResultMemsContent(result) {
    const resultContainer = document.getElementById('content');
    resultContainer.innerHTML = ''; // Очищаем содержимое формы

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('row');

    // Вывести в строку три сердечка imgs/big_heart.svg
    const hearts = document.createElement('div');
    hearts.classList.add('col-12', 'd-flex', 'justify-content-center', 'align-items-center');
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('img');
        heart.src = 'imgs/big_green_heart.svg';
        heart.alt = 'Сердечко';
        heart.classList.add('heart');
        heart.style.width = '70px'; // Задаем размер сердечек
        heart.style.margin = '0 5px';
        hearts.appendChild(heart);
    }
    resultDiv.appendChild(hearts);

    const resultText = document.createElement('div');
    resultText.classList.add('col-12', 'text-center', 'mt-3');
    resultText.textContent = 'Мем отправлен на модерацию!';

    const resultText2 = document.createElement('div');
    resultText2.classList.add('col-12', 'text-center', 'mt-3');
    resultText2.textContent = 'Мы свяжемся, если понадобится дополнительная информация';

    resultDiv.appendChild(resultText);
    resultDiv.appendChild(resultText2);

    resultContainer.appendChild(resultDiv);

    // Добавляем две кнопки посередине страницы
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-4');

    const myPageButton = document.createElement('button');
    myPageButton.textContent = 'К МОЕЙ СТРАНИЦЕ';
    myPageButton.classList.add('btn', 'btn-gray', 'mx-2');
    myPageButton.addEventListener('click', () => {
        // Переходим на страницу "Моя страница"
        reloadMenu('my-page');
    });
    buttonsDiv.appendChild(myPageButton);

    const anotherButton = document.createElement('button');
    anotherButton.textContent = 'ЕЩЕ МЕМЫ';
    anotherButton.classList.add('btn', 'btn-gray', 'mx-2');
    anotherButton.addEventListener('click', () => {
        reloadMenu('mems');
    });
    buttonsDiv.appendChild(anotherButton);

    resultContainer.appendChild(buttonsDiv);
}

export async function getUnmodMems(userId, backendUrl) {
    try {
        const response = await fetch(`${backendUrl}/mems/moderate`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки мемов');
        }
        const mems = await response.json();
        return mems;
    } catch (error) {
        console.error('Error getting mems:', error);
        return [];
    }
}

import { checkAdmin } from '../rolesController.js';

export async function renderModerationMemsPage(userId, backendUrl) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    try {
            const check_res = await checkAdmin(); // Дожидаемся результата
    
            console.log(`check_res: ${check_res}`);
    
            if (!check_res) {
                const message = document.createElement('div');
                message.classList.add('row', 'd-flex', 'p-2', 'rounded-3', 'error-message');
                message.style.overflow = 'hidden';
                message.style.boxSizing = 'border-box';
    
                const col1 = document.createElement('div');
                col1.classList.add('col-2');
                col1.style.textAlign = 'center';
    
                const img = document.createElement('img');
                img.setAttribute('width', '30em');
                img.setAttribute('height', '30em');
                img.classList.add('rounded-circle');
                img.setAttribute('src', `imgs/icons/w/cross.svg`);
                col1.appendChild(img);
    
                message.appendChild(col1);
    
                const col2 = document.createElement('div');
                col2.classList.add('col-10');
                col2.textContent = 'У вас нет прав для просмотра этой страницы';
                message.appendChild(col2);
    
                content.appendChild(message);
                return;
            }
    
            // Если пользователь админ, загружаем контент страницы
            content.innerHTML = '';
        } catch (error) {
            console.error('Ошибка загрузки ролей:', error);
            content.innerHTML = '<p>Произошла ошибка при проверке доступа</p>';
        }

    try {
        const response = await fetch('subpages/mems.html'); // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template; // Вставляем шаблон в DOM

        // Основной контейнер
        const container = createMemContainer();

        // Заголовок
        const title = createTitle('МОДЕРАЦИЯ МЕМОВ');

        // Контейнер для мема и стрелок
        const memContainer = document.createElement('div');
        memContainer.style.display = 'flex';
        memContainer.style.alignItems = 'center';
        memContainer.style.justifyContent = 'center';
        memContainer.style.width = '80%';
        memContainer.style.gap = '20px';

        // Стрелки
        const leftArrow = document.createElement('img');
        leftArrow.src = 'imgs/arrow_left.svg';
        leftArrow.style.border = 'none';
        leftArrow.style.background = 'none';
        leftArrow.style.fontSize = '32px';
        leftArrow.style.cursor = 'pointer';

        const rightArrow = document.createElement('img');
        rightArrow.src = 'imgs/arrow_right.svg';
        rightArrow.style.border = 'none';
        rightArrow.style.background = 'none';
        rightArrow.style.fontSize = '32px';
        rightArrow.style.cursor = 'pointer';

        // Мем-контейнер
        const { memBox, img } = createMemBox();
        let currentMemIndex = 0; // Индекс для мемов
        let readyToRateMemId = 0
        let memsIds = [];

        // Контейнер для резолюции
        const moderContainer = document.createElement('div');
        moderContainer.style.display = 'flex';
        moderContainer.style.alignItems = 'center';
        moderContainer.style.marginTop = '10px';

        // Кнопка отказать
        const rejectBtn = document.createElement('div');
        rejectBtn.classList.add('btn', 'btn-gray')
        rejectBtn.innerText = 'ОТКАЗАТЬ';
        rejectBtn.style.marginRight = '10px';
        rejectBtn.style.fontWeight = 'bold';
        rejectBtn.addEventListener('click', () => {
                moderateMem('false');
            });

        // Кнопка согласовать
        const acceptBtn = document.createElement('div');
        acceptBtn.classList.add('btn', 'btn-primary')
        acceptBtn.innerText = 'СОГЛАСОВАТЬ';
        acceptBtn.style.marginRight = '10px';
        acceptBtn.style.fontWeight = 'bold';
        acceptBtn.addEventListener('click', () => {
                moderateMem('true');
            });

        function renderMem(index) {
            if (memsIds.length === 0) return;
            const memId = memsIds[index];
            // const mem = mems.find(m => m.id === memId);
            console.log(`Отрисовка мема ${memId}`);
            readyToRateMemId = memId;
            img.src = `${backendUrl}/mems/get/image/${memId}`;
        }

        // Функция отправки резолюции на сервер
        async function moderateMem(resolution) {
            let memId = readyToRateMemId;
            console.log(`Отправляем резолюцию ${resolution} для мема ${memId}`);
            try {
                let resolutionBody = {
                    'mem_id': memId,
                    'result': resolution
                };
                console.log(resolutionBody);
                // Отправляем рейтинг на сервер
                const response = await fetch(`${backendUrl}/mems/moderate`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(resolutionBody)
                });

                console.log(response);
        
                if (!response.ok) {
                    throw new Error('Ошибка при отправке резолюции');
                }
        
                console.log(`Резолюция ${resolution} отправлена для мема ${memId}`);
        
                // Получаем обновленный список мемов после отправки резолюции
                const mems = await getUnmodMems(userId, backendUrl);
                memsIds = mems.map(mem => mem.id); // Обновляем массив ID мемов

                if (memsIds.length === 0) {
                    console.log('Нет мемов для отображения');
                    loadNoMemsScreen();
                }
        
                // Если есть следующие мемы, обновляем текущий индекс
                if (currentMemIndex < memsIds.length - 1) {
                    currentMemIndex++;
                } else {
                    currentMemIndex = 0; // Если это был последний мем, начинаем с первого
                }
        
                // Отрисовываем новый мем
                renderMem(currentMemIndex);
                // renderModerationMemsPage(userId, backendUrl);
        
                // Обновляем отображение звезд
        
            } catch (error) {
                console.error('Ошибка отправки резолюции:', error);
            }
        }

        

        // Добавляем элементы на страницу
        moderContainer.appendChild(rejectBtn);
        moderContainer.appendChild(acceptBtn);
        document.body.appendChild(moderContainer);

        // Инициализируем рейтинг

        // Добавляем стрелки и мем в общий контейнер
        memContainer.appendChild(leftArrow);
        memContainer.appendChild(memBox);
        memContainer.appendChild(rightArrow);

        // Добавляем элементы в основную страницу
        container.appendChild(title);
        container.appendChild(memContainer);
        container.appendChild(moderContainer);
        content.appendChild(container);

        try {
            // Загружаем мемы
            const mems = await getUnmodMems(userId, backendUrl);
            memsIds = mems.map(mem => mem.id); // Массив с id мемов

            if (memsIds.length === 0) {
                loadNoMemsScreen(); // Если мемов нет, показываем экран с сообщением
                return; // Прекращаем выполнение функции
            }

            console.log(memsIds);

            // Обработчики стрелок
            leftArrow.addEventListener('click', () => {
                if (currentMemIndex > 0) {
                    currentMemIndex--;
                    renderMem(currentMemIndex);
                }
            });

            rightArrow.addEventListener('click', () => {
                if (currentMemIndex < memsIds.length - 1) {
                    currentMemIndex++;
                    renderMem(currentMemIndex);
                }
            });

            // Отрисовка первого мема
            if (memsIds.length > 0) {
                renderMem(currentMemIndex);
            }
        } catch (error) {
            console.error('Ошибка загрузки мемов:', error);
        }
    } catch (error) {
        console.error('Error loading mems:', error);
    }
}