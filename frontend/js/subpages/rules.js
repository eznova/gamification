import { reloadMenu } from "../navbar.js";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[id^="rule-link-"]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();  // Предотвращаем стандартный переход по ссылке
            const ruleId = event.target.id.replace('rule-link-', '');
            if (typeof reloadMenu === 'function') {
                localStorage.setItem('selectedNav', ruleId);
                console.log(ruleId);
                reloadMenu(ruleId);
            } else {
                console.error('Функция reloadMenu не найдена');
            }
        });
    });
});

export function createRuleRow(rule) {
    const row = document.createElement('div');
    row.classList.add('card');
    
    const ruleText = document.createElement('div');

    if (rule.type === 'rule') {
        const ruleTitle = document.createElement('div');
        ruleTitle.classList.add('user-card-title');
        ruleTitle.textContent = rule.name;
        ruleTitle.style.marginBottom = '1em';
        row.appendChild(ruleTitle);
        ruleText.classList.add('card-text');
    }    
    // row.innerHTML = `<div class="card-ttile" style="font-weight: bold; padding-bottom: 1em">${rule.name}</div>`;
    ruleText.innerHTML = rule.description;
    row.appendChild(ruleText);
    row.style.marginBottom = '2em';
    row.style.padding = '2em';
    row.style.paddingBottom = '1em';
    row.style.paddingTop = '1em';
    return row;
}


export async function loadRulesContent(user_id, backendUrl, signal) {
    const content = document.getElementById('content');
    try {
        const response = await fetch('subpages/rules.html');  // Загружаем шаблон
        if (!response.ok) {
            throw new Error('Ошибка загрузки шаблона');
        }
        const template = await response.text();
        content.innerHTML = template;  // Вставляем шаблон в DOM

        // Добавляем обработчики кликов для ссылок после вставки контента
        setTimeout(() => {
            document.querySelectorAll('[id^="rule-link-"]').forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();  // Предотвращаем переход по ссылке
                    const ruleId = event.target.id.replace('rule-link-', '');
                    if (typeof reloadMenu === 'function') {
                        reloadMenu(ruleId);
                    } else {
                        console.error('Функция reloadMenu не найдена');
                    }
                });
            });
        }, 0);

        fetch(`${backendUrl}/rules`, { signal })
            .then(response => response.json())
            .then(rules => {
                const rulesList = document.getElementById('rules-list');
                rulesList.innerHTML += '<script src="js/navbar.js" type="module"></script>';
                rules.forEach(rule => {
                    // console.log(rule);
                    rulesList.appendChild(createRuleRow(rule));
                });
            })
            .catch(error => {
                console.log('Loading page was interruptedrules:', error);
            });

    } catch (error) {
        console.log('Loading page was interruptedrules:', error);
    }
}
