import { loadUserPageContent } from './userPage.js';

const backendUrl = localStorage.getItem('backendUrl');

// Функция для получения активных ачивок пользователя с учетом количества
function getActiveAchievements(userId, backendUrl) {
    return fetch(`${backendUrl}/achievements/get/${userId}`)
        .then(res => res.json())
        .then(achievements => {
            // Преобразуем данные в формат {id, quantity}
            const achievementDetails = achievements.map(achievement => ({
                id: achievement.achievement_id,
                quantity: achievement.quantity // предполагаем, что API возвращает поле "quantity"
            }));
            return achievementDetails;  // Возвращаем массив с объектами {id, quantity}
        })
        .catch(error => {
            console.error('Error:', error);
            return [];  // В случае ошибки возвращаем пустой массив
        });
}


function createThxCard(thxDetail) {
    const thxCard = document.createElement('div');
    thxCard.classList.add('mb-3', 'card');
    thxCard.style.padding = '1em';
    thxCard.style.width = '100%';
    thxCard.id = `thx-${thxDetail.id}`;
    thxCard.style.alignItems = 'flex-start';

    const thxCardBody = document.createElement('div');
    // Добавление даты
    const thxDate = document.createElement('div');
    thxDate.classList.add('user-card-text-secondary');
    thxDate.textContent = `${new Date(thxDetail.created_at).toLocaleString()}`;  // Дата
    thxCardBody.appendChild(thxDate);


    // Добавление имени отправителя
    const thxSender = document.createElement('div');
    thxSender.classList.add('thx-sender');

    // Создаем элемент для имени с жирным шрифтом
    const senderName = document.createElement('strong');
    senderName.textContent = thxDetail.sender_name;  // Имя отправителя
    senderName.addEventListener('click', () => {
        loadUserPageContent(thxDetail.sender_id, backendUrl);
    })
    senderName.addEventListener('mouseover', (event) => {
        event.target.style.cursor = 'pointer'; // меняем курсор на ладошку
    });

    thxSender.appendChild(senderName);
    thxSender.appendChild(document.createTextNode(' поблагодарил(а) Вас'));  // Текст после имени

    thxCardBody.appendChild(thxSender);

    // Добавление сообщения
    const thxMessage = document.createElement('div');
    thxMessage.classList.add('thx-message');
    thxMessage.textContent = `"${thxDetail.message}"`;  // Сообщение
    thxCardBody.appendChild(thxMessage);


    thxCard.appendChild(thxCardBody);

    const achievmentsContainer = document.getElementById('achievements-content');
    achievmentsContainer.appendChild(thxCard);
}


// Функция для получения деталей ачивок
function getThxDetails(backendUrl, userId) {
    return fetch(`${backendUrl}/thx/get/${userId}/details`)
        .then(res => res.json())
        .then(data => data.thx_details || [])  // Возвращаем только thx_details
        .catch(error => {
            console.error('Error:', error);
            return [];  // В случае ошибки возвращаем пустой массив
        });
}

async function loadThxDetails(userId, backendUrl) {
    try {
        const achievements = await getActiveAchievements(userId, backendUrl);
        const thxDetails = await getThxDetails(backendUrl, userId);
        const achievmentsContainer = document.getElementById('achievements-content');
        achievmentsContainer.innerHTML = '';
        const pageTitle = document.createElement('div');
        pageTitle.classList.add('row', 'page-title');
        pageTitle.style.marginBottom = '1em';
        pageTitle.textContent = 'Мои благодарности';
        achievmentsContainer.appendChild(pageTitle);

        thxDetails.forEach(thxDetail => {
            createThxCard(thxDetail);
        });
    } catch (error) {
        console.error('Error loading thanx details:', error);
    }
}


