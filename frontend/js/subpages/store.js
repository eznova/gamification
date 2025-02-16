import { reloadMenu } from "../navbar.js";
const backendUrl = localStorage.getItem('backendUrl');


const storeName = 'NIIAS SHOP';
let cartPrice = 0;
let cart = [];

export async function loadStoreContent(userId, backendUrl) {
    cart = [];
    const content = document.getElementById('content');
    try {
        const response = await fetch('subpages/store.html');  // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template;  // Вставляем шаблон в DOM

        // Заголовок магазина (вне грида)
        const storeTitle = document.createElement('div');
        storeTitle.classList.add('store-title');
        storeTitle.textContent = storeName;
        content.prepend(storeTitle);  // Добавляем заголовок выше контейнера

        // Загружаем товары
        const items = await getStoreItems(userId, backendUrl);
        // console.log(items);
        const storeContainer = document.getElementById('store-content');

        items.forEach(item => {
            storeContainer.appendChild(createStoreCard(userId, item));
        });
        const cartDiv = document.createElement('div');
        cartDiv.classList.add('flex', 'justify-content-between', 'w-100');
        cartDiv.id = 'cart-price';
        cartDiv.classList.add('cart');
        cartDiv.innerHTML = `К оплате: ${cartPrice} NC`;

        // Создаем контейнер для корзины и кнопки
        const cartContainer = document.createElement('div');
        cartContainer.id = 'cart-container';
        cartContainer.classList.add('d-flex', 'justify-content-between', 'w-100');

        // Добавляем элементы в контейнер
        cartContainer.appendChild(cartDiv);

        const cartButton = document.createElement('button');
        cartButton.id = 'cart-button';
        cartButton.classList.add('btn', 'btn-primary', 'mb-3');
        cartButton.textContent = 'Оформить покупку';
        cartButton.hidden = true;
        cartButton.style.whiteSpace = 'nowrap';  // Запрещаем перенос текста внутри кнопки


        // Размещение кнопки и стоимости в одном контейнере
        cartContainer.appendChild(cartButton);

        // Добавление контейнера с корзиной и кнопкой в контент
        content.appendChild(cartContainer);

        cartButton.addEventListener('click', () => {
            console.log(cart);
            buy_cart(cart, userId, backendUrl);
        });

    } catch (error) {
        console.error('Error loading store items:', error);
    }
}

