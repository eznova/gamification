const backendUrl = localStorage.getItem('backendUrl');

import { reloadMenu } from '../navbar.js';


function sendQuestResolution(resolution, quest_id, user_id) {
    // Создаем объект с данными для отправки
    const data = {
        id: quest_id,
        resolution: resolution, 
        user_id: user_id
    };

    // Отправляем POST-запрос на сервер
    fetch(`${backendUrl}/tasks/moderation`, {
        method: 'POST', // Используем метод POST
        headers: {
            'Content-Type': 'application/json' // Указываем, что отправляем JSON
        },
        body: JSON.stringify(data) // Преобразуем объект в JSON строку
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при отправке данных');
        }
        // После успешной отправки, вызываем renderQuestsPage
        console.log(`${resolution} задача с ID: ${quest_id}`);
        renderQuestsPage(userId, backendUrl);
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}


// Функция для создания карточки задачи
function createTaskCard(task) {
    console.log(task);
    // Создаем div для карточки задачи
    const taskDiv = document.createElement('div');
    taskDiv.style.margin = '1em';
    taskDiv.style.padding = '1em';
    taskDiv.style.width = '100%';  // Карточка будет занимать 100% ширины
    taskDiv.classList.add('task'); // Можно добавить класс для стилей

    // Добавляем заголовок с именем и фамилией
    const header = document.createElement('div');
    header.classList.add('user-card-text');
    header.style.paddingBottom = '0.5em';
    header.textContent = `${task.name} ${task.surname} | ${task.task_name}`;
    taskDiv.appendChild(header);

    // Добавляем описание задачи
    const description = document.createElement('div');
    description.classList.add('card-text');
    description.textContent = task.task_description;
    taskDiv.appendChild(description);

    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end'; // Кнопки выровнены по правому краю
    buttonContainer.style.marginTop = '1em';  // Отступ сверху

    // Создаем кнопку "Принять"
    const acceptBtn = document.createElement('img');
    acceptBtn.src = "imgs/icons/accept-btn.svg"; // Используем src для изображения
    acceptBtn.style.width = '30px';
    acceptBtn.style.height = '30px';
    acceptBtn.style.border = 'none';
    acceptBtn.style.backgroundSize = 'cover';
    acceptBtn.style.cursor = 'pointer';
    acceptBtn.addEventListener('click', () => {
        sendQuestResolution('accepted', task.id, task.user_id);
    });

    // Создаем кнопку "Отклонить"
    const rejectBtn = document.createElement('img');
    rejectBtn.src = "imgs/icons/reject-btn.svg"; // Используем src для изображения
    rejectBtn.style.width = '30px';
    rejectBtn.style.height = '30px';
    rejectBtn.style.border = 'none';
    rejectBtn.style.backgroundSize = 'cover';
    rejectBtn.style.cursor = 'pointer';
    rejectBtn.style.marginRight = '0.5em';
    rejectBtn.addEventListener('click', () => {
        sendQuestResolution('rejected', task.id);
    });

    // Добавляем кнопки в контейнер
    buttonContainer.appendChild(rejectBtn);
    buttonContainer.appendChild(acceptBtn);

    // Добавляем контейнер с кнопками в div задачи
    taskDiv.appendChild(buttonContainer);

    return taskDiv;
}

import { checkAdmin } from '../rolesController.js';


export async function renderQuestsPage(userId, backendUrl) {
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

    fetch('subpages/quests.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки шаблона');
            }
            return response.text();
        })
        .then(template => {
            content.innerHTML = template;
            const resultContainer = document.getElementById('quests-content');
            resultContainer.innerHTML = ''; // Очищаем содержимое формы

            // Получаем данные с backendUrl/tasks/get/moderation
            fetch(`${backendUrl}/tasks/get/moderation`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка получения данных');
                    }
                    return response.json();
                })
                .then(tasks => {
                    // Проходим по каждому элементу массива задач
                    tasks.forEach(task => {
                        // Используем функцию для создания карточки задачи
                        const taskCard = createTaskCard(task);
                        resultContainer.appendChild(taskCard);
                    });
                })
                .catch(error => {
                    console.error('Ошибка при получении задач:', error);
                });
        })
        .catch(error => {
            console.error('Ошибка загрузки шаблона:', error);
        });
}
