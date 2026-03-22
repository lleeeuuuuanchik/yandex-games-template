var Game =
{
	score: 0,
	isGameOver: false,
	isPaused: false,

	init: function ()
	{
		this.score = 0;
		this.isGameOver = false;
		this.isPaused = false;
	},

	pause: function ()
	{
		if (this.isGameOver || this.isPaused) return;
		this.isPaused = true;
		YandexSDK.gameplayStop();
	},

	resume: function ()
	{
		if (!this.isPaused) return;
		this.isPaused = false;
		YandexSDK.gameplayStart();
	},
};
