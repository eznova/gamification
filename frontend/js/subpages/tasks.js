import { reloadMenu } from "../navbar.js";
const backendUrl = localStorage.getItem('backendUrl');


// Функция для получения всех задач
async function getTasks(userId, backendUrl, signal) {
    const response = await fetch(`${backendUrl}/tasks/get`, {
        headers: {
            'Authorization': `Bearer ${userId}`,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'user_id': userId
        }),
        signal
    })
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


// Функция для создания карточки задачи
function createTaskCard(userId, task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('mb-3', 'card');
    taskCard.style.padding = '1em';
    taskCard.style.width = '100%';
    taskCard.id = `task-${task.id}`;
    taskCard.style.alignItems = 'flex-start';

    const taskCardBody = document.createElement('div');
    // taskCardBody.classList.add('task-card-body');

    // Создаем строку для названия и веса (1 строка)
    const row1 = document.createElement('div');
    row1.classList.add('row', 'mb-2');
    
    const titleCol = document.createElement('div');
    titleCol.classList.add('col-10'); // Название слева
    const taskName = document.createElement('p');
    taskName.classList.add('achievement-full-title');
    taskName.textContent = task.task_name;
    titleCol.appendChild(taskName);
    
    const weightCol = document.createElement('div');
    weightCol.classList.add('col-2', 'text-end'); // Приклеиваем вес к правому краю
    const taskWeight = document.createElement('div');
    taskWeight.classList.add('achievement-weight');
    taskWeight.textContent = `${task.task_weight} ⭐`; // Замена "Weight" на звёздочку
    weightCol.appendChild(taskWeight);

    row1.appendChild(titleCol);
    row1.appendChild(weightCol);
    taskCardBody.appendChild(row1);

    // Добавление описания задачи
    const taskDescription = document.createElement('div');
    taskDescription.classList.add('achievement-description');;
    taskDescription.textContent = task.task_description;
    taskCardBody.appendChild(taskDescription);

    // Если задача открыта, добавляем кнопку для её выполнения
    if (task.is_open) {
        const completeButton = document.createElement('button');
        completeButton.classList.add('btn', 'btn-success');
        completeButton.style.marginLeft = '1em';
        completeButton.style.marginTop = '1em';
        completeButton.textContent = 'Выполнить задание';
        completeButton.addEventListener('click', () => {
            completeTask(task, userId, backendUrl);  // Функция для выполнения задачи
        });
        taskCardBody.appendChild(completeButton);
    }

    taskCard.appendChild(taskCardBody);

    const tasksContainer = document.getElementById('tasks-content');
    tasksContainer.appendChild(taskCard);
}


