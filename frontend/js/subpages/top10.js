import { loadUserPageContent } from "./userPage.js";

export function loadTop10Content(userId, backendUrl) {
    const content = document.getElementById('content'); // Элемент контента, куда вставим top10.html
    fetch('subpages/top10.html') // Загружаем шаблон
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки шаблона');
            }
            return response.text();
        })
        .then(template => {
            content.innerHTML = template; // Сначала вставляем шаблон в DOM
            const top10List = document.getElementById('top10-list'); // Теперь top10-list доступен

            return Promise.all([
                fetch(`${backendUrl}/users/get/${userId}/rank`).then(res => res.json()), // Получаем данные текущего пользователя
                fetch(`${backendUrl}/users/get/top10`).then(res => res.json()) // Получаем топ-10 пользователей
            ])
                .then(([currentUser, top10]) => {
                    const data = {
                        current_user: currentUser,
                        top10_users: top10.top10_users
                    };

                    // Функция для создания элемента пользователя
                    const createUserRow = (user) => {                        
                        const userDiv = document.createElement('div');
                        userDiv.classList.add('row', 'mb-3', 'p-3', 'rounded-3'); // Белый фон, rounded 20px, отступы
                        userDiv.style.borderWidth = '1px';
                        userDiv.style.borderStyle = 'solid';
                        // Определяем цвет фона в зависимости от ранга
                        if (user.rank === 1) {
                            userDiv.style.backgroundColor = '#F3CB89'; // Цвет для 1 места
                            userDiv.style.borderColor = '#D2AC6F'; // Цвет для 1 места
                        } else if (user.rank === 2) {
                            userDiv.style.backgroundColor = '#A9A9A9'; // Цвет для 2 места
                            userDiv.style.borderColor = '#898989'; // Цвет для 2 места
                        } else if (user.rank === 3) {
                            userDiv.style.backgroundColor = '#FFA286'; // Цвет для 3 места
                            userDiv.style.borderColor = '#BE6145'; // Цвет для 3 места
                        } else {
                            userDiv.style.backgroundColor = '#FFFFFF'; // Белый фон для остальных пользователей
                            userDiv.style.borderColor = '#FFFFFF';
                        }
                         

                        // Создаем 3 колонки с данными
                        const col1 = document.createElement('div');
                        col1.classList.add('col-1');
                        col1.textContent = `${user.rank}`;

                        const col2 = document.createElement('div');
                        col2.classList.add('col-9');

                        // Создаем внутренние элементы для второй колонки
                        const nameDiv = document.createElement('div');
                        nameDiv.classList.add('font-weight-bold');
                        nameDiv.textContent = user.name;

                        const detailsDiv = document.createElement('div');
                        detailsDiv.classList.add('text-muted', 'small');
                        detailsDiv.textContent = `${user.title} | ${user.role} | ${user.department}`;

                        // Добавляем две строки (имя и должность, роль, департамент) в колонку
                        col2.appendChild(nameDiv);
                        
                        col2.addEventListener('mouseover', function() {
                            this.style.cursor = 'pointer'; // меняем курсор на ладошку
                        });
                        col2.addEventListener('click', () => {
                            // alert(`Вы выбрали пользователя с ID: ${user.id}`);
                            loadUserPageContent(user.user_id, backendUrl);
                        })

                        col2.appendChild(detailsDiv);

                        const col3 = document.createElement('div');
                        col3.classList.add('col-2');
                        col3.style.textAlign = 'right';
                        col3.textContent = `${user.npoints} ⭐`;

                        // Добавляем колонки в контейнер пользователя
                        userDiv.appendChild(col1);
                        userDiv.appendChild(col2);
                        userDiv.appendChild(col3);

                        return userDiv;
                    };
                    // Добавляем строку заголовка
                    const myRankHeader = document.createElement('div');
                    myRankHeader.classList.add('row', 'mb-3', 'p-3', 'rounded-3', 'top-header'); // Белый фон, rounded 20px, отступы
                    const col1 = document.createElement('div');
                    col1.classList.add('col-1', 'top-header-element');
                    col1.textContent = `Рейтинг`;

                    const col2 = document.createElement('div');
                    col2.classList.add('col-9', 'top-header-element');
                    col2.textContent = `Сотрудник`;

                    const col3 = document.createElement('div');
                    col3.classList.add('col-2', 'top-header-element');
                    col3.style.textAlign = 'right';
                    col3.textContent = `Баллы`;

                    myRankHeader.appendChild(col1);
                    myRankHeader.appendChild(col2);
                    myRankHeader.appendChild(col3);
                    content.appendChild(myRankHeader);

                    // Добавляем заголовок "Мой ранг"
                    const myRankTitle = document.createElement('h3');
                    myRankTitle.textContent = 'Мой ранг';
                    content.appendChild(myRankTitle);

                    // Добавляем текущего пользователя
                    const currentUserDiv = createUserRow(data.current_user);
                    content.appendChild(currentUserDiv);

                    // Добавляем разделитель
                    const hr = document.createElement('hr');
                    content.appendChild(hr);


                    // Сортируем пользователей по увеличению их rank
                    data.top10_users.sort((a, b) => a.rank - b.rank);

                    // Очищаем текущий список, если он есть
                    top10List.innerHTML = '';

                    // Динамически добавляем пользователей в список
                    data.top10_users.forEach(user => {
                        const userDiv = createUserRow(user);
                        top10List.appendChild(userDiv);
                    });

                    content.appendChild(top10List); // Добавляем список в DOM
                });
        })
        .catch(error => {
            content.innerHTML = `<p class="text-danger">Ошибка: ${error.message}</p>`;
        });
}
