# PRIBEGA Website

## Deployment on Railway

### Шаг 1: Сохраните в GitHub
Нажмите "Save to GitHub" в Emergent

### Шаг 2: Создайте проект на Railway
1. Зайдите на [Railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Выберите ваш репозиторий

### Шаг 3: Добавьте MongoDB
1. В проекте нажмите "+ New" → "Database" → "MongoDB"
2. Railway автоматически создаст базу данных

### Шаг 4: Настройте переменные
В настройках вашего сервиса (Variables):
- `DB_NAME` = `pribega`
- `MONGO_URL` будет добавлен автоматически от MongoDB

### Шаг 5: Сборка фронтенда
Railway автоматически запустит сборку. Если нет, добавьте build command:
```
cd frontend && yarn install && yarn build
```

---

## Админ-панель
- URL: `ваш-домен.railway.app/admin`
- Логин: `Admin`
- Пароль: `Admin`

## Как менять фото
1. Зайдите в админку `/admin`
2. Вкладка "ФОТО"
3. Нажмите на фото → выберите новое с компьютера
4. Готово!

## Telegram уведомления
1. Админка → Настройки
2. Введите Chat ID вашего канала
3. Нажмите "Тест" для проверки

---

## Структура проекта
```
├── backend/           # FastAPI сервер
│   ├── server.py      # Главный API файл
│   ├── uploads/       # Загруженные фото
│   └── requirements.txt
├── frontend/          # React приложение
│   ├── src/
│   └── build/         # Готовая сборка
├── railway.json       # Конфиг Railway
└── Procfile
```
