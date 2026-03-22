/**
 * Обёртка Yandex Games SDK v2.
 * Graceful degradation — без SDK игра работает, реклама пропускается.
 */
var YandexSDK =
{
	ysdk: null,
	_ready: false,
	_pendingNotifyReady: false,

	/**
	 * @param {function} [cb] — cb(true) если SDK загружен, cb(false) если нет
	 */
	init: function (cb)
	{
		var self = this;

		if (typeof YaGames === 'undefined')
		{
			i18n.detectFromBrowser();
			if (cb) cb(false);
			return;
		}

		YaGames.init()
			.then(function (ysdk)
			{
				self.ysdk = ysdk;
				self._ready = true;

				try { i18n.setLang(ysdk.environment.i18n.lang || 'ru'); }
				catch (e) { i18n.setLang('ru'); }

				if (cb) cb(true);
				if (self._pendingNotifyReady) self.notifyReady();
			})
			.catch(function ()
			{
				i18n.detectFromBrowser();
				if (cb) cb(false);
			});
	},

	/**
	 * Сообщить платформе о готовности (обязательно для модерации).
	 */
	notifyReady: function ()
	{
		if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI)
			this.ysdk.features.LoadingAPI.ready();
		else
			this._pendingNotifyReady = true;
	},

	gameplayStart: function ()
	{
		if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI)
			this.ysdk.features.GameplayAPI.start();
	},

	gameplayStop: function ()
	{
		if (this.ysdk && this.ysdk.features && this.ysdk.features.GameplayAPI)
			this.ysdk.features.GameplayAPI.stop();
	},

	/**
	 * Rewarded-реклама. Ставит звук и геймплей на паузу автоматически.
	 * @param {function} onSuccess — после полного просмотра
	 * @param {function} [onError]
	 */
	showRewarded: function (onSuccess, onError)
	{
		if (!this.ysdk)
		{
			if (onError) onError();
			return;
		}

		var self = this;
		this.ysdk.adv.showRewardedVideo(
		{
			callbacks:
			{
				onOpen: function ()
				{
					SoundManager.pauseAll();
					self.gameplayStop();
				},
				onRewarded: function ()
				{
					if (onSuccess) onSuccess();
				},
				onClose: function ()
				{
					SoundManager.resumeAll();
					self.gameplayStart();
				},
				onError: function ()
				{
					SoundManager.resumeAll();
					self.gameplayStart();
					if (onError) onError();
				},
			},
		});
	},

	/**
	 * Межстраничная реклама. Показывать в логических паузах.
	 * @param {function} [onClose]
	 */
	showInterstitial: function (onClose)
	{
		if (!this.ysdk)
		{
			if (onClose) onClose();
			return;
		}

		var self = this;
		this.ysdk.adv.showFullscreenAdv(
		{
			callbacks:
			{
				onOpen: function ()
				{
					SoundManager.pauseAll();
					self.gameplayStop();
				},
				onClose: function ()
				{
					SoundManager.resumeAll();
					self.gameplayStart();
					if (onClose) onClose();
				},
				onError: function ()
				{
					SoundManager.resumeAll();
					self.gameplayStart();
					if (onClose) onClose();
				},
			},
		});
	},
};

/**
 * Централизованное управление звуком.
 * Все Audio-объекты регистрируются через register() для автоматической
 * паузы при рекламе и сворачивании вкладки.
 */
var SoundManager =
{
	_muted: false,
	_pausedBySystem: false,
	_audioElements: [],

	/**
	 * @returns {boolean} — true если звук выключен
	 */
	toggleMute: function ()
	{
		this._muted = !this._muted;
		CONFIG.SOUND_ENABLED = !this._muted;

		if (this._muted)
			this._muteAll();
		else
			this._unmuteAll();

		return this._muted;
	},

	isMuted: function ()
	{
		return this._muted;
	},

	pauseAll: function ()
	{
		this._pausedBySystem = true;
		for (var i = 0; i < this._audioElements.length; i++)
			try { this._audioElements[i].pause(); } catch (e) {}
	},

	/**
	 * Возобновление после системной паузы.
	 * Не автовоспроизводит — игра сама решает что играть при resume.
	 */
	resumeAll: function ()
	{
		this._pausedBySystem = false;
	},

	_muteAll: function ()
	{
		for (var i = 0; i < this._audioElements.length; i++)
			try { this._audioElements[i].muted = true; } catch (e) {}
	},

	_unmuteAll: function ()
	{
		for (var i = 0; i < this._audioElements.length; i++)
			try { this._audioElements[i].muted = false; } catch (e) {}
	},

	/**
	 * @param {HTMLAudioElement} audio
	 */
	register: function (audio)
	{
		this._audioElements.push(audio);
		if (this._muted)
			try { audio.muted = true; } catch (e) {}
	},
};
