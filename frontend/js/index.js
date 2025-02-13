localStorage.setItem('backendUrl', `${window.location.protocol}//${window.location.hostname}:5000`);
backendUrl = localStorage.getItem('backendUrl');

function loadCompanyInfo() {
    return fetch(`${backendUrl}/system/get/id`)
        .then(response => response.json())
        .then(data => {
            const company_id = data.company_id;
            const company_name = data.company_name;
            console.log(`Компания ID: ${company_id}, Название: ${company_name}`);
            return { company_id, company_name }; // Возвращаем объект с данными
        })
        .catch(error => {
            console.error('Ошибка при запросе данных:', error);
            return null; // Возвращаем null в случае ошибки
        });
}

document.addEventListener('DOMContentLoaded', async function () {
    let company_id, company_name; // Объявляем переменные заранее
    

    const companyData = await loadCompanyInfo();
    if (companyData) {
        company_id = companyData.company_id;
        company_name = companyData.company_name;
        console.log(`Доступные данные: ID - ${company_id}, Название - ${company_name}`);
    }
    else {
        console.log('Не удалось получить данные компании.');
        const company_id = 'NIIAS';
        const company_name = 'СПбФ АО НИИАС';
    }


    // Контейнер для страницы
    const container = document.createElement('div');
    container.classList.add('container-fluid');
    
    // Строка с двумя колонками
    const row = document.createElement('div');
    row.classList.add('row');

    // Левая часть с изображением
    const leftSide = document.createElement('div');
    leftSide.classList.add('col-12', 'col-md-6', 'left-side');
    row.appendChild(leftSide);

    // Правая часть с формой
    const formContainer = document.createElement('div');
    formContainer.classList.add('col-12', 'col-md-6', 'form-container');
    
    const form = document.createElement('form');
    form.id = 'loginForm';
    
    const formRow = document.createElement('div');
    formRow.classList.add('row');

    // Логотип
    const logoCol = document.createElement('div');
    logoCol.classList.add('col-md-12', 'd-flex', 'justify-content-center', 'align-items-center'); // Для выравнивания
    logoCol.style.padding = '1em';
    const logoImg = document.createElement('img');
    logoImg.src = 'imgs/icons/b/system_logo.svg';
    logoImg.alt = 'Логотип';
    logoCol.appendChild(logoImg);
    
    formRow.appendChild(logoCol);

    form.appendChild(formRow);

    // Карточка с формой
    const card = document.createElement('div');
    card.classList.add('card', 'p-4');
    card.style = 'width: 100%; max-width: 400px;';
    
    const cardHeader = document.createElement('h3');
    cardHeader.classList.add('mb-4', 'text-left');
    cardHeader.textContent = `ВХОД В ${company_id}GAME`;
    card.appendChild(cardHeader);
    
    const subheader = document.createElement('h6');
    subheader.classList.add('mb-4', 'text-left');
    subheader.innerHTML = `Добро пожаловать на портал сотрудника ${company_name}<br>Для начала работы, войдите в систему`;
    card.appendChild(subheader);

    // Логин
    const loginInput = document.createElement('div');
    loginInput.classList.add('mb-3');
    const loginField = document.createElement('input');
    loginField.type = 'text';
    loginField.classList.add('form-control');
    loginField.id = 'login';
    loginField.placeholder = 'Введите логин';
    loginField.required = true;
    loginInput.appendChild(loginField);
    card.appendChild(loginInput);

    // Пароль
    const passwordInput = document.createElement('div');
    passwordInput.classList.add('mb-3');
    const passwordField = document.createElement('input');
    passwordField.type = 'password';
    passwordField.classList.add('form-control');
    passwordField.id = 'password';
    passwordField.placeholder = 'Введите пароль';
    passwordField.required = true;
    passwordInput.appendChild(passwordField);
    card.appendChild(passwordInput);

    // Запомнить меня
    const rememberMe = document.createElement('div');
    rememberMe.classList.add('mb-3', 'form-check');
    const rememberMeCheckbox = document.createElement('input');
    rememberMeCheckbox.type = 'checkbox';
    rememberMeCheckbox.classList.add('form-check-input');
    rememberMeCheckbox.id = 'rememberMe';
    const rememberMeLabel = document.createElement('label');
    rememberMeLabel.classList.add('form-check-label');
    rememberMeLabel.setAttribute('for', 'rememberMe');
    rememberMeLabel.textContent = 'Запомнить меня';
    rememberMe.appendChild(rememberMeCheckbox);
    rememberMe.appendChild(rememberMeLabel);
    card.appendChild(rememberMe);

    // Кнопка "Начать игру"
    const startGameBtn = document.createElement('button');
    startGameBtn.id = 'btn-login';
    startGameBtn.type = 'submit';
    startGameBtn.classList.add('btn', 'w-100');
    startGameBtn.textContent = 'Начать игру';
    card.appendChild(startGameBtn);

    // Кнопка "Регистрация"
    const registerBtn = document.createElement('a');
    registerBtn.id = 'btn-register';
    // registerBtn.type = 'submit';
    registerBtn.classList.add('btn', 'btn-disabled', 'w-100');
    registerBtn.href = '/register';
    registerBtn.textContent = 'Регистрация';
    card.appendChild(registerBtn);

    // Сообщение об ошибке
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    card.appendChild(errorMessage);

    form.appendChild(card);
    formContainer.appendChild(form);
    row.appendChild(formContainer);

    container.appendChild(row);
    document.body.appendChild(container);

    // Добавляем подключение внешних скриптов
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(bootstrapScript);

    const customScript = document.createElement('script');
    customScript.src = 'js/login.js';
    document.body.appendChild(customScript);

});
