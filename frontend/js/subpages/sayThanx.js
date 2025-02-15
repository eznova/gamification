const backendUrl = localStorage.getItem('backendUrl');

import { reloadMenu } from '../navbar.js';
import { loadUserPageContent } from './userPage.js';

const currentUserId = localStorage.getItem('user_id');

export function loadSayThanxContent(userId, backendUrl) {
    const content = document.getElementById('content');
    fetch('subpages/say-thanx.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки шаблона');
            }
            return response.text();
        })
        .then(template => {
            content.innerHTML = template;
            const searchContainer = document.createElement('div');
            searchContainer.classList.add('row');
            // Добавляем поле для поиска
            const searchInputDiv = document.createElement('div');
            searchInputDiv.classList.add('col-6');
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'user-search';
            searchInput.classList.add('form-control');
            searchInput.placeholder = 'Поиск коллег';
            searchInput.style.marginBottom = '10px';
            searchInputDiv.appendChild(searchInput);
            searchContainer.appendChild(searchInputDiv);

            const thanxLeftDiv = document.createElement('div');
            thanxLeftDiv.classList.add('col-6');
            const thanxLeft = document.createElement('input');
            thanxLeft.type = 'text';
            thanxLeft.readOnly = true;
            thanxLeft.disabled = true;
            thanxLeft.classList.add('form-control', 'user-card-text');
            thanxLeft.style.outline = 'none';
            fetch(`${backendUrl}/thx/get/${currentUserId}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    thanxLeft.placeholder = `Осталось спасибо: ${data.thx_count} / ${data.max_thx}`;
                    thanxLeftDiv.appendChild(thanxLeft);
                })
            searchContainer.appendChild(thanxLeftDiv);
            content.appendChild(searchContainer);

            const searchHr = document.createElement('hr');
            searchHr.style.marginTop = '1em';
            searchHr.style.marginBottom = '1em';
            content.appendChild(searchHr);


            const sayThanxForm = document.getElementById('say-thanx-content');
            
            // Применяем CSS Grid для контейнера с пользователями
            sayThanxForm.style.display = 'grid';
            sayThanxForm.style.gridTemplateColumns = 'repeat(2, 1fr)'; // 2 колонки
            sayThanxForm.style.gridGap = '20px'; // Отступы между элементами




            return Promise.all([ 
                fetch(`${backendUrl}/users/get/all`).then(res => res.json())
            ])
                .then(([allUsers]) => {
                    // Используем данные, возвращаемые API
                    // console.log(allUsers); // Проверяем, что пришло от API

                    const createUserRow = (user) => {
                        if (user.id != currentUserId) {
                        

                            const userDiv = document.createElement('div');
                            userDiv.classList.add('user-row', 'row');
                            // userDiv.style.display = 'flex';
                            userDiv.style.alignItems = 'center';

                            // Первый div для изображения
                            const col1 = document.createElement('div');
                            col1.classList.add('col-1');
                            const img = document.createElement('img');
                            img.setAttribute('width', '30px');
                            img.setAttribute('height', '30px');
                            img.classList.add('rounded-circle');
                            fetch(`${backendUrl}/users/get/${user.id}/photo`)
                                .then(res => res.blob())
                                .then(photoBlob => {
                                    // Создаем URL для изображения
                                    const photoUrl = URL.createObjectURL(photoBlob);
                                    img.setAttribute('src', photoUrl);
                                })
                            col1.appendChild(img);
                            userDiv.appendChild(col1);

                            const col2 = document.createElement('div');
                            col2.classList.add('col-9');
                            // col2.style.flex = '1'; // Даем второй колонке больше пространства

                            // Создаем внутренние элементы для второй колонки
                            const nameDiv = document.createElement('div');
                            nameDiv.classList.add('user-card-text');
                            nameDiv.textContent = `${user.name} ${user.surname}`;

                            const detailsDiv = document.createElement('div');
                            detailsDiv.classList.add('user-card-text-secondary');
                            detailsDiv.textContent = `${user.job_title} | ${user.job_role} | ${user.department_name}`;

                            // Добавляем две строки (имя и должность, роль, департамент) в колонку
                            col2.appendChild(nameDiv);
                            col2.appendChild(detailsDiv);
                            col2.style.cursor = 'hand';
                            col2.addEventListener('mouseover', function() {
                                this.style.cursor = 'pointer'; // меняем курсор на ладошку
                            });
                            col2.addEventListener('click', () => {
                                // alert(`Вы выбрали пользователя с ID: ${user.id}`);
                                loadUserPageContent(user.id, backendUrl);  // Вызов функции с передачей user.id
                            });

                            const col3 = document.createElement('div');
                            col3.classList.add('col-2');
                            col3.style.textAlign = 'right';
                            
                            const thanxImg = document.createElement('img');
                            thanxImg.setAttribute('src', 'imgs/icons/v/hand.svg');
                            thanxImg.setAttribute('width', '30px');
                            thanxImg.setAttribute('height', '30px');
                            thanxImg.classList.add('rounded-circle');
                            thanxImg.addEventListener('mouseover', function() {
                                this.style.cursor = 'pointer';
                            })
                            thanxImg.addEventListener('click', () => {
                                // alert(`Вы выбрали пользователя с ID: ${user.id}`);
                                loadSayThanxForm(user.id, backendUrl);  // Вызов функции с передачей user.id
                            });
                            col3.appendChild(thanxImg);

                            // Добавляем колонки в контейнер пользователя
                            userDiv.appendChild(col1);
                            userDiv.appendChild(col2);
                            userDiv.appendChild(col3);

                            return userDiv;
                        }
                    };

                    // Перебираем всех пользователей и добавляем их в DOM
                    allUsers.forEach(user => {
                        if (user.id != currentUserId) {
                            const userRow = createUserRow(user);
                            sayThanxForm.appendChild(userRow);
                        }
                    });

                    // Фильтрация пользователей при вводе текста
                    searchInput.addEventListener('input', () => {
                        const searchValue = searchInput.value.toLowerCase();
                        const userDivs = sayThanxForm.querySelectorAll('.user-row'); // Получаем список всех пользователей

                        userDivs.forEach(userDiv => {
                            const name = userDiv.querySelector('.user-card-text').textContent.toLowerCase();
                            const details = userDiv.querySelector('.user-card-text-secondary').textContent.toLowerCase();
                            if (name.includes(searchValue) || details.includes(searchValue)) {
                                userDiv.style.display = 'flex';
                            } else {
                                userDiv.style.display = 'none';
                            }
                        });
                    });
                    
                    content.appendChild(sayThanxForm);
                });
        });
}

export function loadSayThanxForm(userId, backendUrl) {
    const content = document.getElementById('content'); // Контейнер для вставки шаблона
    fetch('subpages/say-thanx.html') // Загружаем HTML-шаблон
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки шаблона');
            }
            return response.text();
        })
        .then(template => {
            content.innerHTML = template; // Вставляем шаблон в DOM
            const sayThanxForm = document.getElementById('say-thanx-content'); // Теперь say-thanx-form доступен
            // Создаем форму
            const form = document.createElement('form');
            form.id = 'say-thanx-form';
            // Предупреждение, что не хватает доступных спасибо для отправки
            const warning = document.createElement('p');
            warning.classList.add('warning-block');
            warning.textContent = 'Доступные на этот месяц спасибо закончились';
            warning.style.display = 'none';
            form.appendChild(warning);
            // Добавляем select на основе $backendUrl/users/get/all
            // Добавляем label для select
            const selectLabel = document.createElement('label');
            selectLabel.setAttribute('for', 'user-select');
            selectLabel.textContent = 'Отправить спасибо';
            selectLabel.classList.add('card-title');
            form.appendChild(selectLabel);

            const select = document.createElement('select');
            select.id = 'user-select';
            fetch(`${backendUrl}/users/get/all`)
                .then(res => res.json())
                .then(users => {
                    users.forEach(user => {
                        const option = document.createElement('option');
                        option.value = user.id;
                        option.textContent = `${user.name} ${user.surname} (${user.title})`;
                        if (currentUserId != user.id) {
                            select.appendChild(option);
                        }
                        // console.log(`Пользователь с ID: ${user.id}, Имя: ${user.name}, Фамилия: ${user.surname}, Должность: ${user.title}`);
                        select.value = userId;
                    });
                });
            select.classList.add('form-select');
            select.selectedIndex = userId; // Устанавливаем значение по умолчанию = userId;
            select.required = true;
            select.addEventListener('change', () => {
                const selectedUserId = select.value;
                console.log(`Выбран пользователь с ID: ${selectedUserId}`);
            })
            form.appendChild(select);

            // Добавляем textarea
            const textareaLabel = document.createElement('label');
            textareaLabel.setAttribute('for', 'message');
            textareaLabel.textContent = 'Опишите, за что хотите поблагодарить коллегу';
            textareaLabel.classList.add('card-title');
            form.appendChild(textareaLabel);
            const textarea = document.createElement('textarea');
            textarea.id = 'message';
            textarea.classList.add('form-control');
            textarea.placeholder = 'Поле для ввода за что';
            textarea.required = true;
            textarea.rows = 5;
            form.appendChild(textarea);
            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('d-flex', 'justify-content-end');

            const cancelButton = document.createElement('div');
            cancelButton.classList.add('col-2');
            cancelButton.type = 'button';
            cancelButton.id = 'cancel-thx';
            cancelButton.style.marginRight = '1em';
            cancelButton.textContent = 'ОТМЕНА';
            cancelButton.classList.add('btn', 'btn-gray');
            cancelButton.addEventListener('click', () => {
                reloadMenu('say-thanx');
            });
            buttonsDiv.appendChild(cancelButton);

            const submitButton = document.createElement('button');
            submitButton.classList.add('col-4');
            submitButton.type = 'submit';
            submitButton.id = 'submit-thx';
            submitButton.textContent = 'ОТПРАВИТЬ СПАСИБО';
            // Проверим, что thx_count из запроса $backendUrl/thx/get/$currentUserId не равен 0
            fetch(`${backendUrl}/thx/get/${currentUserId}`)
                .then(res => res.json())
                .then(data => {
                    const thx_count = data.thx_count;
                    const max_thx = data.max_thx;
                    console.log(`thx_count: ${thx_count} max_thx: ${max_thx}`);
                    if (thx_count === 0) {
                        submitButton.disabled = true;                        
                        warning.style.display = 'block';
                    }
                })
            // К  textContent добавляем иконку svg
            submitButton.innerHTML += '<img src="imgs/icons/w/hand.svg" alt="Отправить сообщение" style="height: 1em; margin-left: 0.5em;">';
            submitButton.classList.add('btn', 'btn-primary');
            buttonsDiv.appendChild(submitButton);

            form.appendChild(buttonsDiv);

            // Добавляем форму в DOM
            sayThanxForm.appendChild(form);

            // Добавляем обработчик отправки формы
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const selectedUserId = select.value; // Получаем выбранного пользователя
                const message = textarea.value; // Получаем текст сообщения
                // Отправляем запрос на $backendUrl/users/say-thank-you
                fetch(`${backendUrl}/thx`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender_id: currentUserId,
                        receiver_id: selectedUserId,
                        message: message
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.result === 'success') {
                        console.log('Сообщение отправлено');
                        showResultThxContent(data.result);
                    } else {
                        console.log('Ошибка отправки сообщения');
                    }
                });
            });
        });
}

// Функция вывода результатов отправки спасибо
function showResultThxContent(result) {
    const resultContainer = document.getElementById('say-thanx-content');
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
    resultText.textContent = 'Ваша благодарность отправлена!';

    const resultText2 = document.createElement('div');

    // Выводим остаток спасибо
    fetch(`${backendUrl}/thx/get/${currentUserId}`)
        .then(res => res.json())
        .then(data => {
            const thx_count = data.thx_count;
            const max_thx = data.max_thx;
            console.log(`thx_count: ${thx_count} max_thx: ${max_thx}`);
            resultText2.textContent = `Осталось спасибо в этом месяце: ${thx_count} N`;
            resultText2.classList.add('col-12', 'text-center', 'mt-3');
        });

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
    anotherButton.textContent = 'ЕЩЕ СПАСИБО';
    anotherButton.classList.add('btn', 'btn-gray', 'mx-2');
    anotherButton.addEventListener('click', () => {
        reloadMenu('say-thanx');
    });
    buttonsDiv.appendChild(anotherButton);

    resultContainer.appendChild(buttonsDiv);
}
