class CathMouse {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
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

        this.createEmoji = this.createEmoji.bind(this);
    }
    startGame() {
        this.isRunning = true;
        this.createEmoji();
        this.intervalId = setInterval(this.createEmoji, 2000);
    }
    createEmoji() {
        if (!this.isRunning) return;

        // Этот while нужен, чтобы "чистить" грядки от эмоджи, по которым мы не кликали
        while (this.existingEmojies.length) {
            console.log('kekes');
            this.existingEmojies[0].remove();
        };

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
        this.holes[randomHoleIndex].appendChild(emoji);
        emoji.addEventListener('click', this.emojiClickHandler.bind(this, emoji));
    }
    emojiClickHandler(emoji) {
        if (emoji.dataset.emoji === this.emojies[this.rightEmoji]) {
            console.log('Я поймал мышь');
        };
        console.log(emoji);

        clearInterval(this.intervalId);
        emoji.remove();

        this.createEmoji();
        this.intervalId = setInterval(this.createEmoji, 2000);
    }
    endGame() {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }
}

const newGame = new CathMouse();

const btn = document.querySelector('.start-bar__start-btn');
btn.addEventListener('click', () => {
    newGame.startGame();
});
