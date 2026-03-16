/**
 * Конфигурация игры.
 * Все константы, цены, размеры и настройки — здесь.
 * Замени значения под свою игру.
 */
var CONFIG = {
  // Идентификатор игры (используется как ключ localStorage)
  GAME_ID: 'my_yandex_game',

  // Размеры игрового поля
  GRID_COLS: 10,
  GRID_ROWS: 10,
  CELL_SIZE: 36,

  // Очки
  POINTS_PER_ACTION: 10,

  // Монеты
  COINS_PER_LEVEL: 10,

  // Цвета темы
  COLORS: {
    background: '#0a0a1a',
    surface: 'rgba(255, 255, 255, 0.05)',
    primary: '#ff6b9d',
    secondary: '#818cf8',
    accent: '#67e8f9',
    text: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.6)',
  },
};
