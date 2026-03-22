(function ()
{
	function showScreen(id)
	{
		var screens = document.querySelectorAll('.screen');
		for (var i = 0; i < screens.length; i++)
			screens[i].classList.remove('is-active');

		var target = document.getElementById(id);
		if (target)
		{
			target.classList.add('is-active');
			if (typeof gsap !== 'undefined')
				gsap.fromTo(target, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
		}
	}

	function updateSoundIcon()
	{
		var btn = document.getElementById('btn-sound');
		if (!btn) return;

		if (SoundManager.isMuted())
		{
			btn.innerHTML = '&#128263;';
			btn.classList.add('is-active');
		}
		else
		{
			btn.innerHTML = '&#128266;';
			btn.classList.remove('is-active');
		}
	}

	// === Привязка кнопок ===

	function bindButton(id, handler)
	{
		var el = document.getElementById(id);
		if (el) el.addEventListener('click', handler);
	}

	function bindButtons()
	{
		bindButton('btn-play', function () { startGame(); });
		bindButton('btn-restart', function () { startGame(); });

		bindButton('btn-menu', function ()
		{
			YandexSDK.gameplayStop();
			showScreen('screen-menu');
		});

		bindButton('btn-pause', function ()
		{
			if (!Game.isGameOver && !Game.isPaused)
			{
				Game.pause();
				showScreen('screen-pause');
			}
		});

		bindButton('btn-resume', function ()
		{
			Game.resume();
			showScreen('screen-game');
		});

		bindButton('btn-pause-menu', function ()
		{
			Game.isPaused = false;
			YandexSDK.gameplayStop();
			showScreen('screen-menu');
		});

		bindButton('btn-sound', function ()
		{
			SoundManager.toggleMute();
			updateSoundIcon();
		});
	}

	// === Платформенные обработчики ===

	function bindPlatformEvents()
	{
		// Обязательно для модерации: звук останавливается при сворачивании
		document.addEventListener('visibilitychange', function ()
		{
			if (document.hidden)
				SoundManager.pauseAll();
			else
				SoundManager.resumeAll();
		});

		document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
		document.addEventListener('selectstart', function (e) { e.preventDefault(); });
		document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

		// Блокировка pull-to-refresh; canvas и модалки могут скроллиться
		document.addEventListener('touchmove', function (e)
		{
			if (!e.target.closest('.game__canvas') && !e.target.closest('.modal'))
				e.preventDefault();
		}, { passive: false });

		// Пауза по Escape или Ctrl
		document.addEventListener('keydown', function (e)
		{
			if (e.key !== 'Escape' && e.key !== 'Control') return;

			var gameScreen = document.getElementById('screen-game');
			var pauseScreen = document.getElementById('screen-pause');

			if (gameScreen && gameScreen.classList.contains('is-active'))
			{
				if (!Game.isGameOver && !Game.isPaused)
				{
					Game.pause();
					showScreen('screen-pause');
				}
				return;
			}

			if (pauseScreen && pauseScreen.classList.contains('is-active'))
			{
				Game.resume();
				showScreen('screen-game');
			}
		});
	}

	// === Жизненный цикл игры ===

	function startGame()
	{
		Game.init();
		Render.init('game-canvas');
		showScreen('screen-game');
		YandexSDK.gameplayStart();
	}

	function endGame()
	{
		Game.isGameOver = true;
		YandexSDK.gameplayStop();

		var finalScore = document.getElementById('final-score');
		if (finalScore) finalScore.textContent = Game.score;

		Progress.updateHighScore(Game.score);
		Progress.set('gamesPlayed', Progress.get('gamesPlayed') + 1);
		showScreen('screen-gameover');
	}

	// === Инициализация ===

	function init()
	{
		Progress.load();

		YandexSDK.init(function ()
		{
			// Язык определён через SDK — применяем переводы
			i18n.apply();
			YandexSDK.notifyReady();
		});

		// Фоллбэк-локализация до ответа SDK
		i18n.apply();
		showScreen('screen-menu');
		bindButtons();
		bindPlatformEvents();
	}

	window.showScreen = showScreen;
	window.startGame = startGame;
	window.endGame = endGame;

	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', init);
	else
		init();
})();
