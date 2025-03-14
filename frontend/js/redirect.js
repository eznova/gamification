const userId = localStorage.getItem('current_user_id');
const params = new URLSearchParams(window.location.search);
const navItem = params.get('navItem');

console.log("Redirecting")

if (userId && window.location.pathname === '/') {
  console.log("Redirecting")
  // Логирование параметра navItem, если он присутствует
  window.location.href = '/account';
} else if (!userId && window.location.pathname === '/account') {
  window.location.href = '/';
} else if (userId && window.location.pathname === '/account' && navItem) {
  console.log(`Request for ${navItem} page`);
  localStorage.setItem('selectedNav', navItem)
  window.location.href = '/account';
}
  