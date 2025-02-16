import { loadSayThanxForm } from "./sayThanx.js";
import { initMyPageEventHandlers } from "../upload.js";

const currentUser = localStorage.getItem('current_user_id');
const backendUrl = localStorage.getItem('backendUrl');

export async function loadUserPageContent(userId, backendUrl, signal) {
    // console.log(`Загружаем страницу пользователя ${userId}: ${backendUrl}`);
    localStorage.setItem('user_id', userId);
    const content = document.getElementById('content');
    const response = await fetch('subpages/user-page.html', { signal });
    if (!response.ok) {
        throw new Error('Ошибка загрузки шаблона');
    }
    const template = await response.text();
    content.innerHTML = template;
    const userContent = document.getElementById('user-content');

    // Инициализация переменной для отображения всех пользователей
    const teamMembersGridDiv = document.createElement('div');
    
    // Загружаем данные о пользователе
    return Promise.all([
        fetch(`${backendUrl}/users/get/${userId}/personal`).then(res => res.json()),
        fetch(`${backendUrl}/users/get/${userId}/photo`).then(res => res.blob()),
        fetch(`${backendUrl}/users/get/${userId}/job_info`).then(res => res.json()),
        fetch(`${backendUrl}/users/get/${userId}/details`).then(res => res.json())
    ])
    .then(([personalData, photoBlob, jobInfoData, detailsData]) => {
        const jobTitle = jobInfoData.job_titles[0]?.title || '';
        const projects = jobInfoData.job_titles[0]?.projects || '';
        const department = jobInfoData.job_titles[0]?.department || '';
        const role = jobInfoData.job_titles[0]?.role || '';

        // Создаём URL для Blob
        const photoSrc = URL.createObjectURL(photoBlob);
        const data = {
            ...personalData,
            photo: photoSrc,
            job_title: jobTitle,
            projects: projects,
            department: department,
            role: role,
            interests: detailsData.interests,
            ncoins: detailsData.ncoins === 0 ? "0" : detailsData.ncoins,
            npoints: detailsData.npoints === 0 ? "0" : detailsData.npoints,
        };

        // Создание карточки пользователя
        const userCard = createUserCard(data);
        userContent.appendChild(userCard);

        // Применяем CSS Grid для контейнера с пользователями
        teamMembersGridDiv.style.display = 'grid';
        teamMembersGridDiv.style.gridTemplateColumns = 'repeat(2, 1fr)'; // 2 колонки
        teamMembersGridDiv.style.gridGap = '20px'; // Отступы между элементами

        return fetch(`${backendUrl}/users/get/${userId}/team`)
            .then(res => res.json())
            .then(allUsers => {
                // Создание строки пользователя
                const createUserRow = (user) => {
                    if (user.id !== userId) {
                        const userDiv = document.createElement('div');
                        userDiv.classList.add('user-row', 'row');
                        userDiv.style.alignItems = 'center';

                        // Создаем первый div для изображения
                        const col1 = document.createElement('div');
                        col1.classList.add('col-1');
                        const img = document.createElement('img');
                        img.setAttribute('width', '30px');
                        img.setAttribute('height', '30px');
                        img.classList.add('rounded-circle');
                        fetch(`${backendUrl}/users/get/${user.id}/photo`)
                            .then(res => res.blob())
                            .then(photoBlob => {
                                const photoUrl = URL.createObjectURL(photoBlob);
                                img.setAttribute('src', photoUrl);
                            });
                        col1.appendChild(img);
                        userDiv.appendChild(col1);

                        // Создаем второй div для имени и должности
                        const col2 = document.createElement('div');
                        col2.classList.add('col-9');
                        const nameDiv = document.createElement('div');
                        nameDiv.classList.add('font-weight-bold');
                        nameDiv.textContent = `${user.name} ${user.surname}`;
                        const detailsDiv = document.createElement('div');
                        detailsDiv.classList.add('text-muted', 'small');
                        detailsDiv.textContent = `${user.job_role}`;
                        col2.appendChild(nameDiv);
                        col2.appendChild(detailsDiv);

                        // Добавляем обработчик клика
                        col2.style.cursor = 'pointer';
                        col2.addEventListener('click', () => {
                            loadUserPageContent(user.id, backendUrl); // Загрузка страницы другого пользователя
                        });

                        // Добавляем колонки в контейнер
                        userDiv.appendChild(col1);
                        userDiv.appendChild(col2);
                        return userDiv;
                    }
                };

                // Перебираем всех пользователей и добавляем их в DOM
                allUsers.forEach(user => {
                    if (user.id !== userId) {
                        const userRow = createUserRow(user);
                        teamMembersGridDiv.appendChild(userRow);
                    }
                });

                const teamCard = document.createElement('div');
                teamCard.classList.add('card', 'mb-3');
                teamCard.style.width = '100%';
                teamCard.style.padding = '3em';
                const teamCardTitle = document.createElement('div');
                teamCardTitle.classList.add('card-inner-title');
                teamCardTitle.textContent = 'Команда';
                teamCardTitle.style.paddingBottom = '1em';
                teamCard.appendChild(teamCardTitle);
                teamCard.appendChild(teamMembersGridDiv);

                userContent.appendChild(teamCard);

                if (userId === userId) { // Может быть здесь логика для проверки текущего пользователя
                    initMyPageEventHandlers();  // Инициализация обработчиков событий для своей страницы
                }
            });
    })
    .catch(error => {
        content.innerHTML = `<p class="text-danger">Ошибка: ${error.message}</p>`;
    });
}



