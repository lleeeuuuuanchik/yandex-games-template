/**
 * Локализация.
 * Все переводимые тексты — здесь. Элементы с атрибутом data-i18n="ключ"
 * переводятся автоматически при вызове i18n.apply().
 *
 * Добавление нового языка: добавь объект в _texts и маппинг в _map.
 * Добавление нового текста: добавь ключ во все языки и data-i18n в HTML.
 */
var i18n =
{
	_lang: 'ru',

	// Маппинг кодов SDK/браузера → поддерживаемый язык
	_map:
	{
		ru: 'ru', be: 'ru', kk: 'ru', uk: 'ru', uz: 'ru',
		en: 'en', tr: 'en', de: 'en', fr: 'en', es: 'en',
		pt: 'en', it: 'en', ar: 'en', he: 'en', ja: 'en',
		ko: 'en', zh: 'en',
	},

	_texts:
	{
		ru:
		{
			'game.title':       'Моя игра',
			'game.description': 'Описание игры',
			'btn.play':         'Играть',
			'btn.pause':        'Пауза',
			'btn.resume':       'Продолжить',
			'btn.menu':         'Меню',
			'btn.restart':      'Заново',
			'game-over.title':  'Игра окончена',
			'score.label':      'Очки',
			'score.result':     'Очки:',
		},
		en:
		{
			'game.title':       'My Game',
			'game.description': 'Game description',
			'btn.play':         'Play',
			'btn.pause':        'Pause',
			'btn.resume':       'Resume',
			'btn.menu':         'Menu',
			'btn.restart':      'Restart',
			'game-over.title':  'Game Over',
			'score.label':      'Score',
			'score.result':     'Score:',
		},
	},

	/**
	 * Установить язык по коду SDK или браузера ('ru', 'en', 'tr', ...).
	 * Если точного перевода нет — маппится через _map.
	 * @param {string} code
	 */
	setLang: function (code)
	{
		this._lang = this._map[code] || 'en';
		document.documentElement.lang = this._lang;
	},

	/**
	 * Определить язык из браузера (фоллбэк когда SDK недоступен).
	 */
	detectFromBrowser: function ()
	{
		try
		{
			var code = (navigator.language || 'ru').split('-')[0];
			this.setLang(code);
		}
		catch (e) { this._lang = 'ru'; }
	},

	/**
	 * Получить перевод по ключу. Фоллбэк: ru → сам ключ.
	 * @param {string} key
	 * @returns {string}
	 */
	t: function (key)
	{
		var dict = this._texts[this._lang] || this._texts['ru'] || {};
		return dict[key] || (this._texts['ru'] && this._texts['ru'][key]) || key;
	},

	/**
	 * Текущий язык.
	 * @returns {string}
	 */
	lang: function ()
	{
		return this._lang;
	},

	/**
	 * Применить переводы ко всем элементам с data-i18n.
	 * Атрибут data-i18n-attr задаёт целевой атрибут (по умолчанию textContent).
	 * Пример: <span data-i18n="score.label"></span>
	 * Пример: <button data-i18n="btn.play" data-i18n-attr="aria-label"></button>
	 */
	apply: function ()
	{
		var els = document.querySelectorAll('[data-i18n]');
		for (var i = 0; i < els.length; i++)
		{
			var el = els[i];
			var key = el.getAttribute('data-i18n');
			var attr = el.getAttribute('data-i18n-attr');
			var text = this.t(key);

			if (attr)
				el.setAttribute(attr, text);
			else
				el.textContent = text;
		}

		document.title = this.t('game.title');
	},
};
