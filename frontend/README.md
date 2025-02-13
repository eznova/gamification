# Frontend

Frontend, запущенный в nginx

## Запуск

```bash
docker-compose up -d
```

## Проброс в WSL
```bash
netsh interface portproxy set v4tov4 listenport=80 listenaddress=0.0.0.0 connectport=80 connectaddress=172.24.89.80
```