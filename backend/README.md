# Backend

API для работы с базой данных.

- PUT ​/login Точка входа для авторизации (put_login)
- GET ​/users​/get​/{user_id}​/details Получить информацию о пользователе, такую как количество монет (ncoins), рейтинг и другие данные
- GET ​/users​/get​/{user_id}​/job_info Получить информацию о должностях и отделах пользователя
- GET ​/users​/get​/{user_id}​/personal Получить личные данные пользователя
- GET ​/users​/get​/{user_id}​/photo Получить фото пользователя в формате base64
- POST ​/users​/upload​/{user_id}​/photo Загрузить фото пользователя в формате base64 и сохранить его в базе данных.

## Запуск

```bash
docker-compose up -d
```

## Проброс в WSL
```bash
netsh interface portproxy set v4tov4 listenport=5000 listenaddress=0.0.0.0 connectport=5000 connectaddress=172.24.89.80
```

## Документация

http://<url>:5000/apidocs

Демо-сервер
 - [Swagger](http://hmsrv.tplinkdns.com:5000/apidocs/)
 - [API](http://hmsrv.tplinkdns.com:5000/)

Тестовые пользователи с индексами от 4 до 6