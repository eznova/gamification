const backendUrl = localStorage.getItem('backendUrl');
import { checkAdmin } from "./rolesController.js";

export function createMenu(items) {
  // Создаем контейнер для меню
  const menuContainer = document.createElement('div');
  menuContainer.classList.add('card', 'mt-5');

  // Проходим по каждому элементу меню
  items.forEach(item => {
    // Создаем div для каждого пункта меню
    const menuItem = document.createElement('div');
    menuItem.classList.add('card-header', 'nav-item', 'd-flex', 'align-items-center');
    menuItem.setAttribute('data-title', item['data-title']);
    menuItem.setAttribute('id', item.id);
    menuItem.setAttribute('data-icon-selected', item['data-icon-selected']);
    menuItem.setAttribute('data-icon-default', item['data-icon-default']);

    // Создаем img элемент для иконки
    const icon = document.createElement('img');
    icon.setAttribute('src', item['data-icon-default']);
    icon.setAttribute('alt', item.alt);
    icon.setAttribute('width', '27');
    icon.setAttribute('height', '28');
    icon.classList.add('nav-icon');

    // Создаем заголовок
    const title = document.createElement('h4');
    title.textContent = item['data-title'];

    // Добавляем иконку и заголовок в пункт меню
    menuItem.appendChild(icon);
    menuItem.appendChild(title);

    // Добавляем пункт меню в контейнер
    menuContainer.appendChild(menuItem);
  });

  return menuContainer;
}

export function loadMenuEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        selectNavItem(item);
        localStorage.setItem('selectedNav', item.id);
    });
  });
}

export function reloadMenu(selected_item) {
  const navbar = document.getElementById('vertical-navbar');
  const selectedId = selected_item;
  if (navbar) {
    navbar.innerHTML = ''; // Очищаем текущее меню
    const newMenu = createMenu(menuItems); // Создаём новое меню
    navbar.appendChild(newMenu); // Добавляем в navbar
    selectNavItem(document.getElementById(selectedId));
  }
  localStorage.setItem('selectedNav', selected_item);
  loadMenuEvents();
}

import { loadUserPageContent } from './subpages/userPage.js';
import { loadTop10Content } from './subpages/top10.js';
import { loadBdaysContent } from './subpages/birthdays.js';
import { loadNewsContent } from './subpages/news.js';
import { loadSayThanxContent } from './subpages/sayThanx.js';
import { loadAchievementsContent } from './subpages/achievements.js';
import { loadTasksContent } from './subpages/tasks.js';
import { loadStoreContent } from './subpages/store.js';
import { loadMemsContent } from './subpages/mems.js';
import { loadRulesContent } from './subpages/rules.js';
import { loadRolesPageContent } from './subpages/roles.js';
import { renderModerationMemsPage } from './subpages/mems.js'
import { renderQuestsPage } from './subpages/quests.js'
import { renderAchievmentsModPage } from './subpages/achievments-mod.js'
import { renderAchievmentsAddPage } from './subpages/achievments-mod.js'
import { renderPurchasesPage } from './subpages/purchases.js'



export function selectNavItem(selectedItem) {
  // console.log(`User ${userId} selected nav item: ${selectedItem.id}`);
  document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('selected');
      const icon = item.querySelector('.nav-icon');
      icon.src = item.dataset.iconDefault;
  });

  selectedItem.classList.add('selected');
  const selectedIcon = selectedItem.querySelector('.nav-icon');
  selectedIcon.src = selectedItem.dataset.iconSelected;

  const content = document.getElementById('content');

  if (selectedItem.id === 'my-page') {
      loadUserPageContent(userId, backendUrl);
  } else if (selectedItem.id === 'top10') {
      loadTop10Content(userId, backendUrl);
  } else if (selectedItem.id === 'bdays') {
      loadBdaysContent(userId, backendUrl);
  } else if (selectedItem.id === 'news') {
      loadNewsContent(userId, backendUrl);
  } else if (selectedItem.id === 'say-thanx') {
      loadSayThanxContent(userId, backendUrl);
  } else if (selectedItem.id === 'my-achievements') {
      loadAchievementsContent(userId, backendUrl);
  } else if (selectedItem.id === 'season-tasks') {
      loadTasksContent(userId, backendUrl);
  } else if (selectedItem.id === 'store') {
      loadStoreContent(userId, backendUrl);
  } else if (selectedItem.id === 'mems') {
      loadMemsContent(userId, backendUrl);
  } else if (selectedItem.id === 'rules') {
      loadRulesContent(userId, backendUrl);
  } else if (selectedItem.id === 'roles') {
      loadRolesPageContent(userId, backendUrl);
  } else if (selectedItem.id === 'mems-mod') {
      renderModerationMemsPage(userId, backendUrl);
  } else if (selectedItem.id === 'quests') {
      renderQuestsPage(userId, backendUrl);
  } else if (selectedItem.id === 'achievments-mod') {
    renderAchievmentsModPage(userId, backendUrl);
  } else if (selectedItem.id === 'achievments-add') {
    renderAchievmentsAddPage(userId, backendUrl);
  } else if (selectedItem.id === 'purchases') {
    renderPurchasesPage(userId, backendUrl);
  } else {
      content.innerHTML = '';
      content.textContent = `Раздел "${selectedItem.dataset.title}" еще в разработке`;
  }
}

