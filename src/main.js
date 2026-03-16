/**
 * Точка входа — управление экранами, игровой цикл.
 * Этот файл загружается ПОСЛЕДНИМ.
 */
(function () {
  // === Управление экранами ===
  function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
    }
    var target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(target, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
      }
    }
  }

  // === Инициализация ===
  function init() {
    // Загрузить прогресс
    Progress.load();

    // Инициализировать SDK
    YandexSDK.init(function () {
      YandexSDK.notifyReady();
    });

    // Показать главное меню
    showScreen('screen-menu');

    // Обработчики кнопок
    var btnPlay = document.getElementById('btn-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', function () {
        startGame();
      });
    }

    var btnRestart = document.getElementById('btn-restart');
    if (btnRestart) {
      btnRestart.addEventListener('click', function () {
        startGame();
      });
    }

    var btnMenu = document.getElementById('btn-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', function () {
        showScreen('screen-menu');
      });
    }
  }

  function startGame() {
    Game.init();
    Render.init('game-canvas');
    showScreen('screen-game');
    // Запусти игровой цикл здесь
  }

  // Запуск при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