// Функция для создания карточки пользователя
function createUserCard(user) {

    

    // console.log(user);
    // Создание карточки
    const card = document.createElement('div');
    card.style.padding = '2em';
    card.classList.add('card', 'mb-3');

    // Создание загрузчика
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'loader';
    loaderDiv.style.display = 'none';
    const spinnerDiv = document.createElement('div');
    spinnerDiv.classList.add('spinner');
    loaderDiv.appendChild(spinnerDiv);
    card.appendChild(loaderDiv);

    // Создание тела карточки
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Создание строки
    const row = document.createElement('div');
    row.classList.add('row');

    // Создание колонки для фото
    const col1 = document.createElement('div');
    col1.classList.add('col-md-3');
    col1.style.display = 'flex';
    col1.style.alignSelf = 'flex-end';

    const label = document.createElement('label');
    label.setAttribute('for', 'photo-upload');
    const img = document.createElement('img');
    img.id = 'user-photo';
    img.src = user.photo;
    img.alt = 'Фото';
    img.classList.add('img-fluid');
    img.style.cursor = 'pointer';
    img.style.width = '7em';
    img.style.height = '7em';
    img.style.minWidth = '7em';
    img.style.maxWidth = '7em';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    label.appendChild(img);

    const input = document.createElement('input');
    input.id = 'photo-upload';
    input.style.display = 'none';
    input.type = 'file';
    input.accept = 'image/png';

    col1.appendChild(label);
    col1.appendChild(input);
    row.appendChild(col1);

    const col2 = document.createElement('div');
    col2.classList.add('col-md-9',  'd-flex', 'flex-column');


    const rowInner1 = document.createElement('div');
    rowInner1.classList.add('row', 'align-self-start', 'w-100');
    const colInner1 = document.createElement('div');
    colInner1.classList.add('col-md-6');
    rowInner1.appendChild(colInner1);
    const colInner2 = document.createElement('div');
    colInner2.classList.add('col-md-6');
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary');
    button.id = 'say-thanx';
    if (currentUser != user.id) {
        button.hidden = false;
        button.textContent = 'Поблагодарить коллегу ';
        // Добавить внутрь кнопки hands.svg
        const img = document.createElement('img');
        img.src = 'imgs/icons/w/hand.svg';
        img.alt = 'Поблагодарить коллегу';
        img.classList.add('img-fluid');
        img.style.width = '1.5em';
        img.style.height = '1.5em';
        img.style.marginLeft = '0.5em';

        // Устанавливаем display: inline-flex для кнопки, чтобы текст и изображение шли в одну строку
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';

        button.appendChild(img);
        button.addEventListener('click', () => {
            loadSayThanxForm(user.id, backendUrl);
        });
    } else {
        button.hidden = true;
    }
    colInner2.appendChild(button);
    rowInner1.appendChild(colInner2);
    col2.appendChild(rowInner1);

    const rowInner2 = document.createElement('div');
    rowInner2.classList.add('row', 'mt-auto');  // Прижимает блок вниз
    rowInner2.style.paddingBottom = '0em';
    const colInner3 = document.createElement('div');
    colInner3.classList.add('col-md-12');
    const nameText = document.createElement('h4');
    nameText.classList.add('user-card-text');
    nameText.textContent = `${user.surname} ${user.name} ${user.patronymic}`;
    const jobText = document.createElement('p');
    jobText.classList.add('user-card-text-secondary');
    jobText.textContent = `${user.job_title} | ${user.department} | ${user.role}`;
    colInner3.appendChild(nameText);
    colInner3.appendChild(jobText);
    rowInner2.appendChild(colInner3);
    col2.appendChild(rowInner2);
    row.appendChild(col2);

    cardBody.appendChild(row);

    // Контакты
    const rowContacts = document.createElement('div');
    rowContacts.classList.add('row');
    const colContacts = document.createElement('div');
    colContacts.classList.add('col-md-12');
    colContacts.style.marginTop = '2em';
    const contactsText = document.createElement('p');
    contactsText.classList.add('card-inner-title');
    contactsText.textContent = 'Контакты';
    colContacts.appendChild(contactsText);
    rowContacts.appendChild(colContacts);
    cardBody.appendChild(rowContacts);

    const rowContactDetails = document.createElement('div');
    rowContactDetails.classList.add('row');
    rowContactDetails.style.marginTop = '1em';
    const col1Contact = document.createElement('div');
    col1Contact.classList.add('col-md-3');
    const tgTitle = document.createElement('p');
    tgTitle.classList.add('user-card-title', 'card-title');
    tgTitle.textContent = 'Telegram';
    const tgText = document.createElement('p');
    tgText.classList.add('user-card-text');
    tgText.textContent = user.tg_nickname;
    col1Contact.appendChild(tgTitle);
    col1Contact.appendChild(tgText);
    rowContactDetails.appendChild(col1Contact);

    const col2Contact = document.createElement('div');
    col2Contact.classList.add('col-md-9');
    const phoneTitle = document.createElement('p');
    phoneTitle.classList.add('user-card-title', 'card-title');
    phoneTitle.textContent = 'Телефон';
    const phoneText = document.createElement('p');
    phoneText.classList.add('user-card-text');
    phoneText.textContent = user.phone;
    col2Contact.appendChild(phoneTitle);
    col2Contact.appendChild(phoneText);
    rowContactDetails.appendChild(col2Contact);

    cardBody.appendChild(rowContactDetails);

    // Увлечения
    const rowInterests = document.createElement('div');
    rowInterests.classList.add('row');
    const colInterests = document.createElement('div');
    colInterests.classList.add('col-md-6');
    colInterests.style.marginTop = '2em';
    const interestsTitle = document.createElement('p');
    interestsTitle.classList.add('card-inner-title');
    interestsTitle.textContent = 'Увлечения';
    const interestsText = document.createElement('p');
    interestsText.classList.add('user-card-text');
    interestsText.textContent = user.interests;
    colInterests.appendChild(interestsTitle);
    colInterests.appendChild(interestsText);
    rowInterests.appendChild(colInterests);
    const colProjects = document.createElement('div');
    colProjects.classList.add('col-md-6');
    colProjects.style.marginTop = '2em';
    const projectsTitle = document.createElement('p');
    projectsTitle.classList.add('card-inner-title');
    projectsTitle.textContent = 'Проекты';
    const ProjectsText = document.createElement('p');
    ProjectsText.classList.add('user-card-text');
    ProjectsText.textContent = user.projects;
    colProjects.appendChild(projectsTitle);
    colProjects.appendChild(ProjectsText);
    rowInterests.appendChild(colProjects);
    cardBody.appendChild(rowInterests);

    // Баланс и счет
    const rowBalance = document.createElement('div');
    rowBalance.classList.add('row');
    const col1Balance = document.createElement('div');
    col1Balance.classList.add('col-md-3');
    const balanceTitle = document.createElement('p');
    balanceTitle.classList.add('card-inner-title');
    balanceTitle.textContent = 'Счет';
    const balanceText = document.createElement('p');
    balanceText.classList.add('user-card-text');
    if (currentUser != user.id) {
        balanceText.textContent = '';
    } else {
        balanceText.textContent = user.ncoins ? `${user.ncoins} Ncoins` : '';
    }
    col1Balance.appendChild(balanceTitle);
    col1Balance.appendChild(balanceText);
    rowBalance.appendChild(col1Balance);

    const col2Balance = document.createElement('div');
    col2Balance.classList.add('col-md-9');
    const pointsTitle = document.createElement('p');
    pointsTitle.classList.add('card-inner-title');
    pointsTitle.textContent = 'Баланс';
    const pointsText = document.createElement('p');
    pointsText.classList.add('user-card-text');
    if (currentUser != user.id) {
        pointsText.textContent = '';
    } else {
        pointsText.textContent = user.npoints ? `${user.npoints} Npoints` : '';
    }
    col2Balance.appendChild(pointsTitle);
    col2Balance.appendChild(pointsText);
    rowBalance.appendChild(col2Balance);
    cardBody.appendChild(rowBalance);

    card.appendChild(cardBody);

    return card;
}