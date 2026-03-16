/**
 * Отрисовка игры на Canvas.
 * Замени под рендеринг своей игры.
 */
var Render = {
  canvas: null,
  ctx: null,

  init: function (canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  },

  clear: function () {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawAll: function () {
    this.clear();
    // Добавь отрисовку здесь
  },
};