// Функция для создания карточки ачивки
function createAchievementCard(achievment, achievmentsDetails) {
    let className;
    let quantity = 0;

    // Ищем соответствующее количество ачивки
    const achievmentDetail = achievmentsDetails.find(item => item.id === achievment.id);
    if (achievmentDetail && achievmentDetail.quantity > 0) {
        className = 'no-grayscale';
        quantity = achievmentDetail.quantity; // Используем количество из данных
    } else {
        className = 'grayscale';
    }

    // Создаем контейнер для карточки
    const achievmentDiv = document.createElement('div');
    achievmentDiv.classList.add(className, 'mb-3');
    achievmentDiv.style.maxWidth = '180px';
    achievmentDiv.style.alignItems = 'flex-start';

    // Создаем основной контейнер для карточки
    const achievmentCard = document.createElement('div');
    achievmentCard.classList.add('mb-3', 'flex');
    achievmentCard.id = `achievment-${achievment.id}`;

    // Создаем тело карточки
    const achievmentCardBody = document.createElement('div');
    achievmentCardBody.classList.add('text-center'); // Центрируем контент

    // Создаем элемент для изображения
    const achievmentImg = document.createElement('img');
    achievmentImg.classList.add('mb-2'); // Добавляем отступ снизу
    achievmentImg.src = `imgs/achievements/${achievment.img_name}`;
    achievmentImg.alt = achievment.name;

    // Создаем элемент для названия ачивки
    const achievmentTitle = document.createElement('p');
    achievmentTitle.classList.add('achievment-title');
    achievmentTitle.textContent = achievment.name;

    // Создаем элемент для отображения количества ачивок
    const achievmentQuantity = document.createElement('p');
    achievmentQuantity.classList.add('achievment-quantity');
    if (quantity === 0) {
        achievmentQuantity.textContent = `${quantity}`;
    }
    else {
        achievmentQuantity.textContent = `${quantity}`;
    }

    // Добавляем элементы в тело карточки
    achievmentCardBody.appendChild(achievmentImg);
    achievmentCardBody.appendChild(achievmentQuantity);  // Добавляем количество
    achievmentCardBody.appendChild(achievmentTitle);

    // Добавляем тело карточки в карточку
    achievmentCard.appendChild(achievmentCardBody);

    // Добавляем основную карточку в контейнер
    achievmentDiv.appendChild(achievmentCard);

    return achievmentDiv;
}

function createAchievementFullCard(achievement, achievementsDetails) {
    const className = 'no-grayscale';

    // Создаем контейнер для карточки
    const achievementDiv = document.createElement('div');
    achievementDiv.classList.add(className, 'mb-3');
    achievementDiv.style.width = '100%'; // Убедимся, что контейнер карточки займет 100% ширины

    // Создаем основной контейнер для карточки
    const achievementCard = document.createElement('div');
    achievementCard.classList.add('mb-3', 'row', 'w-100'); // Используем 'w-100' для ширины 100%
    achievementCard.id = `achievement-${achievement.id}`;

    // Первая колонка для изображения (col-2)
    const achievementImgCol = document.createElement('div');
    achievementImgCol.classList.add('col-2', 'd-flex', 'align-items-center');
    
    const achievementImg = document.createElement('img');
    achievementImg.classList.add('mb-2');
    achievementImg.src = `imgs/achievements/${achievement.img_name}`;
    achievementImg.alt = achievement.name;

    achievementImgCol.appendChild(achievementImg);

    // Вторая колонка для текста и информации о ачивке (col-10)
    const achievementTextCol = document.createElement('div');
    achievementTextCol.classList.add('col-10', 'd-flex', 'flex-column', 'justify-content-center'); // Убедимся, что колонка растягивается по высоте
    
    // Создаем строку для названия и веса (1 строка)
    const row1 = document.createElement('div');
    row1.classList.add('row', 'mb-2');
    
    const titleCol = document.createElement('div');
    titleCol.classList.add('col-10'); // Название слева
    const achievementTitle = document.createElement('p');
    achievementTitle.classList.add('achievement-full-title');
    achievementTitle.textContent = achievement.name;
    titleCol.appendChild(achievementTitle);
    
    const weightCol = document.createElement('div');
    weightCol.classList.add('col-2', 'text-end'); // Приклеиваем вес к правому краю
    const achievementWeight = document.createElement('div');
    achievementWeight.classList.add('achievement-weight');
    achievementWeight.textContent = `${achievement.weight} ⭐`; // Замена "Weight" на звёздочку
    weightCol.appendChild(achievementWeight);

    row1.appendChild(titleCol);
    row1.appendChild(weightCol);
    
    // Создаем строку для описания ачивки (2 строка)
    const row2 = document.createElement('div');
    row2.classList.add('row', 'mb-2');
    
    const descriptionCol = document.createElement('div');
    descriptionCol.classList.add('col-12');
    const achievementDescription = document.createElement('p');
    achievementDescription.classList.add('achievement-description');
    achievementDescription.textContent = achievement.description;
    descriptionCol.appendChild(achievementDescription);

    row2.appendChild(descriptionCol);
    
    // Добавляем строки в колонку с текстом
    achievementTextCol.appendChild(row1);
    achievementTextCol.appendChild(row2);

    // Добавляем обе колонки в карточку
    achievementCard.appendChild(achievementImgCol);
    achievementCard.appendChild(achievementTextCol);

    // Добавляем основную карточку в контейнер
    achievementDiv.appendChild(achievementCard);

    return achievementDiv;
}


