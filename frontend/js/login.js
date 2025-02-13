
if (window.location.pathname === '/') {
    const backendUrl = localStorage.getItem('backendUrl');
} else {
    localStorage.setItem('backendUrl', `${window.location.protocol}//${window.location.hostname}:5000`);
    const backendUrl = localStorage.getItem('backendUrl');
}


const error_message = (text) => {
    console.log(text);
    const content = document.getElementById('error-message');
    content.innerHTML = '';
    const userDiv = document.createElement('div');
    userDiv.classList.add('row', 'd-flex', 'p-2', 'rounded-3', 'error-message');
    userDiv.style.overflow = 'hidden';
    userDiv.style.boxSizing = 'border-box';
    const col1 = document.createElement('div');

    col1.classList.add('col-2');
    col1.style.textAlign = 'center';
    const img = document.createElement('img');
    img.setAttribute('width', '30em');
    img.setAttribute('height', '30em');
    img.classList.add('rounded-circle');
    img.setAttribute('src', `imgs/icons/w/cross.svg`);
    col1.appendChild(img);
    userDiv.appendChild(col1);

    const col2 = document.createElement('div');
    col2.classList.add('col-10');
    col2.textContent = text;
    userDiv.appendChild(col2);

    content.appendChild(userDiv);
};

// Обработчик для отправки формы
document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Проверка, что нажата кнопка с id = "btn-login"
    const buttonId = event.submitter.id;  // event.submitter возвращает кнопку, которая инициировала событие
    if (buttonId === 'btn-login') {
        const content = document.getElementById('error-message');
        event.preventDefault();

        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        // Подготовка данных для отправки
        const data = {
            login: login,
            password: password
        };

        // Отправка PUT-запроса на /login
        fetch(`${backendUrl}/login`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Проверка на успешный логин
            if (data.login_status === 'success') {
                localStorage.setItem('current_user_id', data.user_id);
                localStorage.setItem('user_id', data.user_id);
                // Перенаправление на страницу account.html
                window.location.href = '/account';
            } else {
                // Обработка ошибок, если логин неуспешен
                error_message('Неверный логин или пароль. Проверьте данные или обратитесь к администратору')
            }
        })
        .catch((error) => {
            error_message('Неверный логин или пароль. Проверьте данные или обратитесь к администратору')
        });
    }
    else if (buttonId === 'btn-register') {
        event.preventDefault();
        console.log('Перенаправление на страницу register.html');
        // Перенаправление на страницу register.html
        window.location.href = '/register';
    }
});