function completeTask(task, userId, backendUrl) {
    // Очистка содержимого
    const container = document.getElementById('tasks-content'); // Идентификатор контейнера для вставки элементов
    container.innerHTML = '';

    // Создание строки с двумя колонками
    const row = document.createElement('div');
    row.classList.add('row');
    
    const col1 = document.createElement('div');
    col1.classList.add('col');
    const title1 = document.createElement('div');
    title1.classList.add('page-title');
    title1.textContent = 'Выполнение задания';
    col1.appendChild(title1);
    
    const col2 = document.createElement('div');
    col2.classList.add('col');
    const title2 = document.createElement('div');
    title2.classList.add('page-title');
    title2.textContent = task.task_name;
    col2.appendChild(title2);
    
    row.appendChild(col1);
    row.appendChild(col2);
    row.style.marginBottom = '2em';
    container.appendChild(row);

    // Создание блока с описанием
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('achievement-description');
    descriptionDiv.textContent = 'Чтобы получить баллы за выполненное задание, вам необходимо отправить подтверждение выполнения, пожалуйста, напишите что вы сделали в рамках квеста. После премодерации Вам сразу же начислят баллы 👍';
    container.appendChild(descriptionDiv);

    // Создание блока "Выбранное задание"
    const selectedTaskDiv = document.createElement('div');
    selectedTaskDiv.classList.add('card-title');
    selectedTaskDiv.style.marginTop = '2em';
    selectedTaskDiv.style.marginBottom = '1em';
    selectedTaskDiv.textContent = 'Выбранное задание';
    container.appendChild(selectedTaskDiv);

    // Создание блока с описанием задания
    const taskDescriptionDiv = document.createElement('div');
    taskDescriptionDiv.classList.add('card-wb', 'achievement-description');
    taskDescriptionDiv.style.padding = '1em';
    taskDescriptionDiv.textContent = task.task_description;
    taskDescriptionDiv.style.alignItems = 'center';
    container.appendChild(taskDescriptionDiv);

    // Форма с textarea и кнопкой
    const form = document.createElement('form');
    
    // label и textarea в отдельном контейнере
    const labelContainer = document.createElement('div');
    labelContainer.style.marginBottom = '1em'; // Добавляем отступ снизу
    
    const label = document.createElement('label');
    label.classList.add('card-title');
    label.setAttribute('for', 'task_description');
    label.textContent = 'Кратко опишите выполнение квеста';
    label.style.marginBottom = '1em';
    label.style.marginTop = '2em';
    
    const textarea = document.createElement('textarea');
    textarea.classList.add('card-wb', 'w-100');
    textarea.style.padding = '1em';
    
    textarea.setAttribute('required', 'true');
    textarea.setAttribute('maxlength', '1000');
    textarea.setAttribute('minlength', '10');
    textarea.setAttribute('name', 'task_description');
    textarea.setAttribute('id', 'task_description');
    textarea.setAttribute('rows', '5'); // Устанавливаем количество строк

    labelContainer.appendChild(label);
    labelContainer.appendChild(textarea);
    
    form.appendChild(labelContainer);

    // Контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right'; // Выравниваем кнопку по правому краю

    // Кнопка "Отмена"
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-gray');
    cancelButton.textContent = 'Отмена';
    cancelButton.style.marginRight = '1em'; // Добавляем отступ справа для кнопки "Отмена"
    cancelButton.addEventListener('click', function() {
        loadTasksContent(userId, backendUrl); // Замените на свой код для загрузки контента
    });
    buttonContainer.appendChild(cancelButton);

    // Кнопка "Отправить на модерацию"
    const submitButton = document.createElement('button');
    submitButton.classList.add('btn', 'btn-primary');
    submitButton.textContent = 'Отправить на модерацию';
    submitButton.style.marginTop = '1em'; // Добавляем отступ сверху для кнопки
    buttonContainer.appendChild(submitButton);

    // Добавляем контейнер с кнопками в форму
    form.appendChild(buttonContainer);

    container.appendChild(form);

    // Обработчик отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Предотвращаем отправку формы по умолчанию
        const taskDescription = textarea.value; // Получаем содержимое textarea
        const response = await fetch(`${backendUrl}/tasks/add/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task_id: task.id,
                user_id: userId,
                result: taskDescription
            }),
            signal
        })
        .then(response => {
            return response.json()
        })
        .then(result => {
            console.log(result);
            if (result.result === "success") {
                showResultTaskContent(result);
            }
        })
        .catch(error => {
            console.error('Error sending task:', error);
        });
    });    
}


// Функция для загрузки задач
export async function loadTasksContent(userId, backendUrl, signal) {
    // console.log(`Загружаем задачи пользователя ${userId}: ${backendUrl}`);
    const content = document.getElementById('content');
    try {
        const response = await fetch('subpages/tasks.html');  // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template;  // Вставляем шаблон в DOM

        const tasks = await getTasks(userId, backendUrl);
        const tasksContainer = document.getElementById('tasks-content');
        
        const pageTitle = document.createElement('div');
        pageTitle.classList.add('row', 'page-title');
        pageTitle.style.marginBottom = '1em';
        pageTitle.textContent = 'Открытые квесты';
        tasksContainer.appendChild(pageTitle);

        tasks.forEach(task => {
            createTaskCard(userId, task);
        });
    } catch (error) {
        console.log('Loading page was interruptedtasks:', error);
    }
}


// Функция вывода результатов отправки спасибо
function showResultTaskContent(result) {
    const resultContainer = document.getElementById('tasks-content');
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
    resultText.textContent = 'Квест отправлен на модерацию!';

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
    anotherButton.textContent = 'ЕЩЕ КВЕСТЫ';
    anotherButton.classList.add('btn', 'btn-gray', 'mx-2');
    anotherButton.addEventListener('click', () => {
        reloadMenu('season-tasks');
    });
    buttonsDiv.appendChild(anotherButton);

    resultContainer.appendChild(buttonsDiv);
}
