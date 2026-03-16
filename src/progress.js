/**
 * Прогресс игрока — сохранение/загрузка из localStorage.
 * Замени defaults под свою игру.
 */
var Progress = {
  _key: CONFIG.GAME_ID + '_progress',
  _data: null,

  _defaults: function () {
    return {
      coins: 0,
      highScore: 0,
      gamesPlayed: 0,
    };
  },

  load: function () {
    try {
      var raw = localStorage.getItem(this._key);
      this._data = raw ? JSON.parse(raw) : this._defaults();
    } catch (e) {
      this._data = this._defaults();
    }
    // Добавить новые поля если их нет (после обновления)
    var defs = this._defaults();
    for (var k in defs) {
      if (!(k in this._data)) {
        this._data[k] = defs[k];
      }
    }
  },

  save: function () {
    try {
      localStorage.setItem(this._key, JSON.stringify(this._data));
    } catch (e) {
      // localStorage недоступен (приватный режим и т.д.)
    }
  },

  get: function (key) {
    if (!this._data) this.load();
    return this._data[key];
  },

  set: function (key, value) {
    if (!this._data) this.load();
    this._data[key] = value;
    this.save();
  },

  addCoins: function (amount) {
    this.set('coins', this.get('coins') + amount);
  },

  updateHighScore: function (score) {
    if (score > this.get('highScore')) {
      this.set('highScore', score);
    }
  },
};
