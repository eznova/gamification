const userId = localStorage.getItem('current_user_id');

if (userId && window.location.pathname === '/') {
  window.location.href = '/account';
}
else if (!userId && window.location.pathname === '/account') {
  window.location.href = '/';
}