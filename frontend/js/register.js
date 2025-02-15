const backendUrl = localStorage.getItem('backendUrl');

document.addEventListener('DOMContentLoaded', function () {
    // Контейнер для страницы
    const container = document.createElement('div');
    container.classList.add('container-fluid', 'position-relative'); // Добавляем relative для позиционирования

    // Строка с двумя колонками
    const row = document.createElement('div');
    row.classList.add('row', 'min-vh-100', 'd-flex', 'position-relative'); // Добавляем relative для row
    
    // Левая часть с изображением
    const background = document.createElement('div');
    background.classList.add('col-12', 'full-background', 'position-absolute', 'top-0', 'bottom-0', 'start-0', 'end-0');
    row.appendChild(background);

    // центральная часть с формой
    const center = document.createElement('div');
    center.classList.add('col-12', 'd-flex', 'justify-content-center', 'align-items-center', 'position-relative');
    row.appendChild(center);

    // Форма регистрации
    const form = document.createElement('form');
    form.classList.add('mb-3', 'p-3', 'rounded', 'register-form-container');
    form.setAttribute('id', 'registerForm');
    form.setAttribute('method', 'POST');
    form.setAttribute('enctype', 'multipart/form-data');
    center.appendChild(form);

    // Заголовок формы
    const h1 = document.createElement('h4');
    h1.classList.add('h4', 'mb-3', 'fw-normal');
    h1.textContent = 'РЕГИСТРАЦИЯ';
    h1.style.textAlign = 'center';
    form.appendChild(h1);

    const h2 = document.createElement('p');
    h2.classList.add('p', 'mb-3', 'fw-normal', 'form-labels');
    h2.textContent = 'Пожалуйста, предоставьте информацию о себе, чтобы начать игру';
    form.appendChild(h2);

    const h3 = document.createElement('hr');
    h3.classList.add('mb-3');
    form.appendChild(h3);

    const aboutYou = document.createElement('h4');
    aboutYou.classList.add('h4', 'mb-3', 'fw-normal');
    aboutYou.textContent = 'О СЕБЕ';
    aboutYou.style.textAlign = 'left';
    form.appendChild(aboutYou);

    // Вынесенная функция для создания input с label
    function createInputWithLabel(id, labelText, secondaryText, placeholder, type) {
        if (!type) {
            type = 'text';
        }
        const codeField = document.createElement('input');
        codeField.classList.add('form-control', 'mb-3');
        codeField.setAttribute('required', 'false');
        codeField.setAttribute('type', 'text');
        codeField.setAttribute('name', id);
        codeField.setAttribute('id', id);  // Добавляем id
        codeField.setAttribute('placeholder', placeholder); 
        codeField.setAttribute('type', type);

        const codeLabel = document.createElement('label');
        codeLabel.setAttribute('for', id); // Связываем label с полем через id

        const firstLine = document.createElement('span');
        firstLine.textContent = labelText;
        firstLine.classList.add('form-labels');
        const secondLine = document.createElement('span');
        secondLine.textContent = secondaryText;
        secondLine.classList.add('card-text-secondary', 'form-labels'); // Применяем стиль для второй строки

        // Добавляем оба span в label
        codeLabel.appendChild(firstLine);
        codeLabel.appendChild(document.createElement('br')); // Разрыв строки между ними
        codeLabel.appendChild(secondLine);

        return { codeField, codeLabel };
    }

    function createSelectWithLabel(id, labelText, secondaryText, placeholder) {

        const codeField = document.createElement('select');
        fetch(`${backendUrl}/users/get/departments`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.department_name;
                codeField.appendChild(option);
            });
        })
        codeField.classList.add('form-control', 'mb-3');
        codeField.setAttribute('required', 'true');
        codeField.setAttribute('type', 'text');
        codeField.setAttribute('name', id);
        codeField.setAttribute('id', id);  // Добавляем id
        codeField.setAttribute('placeholder', placeholder);

        const codeLabel = document.createElement('label');
        codeLabel.setAttribute('for', id); // Связываем label с полем через id

        const firstLine = document.createElement('span');
        firstLine.textContent = labelText;
        firstLine.classList.add('form-labels');
        const secondLine = document.createElement('span');
        secondLine.textContent = secondaryText;
        secondLine.classList.add('card-text-secondary', 'form-labels'); // Применяем стиль для второй строки

        // Добавляем оба span в label
        codeLabel.appendChild(firstLine);
        codeLabel.appendChild(document.createElement('br')); // Разрыв строки между ними
        codeLabel.appendChild(secondLine);

        return { codeField, codeLabel };
    }

    // #####################################################################################################
    // Генерация полей с использованием функции
    const { codeField: codeField1, codeLabel: codeLabel1 } = createInputWithLabel(
        'code', 
        'Код регистрации*', 
        'Получите код регистрации у HR', 
        'введите код',
        'password'
    );

    const { codeField: surnameField, codeLabel: surnameLabel } = createInputWithLabel(
        'surname', 
        'Фамилия*', 
        '', 
        'введите вашу фамилию'
    );

    const { codeField: nameField, codeLabel: nameLabel } = createInputWithLabel(
        'name', 
        'Имя*',
        '',
        'введите ваше имя'
    );

    const { codeField: patronymicField, codeLabel: patronymicLabel } = createInputWithLabel(
        'patronymic', 
        'Отчество', 
        '',
        'введите ваше отчество'
    );

    const dateField = document.createElement('input');
    dateField.classList.add('form-control', 'mb-3');
    dateField.setAttribute('type', 'date');
    dateField.setAttribute('name', 'birthdate');
    dateField.setAttribute('id', 'birthdate');
    dateField.setAttribute('placeholder', 'введите дату рождения');

    // Ограничиваем выбор дат (пользователь не может выбрать будущее)
    const today = new Date().toISOString().split('T')[0]; 
    dateField.setAttribute('max', today);

    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', 'birthdate');

    const firstLine = document.createElement('span');
    firstLine.textContent = 'Дата рождения*';
    firstLine.classList.add('form-labels');

    const secondLine = document.createElement('span');
    secondLine.textContent = '';
    secondLine.classList.add('card-text-secondary', 'form-labels');

    dateLabel.appendChild(firstLine);
    dateLabel.appendChild(document.createElement('br'));
    dateLabel.appendChild(secondLine);


    const { codeField: hobbiesField, codeLabel: hobbiesLabel } = createInputWithLabel(
        'hobbies', 
        'Увлечения', 
        'Пожалуйста, напишите о своих увлечениях, чтобы найти коллег по интересам', 
        'введите увлечения'
    );

    // Добавляем созданные элементы в форму
    form.appendChild(codeLabel1);
    form.appendChild(codeField1);

    form.appendChild(surnameLabel);
    form.appendChild(surnameField);

    form.appendChild(nameLabel);
    form.appendChild(nameField);

    form.appendChild(patronymicLabel);
    form.appendChild(patronymicField);

    form.appendChild(dateLabel);
    form.appendChild(dateField);

    form.appendChild(hobbiesLabel);
    form.appendChild(hobbiesField);
    // #####################################################################################################
    // Разделитель
    const hr = document.createElement('hr');
    hr.classList.add('mb-3');
    form.appendChild(hr);

    const aboutJob = document.createElement('h4');
    aboutJob.classList.add('h4', 'mb-3', 'fw-normal');
    aboutJob.textContent = 'О РАБОТЕ';
    aboutJob.style.textAlign = 'left';
    form.appendChild(aboutJob);

    const { codeField: jobTitleField, codeLabel: jobTitleLabel } = createInputWithLabel(
        'jobTitle', 
        'Ваша должность*', 
        '', 
        'введите вашу должность'
    );
    // ваша роль
    const { codeField: roleField, codeLabel: roleLabel } = createInputWithLabel(
        'role', 
        'Ваша роль*', 
        '', 
        'введите вашу роль'
    );
    // ваша компания
    const { codeField: departmentField, codeLabel: departmentLabel } = createSelectWithLabel(
        'department', 
        'Подразделение*', 
        'Пожалуйста, выберите фактическое подразделение, где вы работаете', 
        'выберите подразделение'
    );

    // Дата начала работы
    const jobStartField = document.createElement('input');
    jobStartField.classList.add('form-control', 'mb-3');
    jobStartField.setAttribute('type', 'date');
    jobStartField.setAttribute('name', 'jobStartDate');
    jobStartField.setAttribute('id', 'jobStartDate');
    jobStartField.setAttribute('placeholder', 'введите день начала работы');

    // Ограничиваем выбор дат (пользователь не может выбрать будущее)
    const jobToday = new Date().toISOString().split('T')[0]; 
    jobStartField.setAttribute('max', jobToday);

    const jobStartLabel = document.createElement('label');
    jobStartLabel.setAttribute('for', 'jobStartDate');

    const jobFirstLine = document.createElement('span');
    jobFirstLine.textContent = 'День начала работы*';
    jobFirstLine.classList.add('form-labels');

    const jobSecondLine = document.createElement('span');
    jobSecondLine.textContent = '';
    jobSecondLine.classList.add('card-text-secondary', 'form-labels');

    jobStartLabel.appendChild(jobFirstLine);
    jobStartLabel.appendChild(document.createElement('br'));
    jobStartLabel.appendChild(jobSecondLine);

    // Проекты
    const { codeField: projectsField, codeLabel: projectsLabel } = createInputWithLabel(
        'projects', 
        'Проекты', 
        'Напишите аббревиатуры проектов, в которых участвуете, через запятую “,”', 
        'введите проекты'
    );

    // Добавляем созданные элементы в форму
    form.appendChild(jobTitleLabel);
    form.appendChild(jobTitleField);

    form.appendChild(roleLabel);
    form.appendChild(roleField);

    form.appendChild(departmentLabel);
    form.appendChild(departmentField);

    form.appendChild(jobStartLabel);
    form.appendChild(jobStartField);

    form.appendChild(projectsLabel);   
    form.appendChild(projectsField);

    // #####################################################################################################
    // Разделитель
    const hr2 = document.createElement('hr');
    hr2.classList.add('mb-3');
    form.appendChild(hr2);

    const contacts = document.createElement('h4');
    contacts.classList.add('h4', 'mb-3', 'fw-normal');
    contacts.textContent = 'КОНТАКТЫ';
    contacts.style.textAlign = 'left';
    form.appendChild(contacts);

    // Телеграм
    const { codeField: telegramField, codeLabel: telegramLabel } = createInputWithLabel(
        'telegram', 
        'Telegram-ник*', 
        '', 
        'введите telegram-ник'
    );

    // номер телефона
    const { codeField: phoneField, codeLabel: phoneLabel } = createInputWithLabel(
        'phone', 
        'Номер телефона', 
        '', 
        'введите номер телефона'
    );

    // Добавляем созданные элементы в форму
    form.appendChild(telegramLabel);
    form.appendChild(telegramField);   

    form.appendChild(phoneLabel);
    form.appendChild(phoneField);

    // #####################################################################################################
    // Разделитель
    const hr3 = document.createElement('hr');
    hr3.classList.add('mb-3');
    form.appendChild(hr3);

    const authData = document.createElement('h4');
    authData.classList.add('h4', 'mb-3', 'fw-normal');
    authData.textContent = 'АВТОРИЗАЦИЯ';
    authData.style.textAlign = 'left';
    form.appendChild(authData);

    // Логин jira
    const { codeField: jiraLoginField, codeLabel: jiraLoginLabel } = createInputWithLabel(
        'jiraLogin', 
        'Логин Jira*', 
        '', 
        'введите логин Jira'
    );

    // Придумаем пароль
    const { codeField: passwordField, codeLabel: passwordLabel } = createInputWithLabel(
        'password', 
        'Придумайте пароль*', 
        '', 
        'введите пароль',
        'password'
    );

    // Подтверждение пароля
    const { codeField: confirmPasswordField, codeLabel: confirmPasswordLabel } = createInputWithLabel(
        'confirmPassword', 
        'Повторите пароль*', 
        '', 
        'введите пароль',
        'password'
    );

    // Добавляем созданные элементы в форму
    form.appendChild(jiraLoginLabel);
    form.appendChild(jiraLoginField);

    form.appendChild(passwordLabel);
    form.appendChild(passwordField);

    form.appendChild(confirmPasswordLabel);
    form.appendChild(confirmPasswordField);

    // Поле для отправки формы
    const submitButton = document.createElement('button');
    submitButton.classList.add('btn', 'btn-primary', 'w-100');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Зарегистрироваться';
    form.appendChild(submitButton);

    row.appendChild(center);
    container.appendChild(row);

    // Контейнер для кнопки выхода
    const exitButtonContainer = document.createElement('div');
    exitButtonContainer.classList.add('position-absolute', 'top-0', 'end-0', 'p-3');

    // Создание кнопки выхода
    const exitButton = document.createElement('button');
    exitButton.setAttribute('id', 'btn-exit');
    exitButton.classList.add('btn', 'btn-outline-light');

    // Создание изображения внутри кнопки
    const exitIcon = document.createElement('img');
    exitIcon.setAttribute('src', 'imgs/icons/w/exit.svg');
    exitIcon.setAttribute('alt', 'Выход');

    // Добавление изображения в кнопку
    exitButton.appendChild(exitIcon);

    // Добавление кнопки в контейнер
    exitButtonContainer.appendChild(exitButton);

    // Добавление контейнера с кнопкой в основной контейнер страницы
    container.appendChild(exitButtonContainer);

    // Обработчик клика для редиректа на "/"
    exitButton.addEventListener('click', function () {
        window.location.href = '/';
    });

    document.body.appendChild(container);

    // Добавляем подключение внешних скриптов
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(bootstrapScript);

    const customScript = document.createElement('script');
    customScript.src = 'js/login.js';
    document.body.appendChild(customScript);
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартную отправку формы

        // Собираем данные формы
        const formData = new FormData(form);
        const jsonData = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        console.log(jsonData);

        // Отправляем JSON на сервер
        fetch(`${backendUrl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Успех:', data);
            alert('Регистрация успешна!');
            window.location.href = '/'; // Перенаправление при успешной регистрации
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка регистрации!');
        });
    });
});