export function rewardUser(data, backendUrl) {
    createRewardPage(data, backendUrl);
}

export async function getTeammates(userId) {
    try {
        const res = await fetch(`${backendUrl}/users/get/${userId}/team`)
        const data = await res.json();
        return data; // возвращаем массив пользователей напрямую
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getAllUsers() {
    try {
        const res = await fetch(`${backendUrl}/users/get/all`);
        const data = await res.json();
        return data; // возвращаем массив пользователей напрямую
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function getAchievmentById(data, id) {
    // get key value from data by id
    for (const roleItem in data.role) {
        for (const achievment of data.role[roleItem].wallet) {
            if (achievment.achievement_id === id) {
                return achievment;
            }
        }
    }
}

export async function createRewardPage(data, backendUrl) {
    const content = document.getElementById('content');
    try {
        const response = await fetch('subpages/achievements.html'); // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template; // Сначала вставляем шаблон в DOM

        const rewardsContainer = document.getElementById('achievements-content');
        rewardsContainer.innerHTML = '';

        const rewardsTitle = document.createElement('div');
        rewardsTitle.classList.add('row', 'user-card-title');
        rewardsTitle.style.margin = '1em';
        rewardsTitle.textContent = 'Баланс достижений';
        rewardsContainer.appendChild(rewardsTitle);
        
        // таблица
        const table = document.createElement('table');
        table.style.margin = '1em';
        table.classList.add('table', 'table-striped', 'table-hover');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);
        rewardsContainer.appendChild(table);

        const form = document.createElement('form');
        // select 
        const container = document.createElement('div');
        container.style.margin = '1em';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '0.5em'; // Расстояние между элементами
        
        const select = document.createElement('select');
        const selectLabel = document.createElement('label');
        selectLabel.setAttribute('for', 'ach-select');
        selectLabel.textContent = 'Достижение';
        selectLabel.style.width = '20%';
        selectLabel.classList.add('form-label', 'user-card-text-secondary');
        
        select.classList.add('form-control', 'mb-3', 'form-labels', 'user-card-text-secondary');
        select.setAttribute('id', 'ach-select');
        select.appendChild(new Option('Выбрать', ''));
        select.style.margin = '0'; // Убираем внешний отступ
        
        select.addEventListener('change', async () => {
            if (select.value) {
                const departmentOnly = getAchievmentById(data, Number(select.value), 'department_only').department_only;
                let users;
                if (!departmentOnly) {
                    users = await getAllUsers();
                } else {
                    users = await getTeammates(localStorage.getItem('current_user_id'));
                }
                const usersSelect = document.getElementById('users-usersSelect');
                usersSelect.innerHTML = '';
                for (const user of users) {
                    if (user.id != localStorage.getItem('current_user_id')) {
                        const option = document.createElement('option');
                        option.setAttribute('value', user.id);
                        option.textContent = `${user.name} ${user.patronymic} ${user.surname}`;
                        usersSelect.appendChild(option);
                    }
                }
            }
        });

        select.setAttribute('required', 'true');
        
        container.appendChild(selectLabel);
        container.appendChild(select);
        rewardsContainer.appendChild(container);

        // select 
        const container2 = document.createElement('div');
        container2.style.margin = '1em';
        container2.style.display = 'flex';
        container2.style.alignItems = 'center';
        container2.style.gap = '0.5em';

        const usersSelect = document.createElement('select');
        const usersSelectLabel = document.createElement('label');
        usersSelectLabel.setAttribute('for', 'users-select');
        usersSelectLabel.style.width = '20%';
        usersSelectLabel.textContent = 'Сотрудник';
        usersSelectLabel.classList.add('form-label', 'user-card-text-secondary');
        
        usersSelect.classList.add('form-control', 'mb-3', 'form-labels', 'user-card-text-secondary');
        usersSelect.setAttribute('id', 'users-usersSelect');
        usersSelect.appendChild(new Option('Выбрать', ''));
        usersSelect.style.margin = '0'; // Убираем внешний отступ

        usersSelect.setAttribute('required', 'true');

        container2.appendChild(usersSelectLabel);
        container2.appendChild(usersSelect);
        rewardsContainer.appendChild(container2);
        
        
        const theadRow = document.createElement('tr');
        theadRow.classList.add('page-title');
        theadRow.style.fontSize = '0.7em';
        const th1 = document.createElement('th');
        th1.textContent = 'Достижение';
        const th2 = document.createElement('th');
        th2.textContent = 'Осталось на квартал';
        const th3 = document.createElement('th');
        th3.textContent = 'Баллы сотруднику';
        theadRow.appendChild(th1);
        theadRow.appendChild(th2);
        theadRow.appendChild(th3);
        thead.appendChild(theadRow);
        const submitButton = document.createElement('button');
        for (const roleItem in data.role) {
            for (const achievment of data.role[roleItem].wallet) {
                const achievmentRow = document.createElement('tr');
                achievmentRow.classList.add('achievment-row');
                const td1 = document.createElement('td');
                td1.textContent = achievment.achievement_name;
                const td2 = document.createElement('td');
                td2.textContent = `${achievment.count}`;
                const td3 = document.createElement('td');
                td3.textContent = `${achievment.achievement_weight} ⭐`;
                achievmentRow.appendChild(td1);
                achievmentRow.appendChild(td2);
                achievmentRow.appendChild(td3);
                tbody.appendChild(achievmentRow);
                if (achievment.count > 0) {
                    const option = document.createElement('option');
                    option.setAttribute('value', achievment.achievement_id);
                    option.textContent = achievment.achievement_name;
                    select.appendChild(option);
                }
                else {
                    submitButton.disabled = true;
                }
            } 
        }

        // Контейнер для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'right'; // Выравниваем кнопку по правому краю
    
        // Кнопка "Отмена"
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('btn', 'btn-gray');
        cancelButton.textContent = 'Отмена';
        cancelButton.style.marginRight = '1em'; // Добавляем отступ справа для кнопки "Отмена"
        cancelButton.addEventListener('click', function() {
            // Реализовать действия при отмене
        });
        buttonContainer.appendChild(cancelButton);
    
        // Кнопка "Отправить на модерацию"
        submitButton.id = 'btn-submit';
        submitButton.classList.add('btn', 'btn-primary');
        submitButton.textContent = 'ОТПРАВИТЬ ДОСТИЖЕНИЕ';
        submitButton.style.marginTop = '1em'; // Добавляем отступ сверху для кнопки
    
        buttonContainer.appendChild(submitButton);
        form.appendChild(buttonContainer);

        // Добавляем обработчик на submit формы
        submitButton.addEventListener('click', function(event) {
            event.preventDefault(); // Отменяем стандартное поведение (перезагрузку страницы)
            const result = {
                achievement_id: Number(select.value),
                user_id: Number(usersSelect.value),
                sender_id: Number(userId),
                achievement_weight: Number(getAchievmentById(data, Number(select.value), 'achievement_weight').achievement_weight)
            };
            sendAchievment(result, backendUrl);
        });

        rewardsContainer.appendChild(form);
        content.appendChild(rewardsContainer);
    } catch (error) {
        console.error('Error loading thanx details:', error);
    }
}



export function sendAchievment(data, backendUrl) {
    console.log(data);
    fetch(`${backendUrl}/achievments/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

import { checkRoles } from '../rolesController.js';

// Обновленная версия loadAchievementsContent с await
export async function loadAchievementsContent(userId, backendUrl, signal) {
    const content = document.getElementById('content'); // Элемент контента, куда вставим top10.html
    try {
        const response = await fetch('subpages/achievements.html'); // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template; // Сначала вставляем шаблон в DOM

        const achievmentsResponse = await fetch(`${backendUrl}/achievments/get/all`, { signal });
        const achievments = await achievmentsResponse.json();
        const achievmentsContainer = document.getElementById('achievements-content');
        const pageTitleDiv = document.createElement('div');
        pageTitleDiv.classList.add('row');
        const pageTitle = document.createElement('div');
        pageTitle.classList.add('col-12');
        pageTitle.classList.add('page-title');
        // Здесь потом будет логика по добавлению кнопки выдачи достижения
        pageTitle.style.marginBottom = '1em';
        pageTitle.textContent = 'Мои достижения';
        pageTitleDiv.appendChild(pageTitle);
        achievmentsContainer.appendChild(pageTitleDiv);

        const {privilegedUser, data} = await checkRoles();
        if (privilegedUser) {
            pageTitle.classList.remove('col-12');
            pageTitle.classList.add('col-7');

            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add('col-5', 'page-title');
            buttonDiv.style.marginBottom = '1em';
            buttonDiv.style.textAlign = 'left';
            buttonDiv.textContent = 'Наградить сотрудника';
            buttonDiv.addEventListener('mouseover', () => {
                buttonDiv.style.cursor = 'pointer';
            })
            buttonDiv.addEventListener('click', () => {
                rewardUser(data, backendUrl);
            });
            pageTitleDiv.appendChild(buttonDiv);
        }

        const achievmentList = document.createElement('div');
        achievmentList.id = 'achievements-list';
        
        // Создаем объект для групп
        const groups = {};

        achievments.forEach(achievment => {
            // Группируем ачивки по group_id
            if (!groups[achievment.group_id]) {
                groups[achievment.group_id] = {
                    groupName: achievment.group_name,
                    achievements: []
                };
            }
            groups[achievment.group_id].achievements.push(achievment);
        });

        const achievmentsDetails = await getActiveAchievements(userId, backendUrl);  // Получаем активные ачивки с количеством
        
        // Для каждой группы создаем соответствующий блок
        for (const groupId in groups) {
            const group = groups[groupId];
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('group');
            
            const firstGroupTitleDiv = document.createElement('div');
            firstGroupTitleDiv.classList.add('row');
            const groupTitle = document.createElement('div');
            groupTitle.classList.add('group-title');
            // groupTitle.addEventListener('mouseover', () => {
            //     groupButton.style.cursor = 'pointer';
            // })
            if (groupId === '1') {
                groupTitle.classList.add('col-md-7');

                const groupButton = document.createElement('div');
                groupButton.classList.add('col-md-5', 'group-title');
                groupButton.textContent = 'Посмотреть благодарности';
                groupButton.style.textAlign = 'center';
                groupButton.addEventListener('mouseover', () => {
                    groupButton.style.cursor = 'pointer';
                })
                groupButton.addEventListener('click', () => {
                    loadThxDetails(userId, backendUrl);
                });
                groupTitle.textContent = group.groupName;
                firstGroupTitleDiv.appendChild(groupTitle);
                firstGroupTitleDiv.appendChild(groupButton);
            } else {
                groupTitle.textContent = group.groupName;
                firstGroupTitleDiv.appendChild(groupTitle);
            }
            groupTitle.addEventListener('click', () => {
                // Очищаем контейнер достижений
                achievmentsContainer.innerHTML = '';
                // Добавляем заголовок
                achievmentsContainer.appendChild(pageTitle);

                // Отображаем достижения только для этой группы
                const groupElemsDiv = document.createElement('div');
                groupElemsDiv.classList.add('group-content');

                const rows = [];
                let currentRow = [];

                group.achievements.forEach((achievment, index) => {
                    const achievmentCard = createAchievementFullCard(achievment, achievmentsDetails);  // Передаем количество ачивки
                    
                    currentRow.push(achievmentCard);
                    
                    if (currentRow.length === 3 || index === group.achievements.length - 1) {
                        const rowDiv = document.createElement('div');
                        rowDiv.classList.add('row', 'group-row');
                        
                        currentRow.forEach(card => {
                            rowDiv.appendChild(card);
                        });

                        rows.push(rowDiv);
                        currentRow = [];
                    }
                });

                rows.forEach(row => {
                    groupElemsDiv.appendChild(row);
                });

                achievmentsContainer.appendChild(groupElemsDiv);

                const achievementsBackButton = document.createElement('div');
                achievementsBackButton.classList.add('btn', 'btn-primary');
                achievementsBackButton.textContent = 'НАЗАД К КАРТЕ ДОСТИЖЕНИЙ';
                achievementsBackButton.addEventListener('click', () => {
                    loadAchievementsContent(userId, backendUrl);
                });
                
                // Создайте контейнер для кнопки, чтобы выровнять ее по правому краю
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex'; 
                buttonContainer.style.justifyContent = 'flex-end'; // выравнивание по правому краю
                
                buttonContainer.appendChild(achievementsBackButton);
                achievmentsContainer.appendChild(buttonContainer);
            });

            groupDiv.appendChild(firstGroupTitleDiv);

            const groupElemsDiv = document.createElement('div');
            groupElemsDiv.classList.add('group-content');
            
            const rows = [];
            let currentRow = [];

            group.achievements.forEach((achievment, index) => {
                const achievmentCard = createAchievementCard(achievment, achievmentsDetails);  // Передаем количество ачивки
                
                currentRow.push(achievmentCard);
                
                if (currentRow.length === 3 || index === group.achievements.length - 1) {
                    const rowDiv = document.createElement('div');
                    rowDiv.classList.add('row', 'group-row');
                    
                    currentRow.forEach(card => {
                        rowDiv.appendChild(card);
                    });

                    rows.push(rowDiv);
                    currentRow = [];
                }
            });

            rows.forEach(row => {
                groupElemsDiv.appendChild(row);
            });

            groupDiv.appendChild(groupElemsDiv);
            achievmentList.appendChild(groupDiv);
            achievmentsContainer.appendChild(achievmentList);
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}
