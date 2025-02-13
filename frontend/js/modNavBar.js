const backendUrl = localStorage.getItem('backendUrl');

import { createMenu } from "./navbar.js";
import { loadMenuEvents } from "./navbar.js";

export function reloadModMenu(selected_item) {
  const navbar = document.getElementById('mod-vertical-navbar');
  // navbar.hidden = false;
  const selectedId = selected_item;
  if (navbar) {
    navbar.innerHTML = ''; // Очищаем текущее меню
    const newMenu = createMenu(menuItems); // Создаём новое меню
    navbar.appendChild(newMenu); // Добавляем в navbar
    selectModNavItem(document.getElementById(selectedId));
  }
  localStorage.setItem('selectedNav', selected_item);
  loadMenuEvents();
}

// Пример данных для создания меню
const menuItems = [
  {
    id: 'mems-mod',
    'data-title': 'Мемы',
    'data-icon-selected': 'imgs/icons/empty.svg',
    'data-icon-default': 'imgs/icons/empty.svg',
    alt: 'Иконка Мемы'
  },
  {
    id: 'quests',
    'data-title': 'Квесты',
    'data-icon-selected': 'imgs/icons/empty.svg',
    'data-icon-default': 'imgs/icons/empty.svg',
    alt: 'Иконка Квесты'
  },
  {
    id: 'achievments-mod',
    'data-title': 'Достижения',
    'data-icon-selected': 'imgs/icons/empty.svg',
    'data-icon-default': 'imgs/icons/empty.svg',
    alt: 'Иконка Достижения'
  },
  {
    id: 'achievments-add',
    'data-title': 'Добавить достижение',
    'data-icon-selected': 'imgs/icons/empty.svg',
    'data-icon-default': 'imgs/icons/empty.svg',
    alt: 'Иконка Достижения'
  },
  {
    id: 'roles',
    'data-title': 'Раздать роли',
    'data-icon-selected': 'imgs/icons/empty.svg',
    'data-icon-default': 'imgs/icons/empty.svg',
    alt: 'Иконка Раздать роли'
  },
  {
    id: 'purchases',
    'data-title': 'Покупки',
    'data-icon-selected': 'imgs/icons/empty.svg',
    'data-icon-default': 'imgs/icons/empty.svg',
    alt: 'Иконка Покупки'
  },
];

// Генерируем меню
const menu = createMenu(menuItems);

// Добавляем меню в контейнер с id="mod-vertical-navbar"
const navbar = document.getElementById('mod-vertical-navbar');
if (navbar) {
  navbar.appendChild(menu);
}

