
import { selectNavItem } from './navbar.js';
import { loadMenuEvents } from './navbar.js';

const backendUrl = localStorage.getItem('backendUrl');
if (!backendUrl) {
    console.error('backendUrl is not set');
    localStorage.setItem('backendUrl', `${window.location.protocol}//${window.location.hostname}:5000`);
    const backendUrl = localStorage.getItem('backendUrl');
}
const userId = localStorage.getItem('current_user_id');

window.onload = function() {
    const selectedId = localStorage.getItem('selectedNav');
    if (selectedId) {
        selectNavItem(document.getElementById(selectedId));
    } else {
        selectNavItem(document.getElementById('my-page'));
    }
    loadMenuEvents();
};


document.getElementById("btn-exit").addEventListener("click", function() {
    console.log("Выход из аккаунта");
    logout();
});

export function logout() {
    localStorage.clear();
    window.location.href = '/';
}