function buy_cart(cart, user_id, backendUrl) {
    return fetch(`${backendUrl}/store/buy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user_id': user_id,
            'cart': cart
        })
    })
    .then(res => res.json())  // Получаем ответ от API в формате JSON
    .then(response => {
        // В зависимости от ответа, вызываем cartBuyResult и передаем нужные данные
        cartBuyResult(response);
    })
    .catch(error => {
        // Обработка ошибок
        console.error('Error during purchase:', error);
    });
}

function getStoreItems(userId, backendUrl) {
    return fetch(`${backendUrl}/store/items`)
        .then(res => res.json())
        .then(items => items)  // Возвращаем задачи в исходной структуре
        .catch(error => {
            console.error('Error:', error);
            return [];  // В случае ошибки возвращаем пустой массив
        });
}

function createStoreCard(user_id, item) {
    const card = document.createElement('div');
    card.className = 'store-card';

    // Контейнер изображения
    const imgContainer = document.createElement('div');
    imgContainer.className = 'store-card-img-container';

    const img = document.createElement('img');
    img.src = `/imgs/store/${item.image}`;
    img.alt = item.name;
    img.className = 'store-card-img';

    imgContainer.appendChild(img);

    // Контейнер текста
    const textContainer = document.createElement('div');
    textContainer.className = 'store-card-text';

    // Название товара
    const title = document.createElement('h3');
    title.textContent = item.name;
    title.className = 'store-card-title';

    // Контейнер для цены и кнопки
    const priceButtonContainer = document.createElement('div');
    priceButtonContainer.className = 'store-card-footer';

    // Цена и иконка звезды
    const priceContainer = document.createElement('div');
    priceContainer.className = 'store-card-price-container';

    const price = document.createElement('span');
    price.textContent = `${item.price}`;
    price.className = 'store-card-price';

    const starIcon = document.createElement('span');
    starIcon.innerHTML = '⭐';
    starIcon.className = 'store-card-star';

    priceContainer.appendChild(price);
    priceContainer.appendChild(starIcon);

    // Кнопка добавления
    const addButton = document.createElement('button');
    addButton.className = 'store-card-button';
    addButton.innerHTML = '+'; // Начальный символ кнопки
    if (item.quantity === 0) {
        addButton.hidden = true;
    }

    // Логика переключения стиля при нажатии
    let isAdded = false;

    addButton.addEventListener('click', () => {
        isAdded = !isAdded;

        if (isAdded) {
            card.classList.add('store-card-active');
            price.classList.add('store-card-price-active');
            title.classList.add('store-card-title-active');
            addButton.classList.add('store-card-button-active');
            addButton.innerHTML = '−';
        } else {
            card.classList.remove('store-card-active');
            price.classList.remove('store-card-price-active');
            title.classList.remove('store-card-title-active');
            addButton.classList.remove('store-card-button-active');
            addButton.innerHTML = '+';
        }

        console.log(`Добавляем товар с ID: ${item.id}`);
        addToCart(item, isAdded, user_id);
    });

    // Собираем контейнер для цены и кнопки
    priceButtonContainer.appendChild(priceContainer);
    priceButtonContainer.appendChild(addButton);

    // Сборка карточки
    textContainer.appendChild(title);
    textContainer.appendChild(priceButtonContainer);

    card.appendChild(imgContainer);
    card.appendChild(textContainer);

    return card;
}

function addToCart(item, isAdded, user_id) {
    const cartButton = document.getElementById('cart-button');
    if (isAdded) {
        console.log(`товар с ID: ${item.id} в корзине`);
        cartPrice += item.price;
        cart.push(item);
        console.log(`цена корзины: ${cartPrice}`);
        const cartDiv = document.getElementById('cart-price');
        cartDiv.innerHTML = `К оплате: ${cartPrice} NC`;
        cartButton.hidden = false;
    }
    else {
        console.log(`товар с ID: ${item.id} удален из корзины`);
        cartPrice -= item.price;
        cart = cart.filter(cartItem => cartItem.id !== item.id);
        console.log(`цена корзины: ${cartPrice}`);
        const cartDiv = document.getElementById('cart-price');
        cartDiv.innerHTML = `К оплате: ${cartPrice} NC`;
        if (cart.length === 0) {
            cartButton.hidden = true;
        }
    }
}


function cartBuyResult(response) {

    
    console.log(response);
    const resultContainer = document.getElementById('store-content');
    resultContainer.id = 'result-container';
    resultContainer.innerHTML = ''; // Очищаем содержимое формы
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('row');

    // Вывести в строку три сердечка imgs/big_heart.svg
    const hearts = document.createElement('div');
    hearts.classList.add('col-12', 'd-flex', 'justify-content-center', 'align-items-center');   
    let emoji = '';
    if (response.success) {
        emoji = 'imgs/big_heart.svg';
    } else {
        emoji = 'imgs/sad_smile.svg';
    }
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('img');
        heart.src = emoji;
        heart.alt = 'Сердечко';
        heart.classList.add('heart');
        heart.style.width = '70px'; // Задаем размер сердечек
        heart.style.margin = '0 5px';
        hearts.appendChild(heart);
    }
    resultDiv.appendChild(hearts);

    const resultText = document.createElement('div');
    resultText.classList.add('col-12', 'text-center', 'mt-3');
    resultText.textContent = `${response.message}`;
    resultDiv.appendChild(resultText);

    
    if (! response.success) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('col-12', 'text-center', 'mt-3');
        console.log(`Недостаточно NCoin'ов: ${response.ncoins} ${cartPrice}`);
        let noMoney = cartPrice - response.ncoins;
        errorDiv.textContent = `Не хватает ${noMoney} NCoin'ов`; // Передаем значение noMoney;
        resultDiv.appendChild(errorDiv);
    } else {
        const resultText2 = document.createElement('div');
        resultText2.classList.add('col-12', 'text-center', 'mt-3', 'user-card-title');
        resultText2.textContent = `Номер заказа: ${response.order_id}`;
        resultDiv.appendChild(resultText2);
    }
    const cartDiv = document.createElement('div');
    const responseCart = response.cart;
    responseCart.forEach(item => {  // Правильный вызов forEach для массива
        const cartItem = document.createElement('div');
        cartItem.classList.add('col-12', 'text-center', 'mt-3', 'card-text');
        cartItem.textContent = `${item.name} - ${item.price} NC`;
        cartDiv.appendChild(cartItem);
    });

    resultDiv.appendChild(cartDiv);
    if ( response.success) {
        const resultText3 = document.createElement('div');
        resultText3.classList.add('col-12', 'text-center', 'mt-3');
        resultText3.textContent = 'Назовите номер заказа в кабинете HR, чтобы забрать покупку';
        resultDiv.appendChild(resultText3);
    }
    resultContainer.appendChild(resultDiv);

    // Добавляем две кнопки посередине страницы
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-4');
    let menuId;
    const myPageButton = document.createElement('button');
    if (response.success) {
        myPageButton.textContent = 'К МОЕЙ СТРАНИЦЕ';
        menuId = 'my-page';
    } else {
        myPageButton.textContent = 'КАК ЗАРАБОТАТЬ';
        menuId = 'rules';
    }
    myPageButton.classList.add('btn', 'btn-gray', 'mx-2');
    myPageButton.addEventListener('click', () => {
        reloadMenu(menuId);
    });
    buttonsDiv.appendChild(myPageButton);

    const anotherButton = document.createElement('button');
    anotherButton.textContent = 'В МАГАЗИН';
    anotherButton.classList.add('btn', 'btn-gray', 'mx-2');
    anotherButton.addEventListener('click', () => {
        reloadMenu('store');
    });
    buttonsDiv.appendChild(anotherButton);

    resultContainer.appendChild(buttonsDiv);
    cartPrice = 0;
    cart = [];
}
