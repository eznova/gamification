import { loadUserPageContent } from './userPage.js';
import { loadSayThanxForm } from "./sayThanx.js";
export function loadBdaysContent(userId, backendUrl) {
    const content = document.getElementById('content'); // Контейнер для вставки шаблона
    fetch('subpages/birthdays.html') // Загружаем HTML-шаблон
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки шаблона');
            }
            return response.text();
        })
        .then(template => {
            content.innerHTML = template; // Вставляем шаблон в DOM
            const bdaysList = document.getElementById('bdays-list'); // Теперь bdays-list доступен

            return fetch(`${backendUrl}/users/get/bdays/${new Date().getMonth() + 1}`)
                .then(res => res.json())
                .then(bdays => {
                    // console.log("Полученные данные:", bdays);

                    if (!Array.isArray(bdays) || bdays.length === 0) {
                        bdaysList.innerHTML = "<p class='text-muted'>Сегодня нет именинников</p>";
                        return;
                    }

                    // Очистка списка перед вставкой новых данных
                    bdaysList.innerHTML = '';

                    // Функция для создания строки пользователя
                    const createUserRow = (user) => {
                        const userDiv = document.createElement('div');
                        userDiv.classList.add('row', 'mb-2', 'p-2', 'rounded-3');
                        
                        // Первый div для изображения
                        const col1 = document.createElement('div');
                        col1.classList.add('col-1');
                        const img = document.createElement('img');
                        img.setAttribute('width', '30em');
                        img.setAttribute('height', '30em');
                        img.classList.add('rounded-circle');
                        fetch(`${backendUrl}/users/get/${user.user_id}/photo`)
                            .then(res => res.blob())
                            .then(photoBlob => {
                                // Создаем URL для изображения
                                const photoUrl = URL.createObjectURL(photoBlob);
                                img.setAttribute('src', photoUrl);
                            })
                        col1.appendChild(img);
                        userDiv.appendChild(col1);

                        const col2 = document.createElement('div');
                        col2.classList.add('col-4');
                        col2.textContent = `${user.surname} ${user.name} ${user.patronymic || ''}`;
                        col2.addEventListener('mouseover', function() {
                            this.style.cursor = 'pointer'; // меняем курсор на ладошку
                        });
                        col2.addEventListener('click', () => {
                            // alert(`Вы выбрали пользователя с ID: ${user.id}`);
                            loadUserPageContent(user.user_id, backendUrl);  // Вызов функции с передачей user.id
                        });
                        userDiv.appendChild(col2);

                        const col3 = document.createElement('div');
                        col3.classList.add('col-4', 'user-card-text-secondary');
                        col3.textContent = user.department;
                        userDiv.appendChild(col3);

                        const col4 = document.createElement('div');
                        col4.classList.add('col-2', 'row');

                        const day = document.createElement('div');
                        day.classList.add('col-2', 'd-flex', 'justify-content-center', 'align-items-center');
                        day.style.color = '#6A7ADA';
                        day.textContent = user.day.toString().padStart(2, '0');;
                        
                        const slash = document.createElement('div');
                        slash.classList.add('col-1', 'user-card-text-secondary', 'd-flex', 'justify-content-center', 'align-items-center');
                        slash.textContent = '/';
                        
                        const month = document.createElement('div');
                        month.classList.add('col-1', 'user-card-text-secondary', 'd-flex', 'justify-content-center', 'align-items-center');
                        month.textContent = user.month.toString().padStart(2, '0');

                        
                        col4.appendChild(day);
                        col4.appendChild(slash);
                        col4.appendChild(month);
                        userDiv.appendChild(col4);

                        const col5 = document.createElement('div');
                        col5.classList.add('col-1');

                        const thanxImg = document.createElement('img');
                        thanxImg.setAttribute('src', 'imgs/icons/v/hand.svg');
                        thanxImg.setAttribute('width', '30em');
                        thanxImg.setAttribute('height', '30em');
                        thanxImg.style.alignSelf = 'right';
                        thanxImg.addEventListener('mouseover', function() {
                            this.style.cursor = 'pointer';
                        })
                        thanxImg.addEventListener('click', () => {
                                                    // alert(`Вы выбрали пользователя с ID: ${user.id}`);
                                                    loadSayThanxForm(user.user_id, backendUrl);  // Вызов функции с передачей user.id
                                                });

                        col5.appendChild(thanxImg);
                        userDiv.appendChild(col5);

                        return userDiv;
                    };

                    // Создаем строки с пользователями
                    bdays.forEach(user => {
                        const userRow = createUserRow(user);
                        bdaysList.appendChild(userRow);
                    });

                    content.appendChild(bdaysList);
                });
        })
        .catch(error => {
            content.innerHTML = `<p class="text-danger">Ошибка: ${error.message}</p>`;
        });
}
