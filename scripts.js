class CatchMouse {
    constructor() {
        this.isRunning = false;
        this.speed = 2000;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.levelUpdated = true;


        this.emojies = {
            lion: '🦁',
            panda: '🐼',
            bear: '🐻',
            fox: '🦊',
            cat: '🐱',
            cow: '🐮',
            pig: '🐽',
            koala: '🐨',
            rabbit: '🐰',
            tiger: '🐯',
            mouse: '🐭'
        };

        this.rightEmoji = 'mouse';

        this.holes = document.getElementsByClassName('playing-zone__hole');
        this.existingEmoji = document.getElementsByClassName('appearance-animal');
        this.pointsElement = document.getElementById('game-points');
        this.currentLevel = document.querySelector('.character-bar__star .number_small');
        this.hearts = document.getElementsByClassName('character-bar__heart');

        this.createEmoji = this.createEmoji.bind(this);
        this.emojiClickHandler = this.emojiClickHandler.bind(this);
    }
    startGame() {
        this.isRunning = true;
        this.syncLevel();
        this.syncHealth();
        this.syncPoints();

        this.createEmoji();
        this.intervalId = setInterval(this.createEmoji, this.speed);
    }
    createEmoji() {

        // Это условие нужно, чтобы "чистить" грядки от эмоджи, по которым мы не кликали
        if (this.existingEmoji.length) {
            this.logic(false);
            this.syncHealth();
            this.existingEmoji[0].remove();
        };

        if (!this.isRunning) return;

        let emojiType = '';
        const allEmojies = Object.keys(this.emojies);

        if (Math.floor(Math.random() * 3) === 2) {
            emojiType = this.rightEmoji;
        } else {
            const randomEmojiIndex = Math.floor(Math.random() * allEmojies.length);
            emojiType = allEmojies[randomEmojiIndex];
        }
        const randomHoleIndex = Math.floor(Math.random() * this.holes.length);

        const emoji = document.createElement('div');
        emoji.classList.add('appearance-animal');
        emoji.dataset.emoji = this.emojies[emojiType];
        emoji.dataset.emojiName = emojiType;
        this.holes[randomHoleIndex].appendChild(emoji);
        this.currentEmoji = emojiType;
        emoji.addEventListener('click', this.emojiClickHandler);
    }
    emojiClickHandler(event) {
        this.logic();
        this.syncLevel();
        this.syncHealth();
        this.syncPoints();
        const emoji = event.target;
        clearInterval(this.intervalId);
        emoji.remove();

        this.createEmoji();
        this.intervalId = setInterval(this.createEmoji, this.speed);
    }
    logic(clicked=true) {
        if (clicked) {
            if (this.currentEmoji === this.rightEmoji) {
                this.score += 10;
                if (this.score % 50 === 0) {
                    this.level += 1;
                    this.levelUpdated = true;

                    this.speed = 2000 - (300 * this.level);
                };
            } else {
                this.lives -= 1;
            }
        } else {
            if (this.currentEmoji === this.rightEmoji) {
                this.lives -= 1;
            }
        }

    }
    endGame() {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }


    syncLevel() {
        if (!this.levelUpdated) return;
        this.levelUpdated = false;
        const levelDisplay = document.querySelector('.character-bar__star');

        if (levelDisplay.classList.contains('star-animate')) {
            setTimeout(() => {
                levelDisplay.classList.toggle("star-animate");
            }, 0)
        }
        levelDisplay.classList.toggle("star-animate");
        this.currentLevel.textContent = this.level;

    }
    syncPoints() {
        this.pointsElement.textContent = this.score;
    }
    syncHealth() {
        if (this.lives === 0) {
            this.endGame();
        }

        for (var i = 0; i < this.hearts.length; i++) {
            this.hearts[i].classList.remove('character-bar__heart_alive', 'character-bar__heart_dead');
        }
        for (var i = 0; i < this.hearts.length; i++) {
            if (i < this.lives) {
                this.hearts[i].classList.add('character-bar__heart_alive');
            } else {
                this.hearts[i].classList.add('character-bar__heart_dead');
            }
        }
    }
}

const newGame = new CatchMouse();

const btn = document.querySelector('.start-bar__start-btn');
btn.addEventListener('click', () => {
    newGame.startGame();
});
