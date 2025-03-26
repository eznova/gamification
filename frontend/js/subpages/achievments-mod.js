const backendUrl = localStorage.getItem('backendUrl');

import { reloadMenu } from '../navbar.js';

function sendAchievementResolution(resolution, achievement) {
    const data = {
        achievement_id: achievement.achievement_id,
        user_id: achievement.user_id,
        sender_id: achievement.sender_id,
        resolution: resolution
    };

    fetch(`${backendUrl}/achievments/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при отправке данных');
        }
        console.log(`${resolution} ачивка с ID: ${achievement.achievement_id}`);
        renderAchievmentsModPage();
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

function createAchievementCard(achievement) {
    console.log(achievement);
    const achievementDiv = document.createElement('div');
    achievementDiv.style.margin = '1em';
    achievementDiv.style.padding = '1em';
    achievementDiv.style.width = '100%';
    achievementDiv.classList.add('achievement');

    const header = document.createElement('div');
    header.classList.add('user-card-text');
    header.style.paddingBottom = '0.5em';
    header.textContent = `Ачивка ID: ${achievement.achievement_id} | ${achievement.achievement_name}`;
    achievementDiv.appendChild(header);

    const weight = document.createElement('div');
    weight.classList.add('card-text');
    weight.textContent = `Вес: ${achievement.achievement_weight}`;
    achievementDiv.appendChild(weight);

    const sender = document.createElement('div');
    sender.classList.add('card-text');
    sender.textContent = `Отправитель ID: ${achievement.sender_id} | ${achievement.sender_name} -> ${achievement.reciever_name}`;
    achievementDiv.appendChild(sender);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '1em';

    const acceptBtn = document.createElement('img');
    acceptBtn.src = "imgs/icons/accept-btn.svg";
    acceptBtn.style.width = '30px';
    acceptBtn.style.height = '30px';
    acceptBtn.style.cursor = 'pointer';
    acceptBtn.addEventListener('click', () => {
        sendAchievementResolution('accepted', achievement);
    });

    const rejectBtn = document.createElement('img');
    rejectBtn.src = "imgs/icons/reject-btn.svg";
    rejectBtn.style.width = '30px';
    rejectBtn.style.height = '30px';
    rejectBtn.style.cursor = 'pointer';
    rejectBtn.style.marginRight = '0.5em';
    rejectBtn.addEventListener('click', () => {
        sendAchievementResolution('rejected', achievement);
    });

    buttonContainer.appendChild(rejectBtn);
    buttonContainer.appendChild(acceptBtn);

    achievementDiv.appendChild(buttonContainer);

    return achievementDiv;
}

import { checkAdmin } from '../rolesController.js';

export async function renderAchievmentsModPage() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    try {
        const check_res = await checkAdmin(); 

        if (!check_res) {
            content.innerHTML = '<p>У вас нет прав для просмотра этой страницы</p>';
            return;
        }

        content.innerHTML = '';
    } catch (error) {
        console.error('Ошибка проверки доступа:', error);
        content.innerHTML = '<p>Ошибка при проверке доступа</p>';
        return;
    }

    fetch('subpages/achievements.html')
        .then(response => response.ok ? response.text() : Promise.reject('Ошибка загрузки шаблона'))
        .then(template => {
            content.innerHTML = template;
            const resultContainer = document.getElementById('achievements-content');
            resultContainer.innerHTML = '';

            fetch(`${backendUrl}/achievments/unverified`)
                .then(response => response.ok ? response.json() : Promise.reject('Ошибка получения данных'))
                .then(achievements => {
                    achievements.forEach(achievement => {
                        const achievementCard = createAchievementCard(achievement);
                        resultContainer.appendChild(achievementCard);
                    });
                })
                .catch(error => {
                    console.error('Ошибка при получении ачивок:', error);
                });
        })
        .catch(error => {
            console.error('Ошибка загрузки шаблона:', error);
        });
}

export async function renderAchievmentsAddPage() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    try {
        const check_res = await checkAdmin(); 

        if (!check_res) {
            content.innerHTML = '<p>У вас нет прав для просмотра этой страницы</p>';
            return;
        }

        content.innerHTML = '';
    } catch (error) {
        console.error('Ошибка проверки доступа:', error);
        content.innerHTML = '<p>Ошибка при проверке доступа</p>';
        return;
    }

    fetch('subpages/achievements.html')
        .then(response => response.ok ? response.text() : Promise.reject('Ошибка загрузки шаблона'))
        .then(template => {
            content.innerHTML = template;
            const resultContainer = document.getElementById('achievements-content');
            resultContainer.innerHTML = '';

            fetch(`${backendUrl}/achievments/unverified`)
                .then(response => response.ok ? response.json() : Promise.reject('Ошибка получения данных'))
                .then(achievements => {
                    achievements.forEach(achievement => {
                        const achievementCard = document.createElement('div');
                        achievementCard.classList.add('card', 'mb-3');
                        achievementCard.innerHTML = 'Здесь будет форма добавления ачивок'
                        resultContainer.appendChild(achievementCard);
                    });
                })
                .catch(error => {
                    console.error('Ошибка при получении ачивок:', error);
                });
        })
        .catch(error => {
            console.error('Ошибка загрузки шаблона:', error);
        });
}
