import { loadUserPageContent } from "./userPage.js";

export async function loadTop10Content(userId, backendUrl, signal) {
    const content = document.getElementById('content'); // Контейнер для вставки контента
    try {
        const response = await fetch('subpages/top10.html'); // Загружаем шаблон
        if (!response.ok) throw new Error('Ошибка загрузки шаблона');
        const template = await response.text();
        content.innerHTML = template; // Вставляем шаблон в DOM

        const top10List = document.getElementById('top10-list'); // Контейнер списка

        // Получаем данные о пользователе и топ-10
        const [currentUser, top10] = await Promise.all([
            fetch(`${backendUrl}/users/get/${userId}/rank`, { signal }).then(res => res.json()),
            fetch(`${backendUrl}/users/get/top10`, { signal }).then(res => res.json())
        ]);

        const data = {
            current_user: currentUser,
            top10_users: top10.top10_users
        };

        // Функция создания элемента пользователя
        const createUserRow = (user) => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('row', 'mb-3', 'p-3', 'rounded-3');
            userDiv.style.borderWidth = '1px';
            userDiv.style.borderStyle = 'solid';

            if (user.rank === 1) {
                userDiv.style.backgroundColor = '#F3CB89';
                userDiv.style.borderColor = '#D2AC6F';
            } else if (user.rank === 2) {
                userDiv.style.backgroundColor = '#A9A9A9';
                userDiv.style.borderColor = '#898989';
            } else if (user.rank === 3) {
                userDiv.style.backgroundColor = '#FFA286';
                userDiv.style.borderColor = '#BE6145';
            } else {
                userDiv.style.backgroundColor = '#FFFFFF';
                userDiv.style.borderColor = '#FFFFFF';
            }

            const col1 = document.createElement('div');
            col1.classList.add('col-1');
            col1.textContent = `${user.rank}`;

            const col2 = document.createElement('div');
            col2.classList.add('col-9');
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('font-weight-bold');
            nameDiv.textContent = user.name;
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('text-muted', 'small');
            detailsDiv.textContent = `${user.title} | ${user.role} | ${user.department}`;

            col2.appendChild(nameDiv);
            col2.appendChild(detailsDiv);
            col2.addEventListener('click', () => loadUserPageContent(user.user_id, backendUrl));

            const col3 = document.createElement('div');
            col3.classList.add('col-2');
            col3.style.textAlign = 'right';
            col3.textContent = `${user.npoints} ⭐`;

            userDiv.appendChild(col1);
            userDiv.appendChild(col2);
            userDiv.appendChild(col3);
            return userDiv;
        };

        // Заголовок "Мой ранг"
        const myRankTitle = document.createElement('h3');
        myRankTitle.textContent = 'Мой ранг';
        content.appendChild(myRankTitle);

        // Добавляем текущего пользователя
        content.appendChild(createUserRow(data.current_user));

        // Разделитель
        content.appendChild(document.createElement('hr'));

        // Сортируем пользователей по рангу и добавляем в список
        data.top10_users.sort((a, b) => a.rank - b.rank);
        top10List.innerHTML = ''; // Очищаем список

        data.top10_users.forEach(user => {
            top10List.appendChild(createUserRow(user));
        });

        content.appendChild(top10List);
    } catch (error) {
        content.innerHTML = `<p class="text-danger">Ошибка: ${error.message}</p>`;
        console.error('Ошибка загрузки топ-10:', error);
    }
}
