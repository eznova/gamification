const backendUrl = localStorage.getItem('backendUrl');
import { checkAdmin } from '../rolesController.js';

export async function loadRolesPageContent() {
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

    const rolesContainer = document.createElement('div');
    rolesContainer.classList.add('row');

    const rolesFormContainer = document.createElement('div');
    rolesFormContainer.classList.add('col-6');

    const roleForm = document.createElement('form');
    roleForm.classList.add('p-3', 'rounded');
    roleForm.setAttribute('id', 'registerForm');
    roleForm.setAttribute('method', 'POST');

    // Выбор пользователя
    const userListSelect = createSelect('user_id', 'Выберите пользователя');

    fetch(`${backendUrl}/users/get/all`)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки пользователей: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            console.log("Полученные пользователи:", data); // Логируем данные
            if (!Array.isArray(data)) throw new Error("Ожидался массив пользователей!");
            populateSelect(userListSelect, data, user => ({
                value: user.id,
                text: `${user.surname} ${user.name} ${user.patronymic || ''}`
            }));
        })
        .catch(error => console.error('Ошибка загрузки пользователей:', error));

    // Блок добавления роли
    const availableRolesSelect = createSelect('role', 'Выбрать роль');
    const addRoleButton = createButton('Добавить роль');

    // Блок удаления роли
    const currentRolesSelect = createSelect('cur_roles', 'Выбрать роль');
    const removeRoleButton = createButton('Удалить роль');

    // Обработчик выбора пользователя
    userListSelect.addEventListener('change', () => {
        const userId = userListSelect.value;
        if (!userId) {
            clearSelect(availableRolesSelect);
            clearSelect(currentRolesSelect);
            return;
        }
        fetchRoles(`${backendUrl}/users/get/${userId}/available_roles`, availableRolesSelect);
        fetchRoles(`${backendUrl}/users/get/${userId}/roles`, currentRolesSelect);
        loadUserCard(userId);
    });

    roleForm.appendChild(userListSelect);
    roleForm.appendChild(createSection('Доступные роли для пользователя', availableRolesSelect, addRoleButton));
    roleForm.appendChild(createSection('Текущие роли для пользователя', currentRolesSelect, removeRoleButton));

    rolesFormContainer.appendChild(roleForm);

    // Добавим вторую колонку
    const rolesListContainer = document.createElement('div');
    rolesListContainer.classList.add('col-6');
    rolesListContainer.id = 'userCard';

    rolesContainer.appendChild(rolesFormContainer);
    rolesContainer.appendChild(rolesListContainer);
    content.appendChild(rolesContainer);

    const codeForm = document.createElement('div');
    codeForm.classList.add('row');
    codeForm.id = 'codeForm';
    codeForm.appendChild(loadCodesForm());
    content.appendChild(codeForm);

    addRoleButton.addEventListener('click', (event) => {
        event.preventDefault();
        manageRole('add', userListSelect.value, availableRolesSelect.value);
    });

    removeRoleButton.addEventListener('click', (event) => {
        event.preventDefault();
        manageRole('remove', userListSelect.value, currentRolesSelect.value);
    });
}

function createSelect(id, placeholder) {
    const select = document.createElement('select');
    select.classList.add('form-control', 'mb-3');
    select.setAttribute('id', id);
    select.appendChild(new Option(placeholder, ''));
    return select;
}

function createButton(text) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'w-100', 'mb-3');
    button.textContent = text;
    return button;
}

function createSection(title, select, button) {
    const section = document.createElement('div');
    const header = document.createElement('h5');
    header.classList.add('fw-bold', 'mt-3');
    header.textContent = title;
    section.appendChild(header);
    section.appendChild(select);
    section.appendChild(button);
    return section;
}

function fetchRoles(url, select) {
    clearSelect(select);
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки ролей: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            console.log(`Роли с ${url}:`, data); // Логируем роли
            if (!Array.isArray(data)) throw new Error("Ожидался массив ролей!");
            populateSelect(select, data, role => ({
                value: role.id,
                text: role.role_name
            }));
        })
        .catch(error => console.error('Ошибка загрузки ролей:', error));
}

function populateSelect(select, data, mapFn) {
    clearSelect(select);
    data.forEach(item => {
        const optionData = mapFn(item);
        if (!optionData || !optionData.text) return;
        select.appendChild(new Option(optionData.text, optionData.value));
    });
}

function clearSelect(select) {
    select.innerHTML = '';
    select.appendChild(new Option(select.options[0]?.text || 'Выбрать', ''));
}

