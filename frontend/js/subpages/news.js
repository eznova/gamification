const backendUrl = localStorage.getItem('backendUrl');

import { reloadMenu } from '../navbar.js';

export async function loadNewsContent(userId, backendUrl, signal) {
    const content = document.getElementById('content');
    const response = await fetch('subpages/news.html', { signal });
    if (!response.ok) throw new Error('Ошибка загрузки шаблона');
    const template = await response.text();
    content.innerHTML = template;

    // Создаем контейнер для новостей и кнопки
    const newsContainer = document.createElement('div');
    newsContainer.classList.add('news-container');

    // Создаем блок для кнопки добавления новости
    const addNewsDiv = document.createElement('div');
    addNewsDiv.classList.add('mb-3', 'row');
    const col1 = document.createElement('div');
    col1.classList.add('col-8');
    const col2 = document.createElement('div');
    col2.classList.add('col-4');

    const addNewsButton = document.createElement('button');
    addNewsButton.id = 'add-news';
    addNewsButton.type = 'button';
    addNewsButton.classList.add('btn', 'btn-primary');
    addNewsButton.setAttribute('data-bs-toggle', 'modal');
    addNewsButton.setAttribute('data-bs-target', '#newsModal');
    addNewsButton.style.width = '100%';
    addNewsButton.textContent = 'Добавить новость';

    col2.appendChild(addNewsButton);
    addNewsDiv.appendChild(col1);
    addNewsDiv.appendChild(col2);

    // Вставляем кнопку в начало новостного контейнера
    newsContainer.appendChild(addNewsDiv);

    // Создаем контейнер для списка новостей
    const newsList = document.createElement('div');
    newsList.id = 'news-list';
    // newsList.style.maxHeight = '400px';   // Устанавливаем ограничение по высоте для прокрутки
    // newsList.style.overflowY = 'auto';    // Вертикальная прокрутка
    newsContainer.appendChild(newsList);

    content.innerHTML = '';  // Очищаем текущий контент
    content.appendChild(newsContainer); // Вставляем новый контейнер с новостями и кнопкой

    // Обработчик кнопки "Добавить новость"
    addNewsButton.addEventListener('click', () => {
        newsList.innerHTML = '';  // Очищаем текущий список новостей

        const newsDiv = document.createElement('div');
        newsDiv.classList.add('mb-3');
        
        const authNotice = document.createElement('div');
        authNotice.classList.add('card', 'auth-notice');
        authNotice.textContent = 'Обратите внимание, что авторство новостей подписывается! Вы всегда можете попросить опубликовать новость HR';
        newsDiv.appendChild(authNotice);
        
        const newsForm = document.createElement('form');
        newsForm.style.paddingTop = '1em';
        newsForm.id = 'news-form';

        // Название новости
        const titleLabel = document.createElement('label');
        titleLabel.setAttribute('for', 'title');
        titleLabel.textContent = 'Название новости:';
        titleLabel.style.paddingBottom = '1em';
        titleLabel.classList.add('card-title');
        newsForm.appendChild(titleLabel);

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'title';
        titleInput.name = 'title';
        titleInput.classList.add('form-control', 'mb-3');
        titleInput.required = true;
        newsForm.appendChild(titleInput);

        // Содержание новости
        const contentLabel = document.createElement('label');
        contentLabel.style.paddingTop = '1em';
        contentLabel.setAttribute('for', 'news-content');
        contentLabel.textContent = 'Содержание новости:';
        contentLabel.style.paddingBottom = '1em';
        contentLabel.classList.add('card-title');
        newsForm.appendChild(contentLabel);

        const contentTextarea = document.createElement('textarea');
        contentTextarea.id = 'news-content';
        contentTextarea.name = 'content';
        contentTextarea.classList.add('form-control', 'mb-3');
        contentTextarea.rows = 6;
        contentTextarea.required = true;
        newsForm.appendChild(contentTextarea);

        // Кнопки формы
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('d-flex', 'justify-content-end');

        const cancelButton = document.createElement('div');
        cancelButton.classList.add('col-2');
        cancelButton.type = 'button';
        cancelButton.id = 'cancel-news';
        cancelButton.style.marginRight = '1em';
        cancelButton.textContent = 'ОТМЕНА';
        cancelButton.classList.add('btn', 'btn-gray');
        cancelButton.addEventListener('click', () => {
            loadNewsContent(userId, backendUrl); // Повторная загрузка новостей
        });
        buttonsDiv.appendChild(cancelButton);

        const submitButton = document.createElement('button');
        submitButton.classList.add('col-4');
        submitButton.type = 'submit';
        submitButton.id = 'submit-news';
        submitButton.textContent = 'ОТПРАВИТЬ НОВОСТЬ';
        submitButton.classList.add('btn', 'btn-primary');
        buttonsDiv.appendChild(submitButton);

        newsForm.appendChild(buttonsDiv);
        newsDiv.appendChild(newsForm);

        // Добавляем новость в список
        newsList.appendChild(newsDiv);

        // Обработчик отправки формы
        document.getElementById('news-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const content = document.getElementById('news-content').value;

            fetch(`${backendUrl}/news/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    author_id: userId
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    showResultNewsContent(data);
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке новости');
            });
        });
    });

    // Запрос на получение новостей
    try {
        const likes_result = await fetch(`${backendUrl}/news/liked_by_user/${userId}`, { signal });
        const likedData = await likes_result.json();

        const likedNewsIds = new Set(likedData.news_ids);

        const news_result = await fetch(`${backendUrl}/news/get`, { signal });
        const news = await news_result.json();

        news.forEach(newsItem => {
            createNewsRow(newsItem, likedNewsIds); // Передаем likedNewsIds
        });
    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        content.innerHTML = '<p>Произошла ошибка при загрузке данных.</p>';
    }

}


// Функция создания новости
async function createNewsRow(newsItem, likedNewsIds, signal) {
    // console.log("ID новости:", newsItem.id);
    const newsDiv = document.createElement('div');
    newsDiv.classList.add('card', 'mb-3');
    newsDiv.style.padding = '1em';

    const createDiv = document.createElement('div');
    createDiv.textContent = `${newsItem.created_at}`;
    createDiv.classList.add('card-text-secondary');
    createDiv.style.textAlign = 'left';
    createDiv.style.fontSize = '0.8em';
    newsDiv.appendChild(createDiv);

    const h1 = document.createElement('p');
    h1.classList.add('card-inner-title');
    h1.textContent = newsItem.title;
    newsDiv.appendChild(h1);

    const p = document.createElement('p');
    p.classList.add('card-text');
    p.textContent = newsItem.content;
    newsDiv.appendChild(p);

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('row');

    const col1 = document.createElement('div');
    col1.classList.add('col-6', 'card-text-secondary');
    col1.textContent = `${newsItem.author.name} ${newsItem.author.surname}`;

    const col2 = document.createElement('div');
    col2.classList.add('col-6', 'card-text-secondary');
    col2.style.textAlign = 'right';

    // Контейнер для лайков
    const likesContainer = document.createElement('div');
    likesContainer.style.display = 'flex';
    likesContainer.style.alignItems = 'center';
    likesContainer.style.justifyContent = 'end';

    // Иконка лайка
    const heartIcon = document.createElement('img');
    heartIcon.id = 'heart-icon';
    heartIcon.style.width = '16px';
    heartIcon.style.height = '16px';
    heartIcon.style.marginRight = '5px';

    // Проверяем, лайкнул ли пользователь эту новость
    if (likedNewsIds.has(newsItem.id)) {
        console.log("Лайкнутая новость:", newsItem.id);
        heartIcon.src = 'imgs/icons/v/heart.svg';
    } else {
        heartIcon.src = 'imgs/icons/w/heart.svg';
    }
    heartIcon.addEventListener('mouseover', function() {
        this.style.cursor = 'pointer'; // меняем курсор на ладошку
    });
    likesContainer.appendChild(heartIcon);

    // Количество лайков
    const likesCount = document.createElement('span');
    likesCount.textContent = newsItem.likes_count;
    likesCount.id = 'likes-count';
    likesCount.style.fontSize = '1em';

    // Если новость лайкнута, меняем цвет
    if (likedNewsIds.has(newsItem.id)) {
        likesCount.style.color = '#5367DF';
    }

    // Добавляем обработчик клика на иконку сердечка
    heartIcon.addEventListener('click', () => {
        const isLiked = likedNewsIds.has(newsItem.id);
    
        // Если новость лайкнута, снимаем лайк
        if (isLiked) {
            fetch(`${backendUrl}/news/unlike/${newsItem.id}/${userId}`, {
                method: 'POST'
            })
            .then(res => res.json())
            .then(data => {
                // Обновляем состояние лайка
                likedNewsIds.delete(newsItem.id);
                heartIcon.src = 'imgs/icons/w/heart.svg';
                likesCount.style.color = ''; // Очищаем цвет
    
                // Обновляем количество лайков
                likesCount.textContent = data.likes_count;
            })
            .catch(error => {
                console.error('Ошибка при отмене лайка:', error);
            });
        } else {
            // Если новость не лайкнута, лайкаем
            fetch(`${backendUrl}/news/like/${newsItem.id}/${userId}`, {
                method: 'POST'
            })
            .then(res => res.json())
            .then(data => {
                // Обновляем состояние лайка
                likedNewsIds.add(newsItem.id);
                heartIcon.src = 'imgs/icons/v/heart.svg';
                likesCount.style.color = '#5367DF'; // Устанавливаем цвет для лайкнутой новости
    
                // Обновляем количество лайков
                likesCount.textContent = data.likes_count;
            })
            .catch(error => {
                console.error('Ошибка при лайке:', error);
            });
        }
    });

    // Добавляем элементы в контейнер
    likesContainer.appendChild(heartIcon);
    likesContainer.appendChild(likesCount);

    // Вставляем контейнер в col2
    col2.appendChild(likesContainer);

    infoDiv.appendChild(col1);
    infoDiv.appendChild(col2);
    newsDiv.appendChild(infoDiv);

    document.getElementById('news-list').appendChild(newsDiv);
}

export function showResultNewsContent(result) {
    const resultContainer = document.getElementById('content');
    resultContainer.innerHTML = ''; // Очищаем содержимое формы

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('row');

    // Вывести в строку три сердечка imgs/big_heart.svg
    const hearts = document.createElement('div');
    hearts.classList.add('col-12', 'd-flex', 'justify-content-center', 'align-items-center');
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('img');
        heart.src = 'imgs/big_heart.svg';
        heart.alt = 'Сердечко';
        heart.classList.add('heart');
        heart.style.width = '70px'; // Задаем размер сердечек
        heart.style.margin = '0 5px';
        hearts.appendChild(heart);
    }
    resultDiv.appendChild(hearts);

    const resultText = document.createElement('div');
    resultText.classList.add('col-12', 'text-center', 'mt-3');
    resultText.textContent = 'Ваша новость отправлена в ленту!';

    resultDiv.appendChild(resultText);

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
    anotherButton.textContent = 'ЛЕНТА НОВОСТЕЙ';
    anotherButton.classList.add('btn', 'btn-gray', 'mx-2');
    anotherButton.addEventListener('click', () => {
        reloadMenu('news');
    });
    buttonsDiv.appendChild(anotherButton);

    resultContainer.appendChild(buttonsDiv);
}
