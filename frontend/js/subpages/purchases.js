const backendUrl = localStorage.getItem('backendUrl');

import { reloadMenu } from '../navbar.js';

export function renderPurchasesPage(userId, backendUrl){
    const content = document.getElementById('content');
    fetch('subpages/purchases.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки шаблона');
            }
            return response.text();
        })
        .then(template => {
            content.innerHTML = template;
            const resultContainer = document.getElementById('purchases-content');
            resultContainer.innerHTML = ''; // Очищаем содержимое формы
        });
}