# Шаблон игры для Яндекс Игры

Готовый шаблон для быстрого создания браузерных игр под платформу [Яндекс Игры](https://yandex.ru/games/).

## Что внутри

- Готовая структура проекта (HTML + CSS + JS)
- Обёртка Yandex Games SDK с graceful degradation
- Тёмная тема с glassmorphism и неоновыми акцентами
- Система экранов (меню → игра → game over)
- Сохранение прогресса в localStorage
- GSAP для анимаций
- Мобильная адаптация
- Инструкции для AI-ассистентов (CLAUDE.md, .cursor/rules)

## Быстрый старт

```bash
# Клонировать шаблон
git clone https://github.com/lleeeuuuuanchik/yandex-games-template.git my-game
cd my-game

# Запустить локально
python3 -m http.server 8000
# Открыть http://localhost:8000
```

## Структура

```
├── index.html          # Точка входа
├── styles.css          # Стили (glassmorphism + neon)
├── src/
│   ├── config.js       # Константы игры
│   ├── game.js         # Игровая логика
│   ├── render.js       # Canvas отрисовка
│   ├── progress.js     # Сохранение прогресса
│   ├── yandex-sdk.js   # Обёртка Yandex SDK
│   └── main.js         # Точка входа JS
├── assets/             # Графика и звуки
├── CLAUDE.md           # Инструкции для Claude Code
└── .cursor/rules       # Инструкции для Cursor
```

## Использование с AI

Репозиторий содержит подробные инструкции для AI-ассистентов:

- **CLAUDE.md** — для Claude Code / Claude в Cursor
- **.cursor/rules** — Cursor Rules

Опиши AI свою идею игры — он реализует её на базе этого шаблона.

## Выгрузка в Яндекс Игры

1. Собрать ZIP:
   ```bash
   zip -r game.zip index.html styles.css src/ assets/
   ```
2. Загрузить в [консоль разработчика](https://games.yandex.ru/console/)
3. Дождаться модерации (3–5 рабочих дней)

## Стек

- Vanilla JavaScript (без фреймворков и сборщиков)
- HTML5 Canvas
- CSS3 (glassmorphism)
- GSAP 3 + Draggable (CDN)
- Google Fonts (Inter)
- Yandex Games SDK v2
