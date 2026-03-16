/**
 * Обёртка Yandex Games SDK v2.
 * Graceful degradation: если SDK недоступен, колбэки вызываются без рекламы.
 */
var YandexSDK = {
  ysdk: null,
  _ready: false,
  _pendingNotifyReady: false,

  init: function (cb) {
    if (typeof YaGames === 'undefined') {
      if (cb) cb(false);
      return;
    }
    var self = this;
    YaGames.init().then(function (ysdk) {
      self.ysdk = ysdk;
      self._ready = true;
      if (cb) cb(true);
      if (self._pendingNotifyReady) self.notifyReady();
    }).catch(function () {
      if (cb) cb(false);
    });
  },

  /**
   * Сообщить платформе, что игра загружена и готова к игре (обязательно для модерации).
   * Вызывать один раз после отображения главного меню / готовности к взаимодействию.
   */
  notifyReady: function () {
    if (this.ysdk && this.ysdk.features && this.ysdk.features.LoadingAPI) {
      this.ysdk.features.LoadingAPI.ready();
    } else {
      this._pendingNotifyReady = true;
    }
  },

  /**
   * Показать rewarded-рекламу.
   * @param {function} onSuccess — вызывается после просмотра (onRewarded)
   * @param {function} [onError] — вызывается при ошибке или если SDK нет
   */
  showRewarded: function (onSuccess, onError) {
    if (!this.ysdk) {
      if (onError) onError();
      return;
    }
    this.ysdk.adv.showRewardedVideo({
      callbacks: {
        onOpen: function () {},
        onRewarded: function () {
          if (onSuccess) onSuccess();
        },
        onClose: function () {},
        onError: function () {
          if (onError) onError();
        },
      },
    });
  },

  /**
   * Показать межстраничную рекламу (между уровнями и т.д.).
   * @param {function} [onClose]
   */
  showInterstitial: function (onClose) {
    if (!this.ysdk) {
      if (onClose) onClose();
      return;
    }
    this.ysdk.adv.showFullscreenAdv({
      callbacks: {
        onClose: function () {
          if (onClose) onClose();
        },
        onError: function () {
          if (onClose) onClose();
        },
      },
    });
  },
};