// Пример данных для создания меню
const menuItems = [
  {
    id: 'my-page',
    'data-title': 'моя страница',
    'data-icon-selected': 'imgs/icons/w/my_page.svg',
    'data-icon-default': 'imgs/icons/b/my_page.svg',
    alt: 'Иконка моя страница'
  },
  {
    id: 'rules',
    'data-title': 'правила',
    'data-icon-selected': 'imgs/icons/w/rules_icon.svg',
    'data-icon-default': 'imgs/icons/b/rules_icon.svg',
    alt: 'Иконка правила'
  },
  {
    id: 'top10',
    'data-title': 'топ 10',
    'data-icon-selected': 'imgs/icons/w/top10.svg',
    'data-icon-default': 'imgs/icons/b/top10.svg',
    alt: 'Иконка топ 10'
  },
  {
    id: 'store',
    'data-title': 'магазин',
    'data-icon-selected': 'imgs/icons/w/store.svg',
    'data-icon-default': 'imgs/icons/b/store.svg',
    alt: 'Иконка магазин'
  },
  {
    id: 'say-thanx',
    'data-title': 'сказать спасибо',
    'data-icon-selected': 'imgs/icons/w/collegues.svg',
    'data-icon-default': 'imgs/icons/b/collegues.svg',
    alt: 'Иконка сказать спасибо'
  },
  {
    id: 'bdays',
    'data-title': 'дни рождения',
    'data-icon-selected': 'imgs/icons/w/bdays.svg',
    'data-icon-default': 'imgs/icons/b/bdays.svg',
    alt: 'Иконка дни рождения'
  }
  ,
  {
    id: 'season-tasks',
    'data-title': 'сезонные задания',
    'data-icon-selected': 'imgs/icons/w/season.svg',
    'data-icon-default': 'imgs/icons/b/season.svg',
    alt: 'Иконка сезонные задания'
  },
  {
    id: 'my-grade',
    'data-title': 'мой грейд',
    'data-icon-selected': 'imgs/icons/w/grade.svg',
    'data-icon-default': 'imgs/icons/b/grade.svg',
    alt: 'Иконка мой грейд'
  },
  {
    id: 'my-achievements',
    'data-title': 'мои достижения',
    'data-icon-selected': 'imgs/icons/w/achievements.svg',
    'data-icon-default': 'imgs/icons/b/achievements.svg',
    alt: 'Иконка мои достижения'
  },
  {
    id: 'mems',
    'data-title': 'мемы',
    'data-icon-selected': 'imgs/icons/w/mems.svg',
    'data-icon-default': 'imgs/icons/b/mems.svg',
    alt: 'Иконка мемы'
  },
  {
    id: 'news',
    'data-title': 'лента',
    'data-icon-selected': 'imgs/icons/w/news.svg',
    'data-icon-default': 'imgs/icons/b/news.svg',
    alt: 'Иконка лента'
  }
];

// Генерируем меню
const menu = createMenu(menuItems);

// Добавляем меню в контейнер с id="vertical-navbar"
const navbar = document.getElementById('vertical-navbar');
if (navbar) {
  navbar.appendChild(menu);
}

checkAdmin();