function manageRole(action, userId, roleId) {
    if (!userId || !roleId) return;
    
    fetch(`${backendUrl}/users/${action}/role`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, role_id: roleId }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Ошибка при ${action} роли: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        console.log(`Результат ${action}:`, data);
        if (data.status === 'success') {
            // Сохраняем ID выбранного пользователя
            const selectedUserId = userId;

            // Очищаем форму и пересоздаём её
            loadRolesPageContent();

            // Ожидаем, пока данные пользователей загрузятся
            const waitForUserList = setInterval(() => {
                const userListSelect = document.getElementById('user_id');
                if (userListSelect && userListSelect.options.length > 1) {
                    userListSelect.value = selectedUserId;
                    userListSelect.dispatchEvent(new Event('change')); // Триггерим загрузку ролей
                    clearInterval(waitForUserList);
                }
            }, 100); // Проверяем каждые 100 мс
        }
    })
    .catch(error => console.error(`Ошибка при ${action} роли:`, error));
}

async function loadUserCard(userId) {
    const userCardContainer = document.getElementById('userCard');
    userCardContainer.innerHTML = '';

    if (!userId) return;

    try {
        const response = await fetch(`${backendUrl}/roles/get/${userId}/wallet`);
        if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.statusText}`);

        const data = await response.json();
        console.log("Данные пользователя:", data);

        const userInfo = data.user;
        const roles = data.role || [];

        const card = document.createElement('div');
        card.classList.add('p-3', 'rounded', 'shadow-sm', 'bg-light', 'card');
        card.style.alignItems = 'center';
        card.style.textAlign = 'center';

        const title = document.createElement('div');
        title.classList.add('user-card-title');
        title.textContent = 'Игровая карточка пользователя';
        card.appendChild(title);

        const userInfoBlock = document.createElement('div');
        userInfoBlock.innerHTML = `Telegram ID: <a href="https://t.me/${userInfo.tg_nickname}" target="_blank">@${userInfo.tg_nickname}</a>; User ID: ${userInfo.id}<br>
            ${userInfo.surname} ${userInfo.name} ${userInfo.patronymic || ''}<br>
            ${userInfo.job_title}, ${userInfo.department_name}`;
        userInfoBlock.classList.add('card-text');
        card.appendChild(userInfoBlock);

        const rolesTitle = document.createElement('h5');
        rolesTitle.classList.add('fw-bold', 'mt-3');
        rolesTitle.textContent = 'Роли';
        card.appendChild(rolesTitle);

        roles.forEach(role => {
            const roleItem = document.createElement('div');
            roleItem.classList.add('card-text');
            roleItem.textContent = role.name;
            card.appendChild(roleItem);
        });

        const balanceTitle = document.createElement('h5');
        balanceTitle.classList.add('fw-bold', 'mt-3');
        balanceTitle.textContent = 'Баланс';
        card.appendChild(balanceTitle);

        const table = document.createElement('table');
        table.classList.add('table', 'table-sm', 'table-bordered', 'card-text');

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        headRow.innerHTML = '<th>Поощрение</th><th>Баланс</th>';
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        roles.forEach(role => {
            console.log(role);
            role.wallet.forEach(ach => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${ach.achievement_name}</td><td>${ach.count} / ${ach.max_count}</td>`;
                tbody.appendChild(row);
            });
        });
        table.appendChild(tbody);

        card.appendChild(table);
        userCardContainer.appendChild(card);
    } catch (error) {
        console.error('Ошибка загрузки карточки пользователя:', error);
        userCardContainer.innerHTML = '<p>Не удалось загрузить данные</p>';
    }
}

export function loadCodesForm() {
    const codesForm = document.createElement('div');
    codesForm.style.display = 'block';

    const codeInput = document.createElement('input');
    codeInput.classList.add('form-control', 'mb-3');
    codeInput.setAttribute('id', 'codeInput');
    codeInput.setAttribute('type', 'text');
    codeInput.setAttribute('placeholder', 'Тут будет код');
    codeInput.setAttribute('required', 'false');
    codesForm.appendChild(codeInput);

    const codeButton = document.createElement('button');
    codeButton.classList.add('btn', 'btn-primary', 'w-100', 'mb-3');
    codeButton.textContent = 'Сгенерировать код';
    codesForm.appendChild(codeButton);
    codeInput.value = '';
    try {
        fetch(`${backendUrl}/users/codes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            codeInput.value = data[0].code;
            console.log('Success:', data);
        })
        .catch((error) => {
            codeInput.value = 'Сгенерируйте код, старые закончились';
        });
    } catch (error) {
        codeInput.value = 'Сгенерируйте код, старые закончились';
    }

    codeButton.addEventListener('click', () => {
        const codeInput = document.getElementById('codeInput');
            fetch(`${backendUrl}/users/codes/add`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                codeInput.value = data.code;
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    return codesForm;
}