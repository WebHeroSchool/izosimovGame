class CatchMouse {
    constructor() {
        this.isRunning = false;

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
        this.existingEmojies = document.getElementsByClassName('appearance-animal');
        this.pointsElement = document.getElementById('game-points');
        this.currentLevel = document.querySelector('.character-bar__star .number_small');
        this.hearts = document.getElementsByClassName('character-bar__heart');

        this.createEmoji = this.createEmoji.bind(this);
    }
    startGame() {
        this.isRunning = true;
        const {score, level, lives, speed} = this.logic(true);
        this.syncLevel(level);
        this.syncHealth(lives);
        this.syncPoints(score);
        this.speed = speed;

        this.createEmoji();
        this.intervalId = setInterval(this.createEmoji, this.speed);
    }
    createEmoji() {

        // Этот while нужен, чтобы "чистить" грядки от эмоджи, по которым мы не кликали
        while (this.existingEmojies.length) {
            const data = this.logic(false, this.score, this.level, this.lives, this.existingEmojies[0].dataset.emojiName, this.rightEmoji, false);
            this.syncHealth(data.lives);
            this.existingEmojies[0].remove();
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
        emoji.addEventListener('click', this.emojiClickHandler.bind(this, emoji));
    }
    emojiClickHandler(emoji) {
        const data = this.logic(false, this.score, this.level, this.lives, emoji.dataset.emojiName, this.rightEmoji);
        const {score, level, lives, speed} = data;
        this.syncLevel(level);
        this.syncHealth(lives);
        this.syncPoints(score);
        this.speed = speed;

        clearInterval(this.intervalId);
        emoji.remove();

        this.createEmoji();
        this.intervalId = setInterval(this.createEmoji, this.speed);
    }
    logic(newGame, score, level, lives, currentEmoji, rightEmoji, clicked=true) {
        const INITIAL_SPEED = 2000;
        if (newGame) return {
            score: 0, level: 1, lives: 3, speed: INITIAL_SPEED
        };

        let newScore = score;
        let newLevel = level;
        let newLives = lives;

        if (clicked) {
            if (currentEmoji === rightEmoji) {
                newScore += 10;
                if (newScore % 50 === 0) {
                    newLevel += 1;
                };
            } else {
                newLives -= 1;
            }
        } else {
            if (currentEmoji === rightEmoji) {
                newLives -= 1;
            }
        }

        const newSpeed = INITIAL_SPEED - (100 * newLevel);

        return {
            score: newScore,
            level: newLevel,
            lives: newLives,
            speed: newSpeed
        };
    }
    endGame() {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }


    syncLevel(level) {
        if (this.level === level) return;
        const levelDisplay = document.querySelector('.character-bar__star');
        if (levelDisplay.classList.contains('star-animate')) {
            setTimeout(() => {
                levelDisplay.classList.toggle("star-animate");
            }, 0)
        }
        levelDisplay.classList.toggle("star-animate");
        this.level = level;
        this.currentLevel.textContent = level;
    }
    syncPoints(score) {
        if (this.score === score) return;
        this.score = score;
        this.pointsElement.textContent = score;
    }
    syncHealth(lives) {
        if (this.lives === lives) return;
        if (lives === 0) {
            this.endGame();
        }
        this.lives = lives;

        for (var i = 0; i < this.hearts.length; i++) {
            if (i < this.lives) {
                if (!(this.hearts[i].classList.contains('character-bar__heart_alive'))) {
                    this.hearts[i].classList.add('character-bar__heart_alive');
                    this.hearts[i].classList.remove('character-bar__heart_dead');
                }
            } else {
                if (this.hearts[i].classList.contains('character-bar__heart_alive')) {
                    this.hearts[i].classList.add('character-bar__heart_dead');
                    this.hearts[i].classList.remove('character-bar__heart_alive');
                } else if (!(this.hearts[i].classList.contains('character-bar__heart_dead'))) {
                    this.hearts[i].classList.add('character-bar__heart_dead');
                }
            }
        }
    }
}

const newGame = new CatchMouse();

const btn = document.querySelector('.start-bar__start-btn');
btn.addEventListener('click', () => {
    newGame.startGame();
});
