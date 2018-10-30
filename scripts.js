class CathMouse {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isRunning = false;
        this.emojiTypes = ['lion', 'panda', 'bear', 'fox', 'cat', 'cow', 'pig', 'koala', 'rabbit', 'tiger'];
        this.rightEmoji = 'mouse';
        this.holes = document.getElementsByClassName('playing-zone__hole');
        this.existingEmojies = document.getElementsByClassName('appearance-animal');

        this.createEmoji = this.createEmoji.bind(this);
    }
    startGame() {
        this.isRunning = true;
        this.createEmoji();
        this.setIntervalId = setInterval(this.createEmoji, 2000);
    }
    createEmoji() {
        while (this.existingEmojies.length) {
            this.existingEmojies[0].remove();
        };
        if (this.isRunning) {
            let emojiType = '';
            if (Math.floor(Math.random() * 3) === 2) {
                emojiType = this.rightEmoji;
            } else {
                let randomEmojiIndex = Math.floor(Math.random() * (this.emojiTypes.length));
                emojiType = this.emojiTypes[randomEmojiIndex];
            }
            let randomHoleIndex = Math.floor(Math.random() * (this.holes.length));

            let emoji = document.createElement('div');
            emoji.classList.add(`playing-zone__${emojiType}`, 'appearance-animal');
            this.holes[randomHoleIndex].appendChild(emoji);
            emoji.addEventListener('click', this.emojiClickHandler.bind(this, emoji));
        }
    }
    emojiClickHandler(emoji) {
        if (emoji.classList.contains('playing-zone__mouse')) {
            console.log('Я поймал мышь');
        }
        console.log(emoji);
        emoji.remove();
        this.clearIntervals();
        this.createEmoji();
        this.setIntervalId = setInterval(this.createEmoji, 2000);
    }
    endGame() {
        this.isRunning = false;
        this.clearIntervals();
    }
    clearIntervals() {
        clearInterval(this.setIntervalId);
    }
}

let newGame = new CathMouse();

let btn = document.querySelector('.start-bar__start-btn');
btn.addEventListener('click', () => {
    newGame.startGame();
});
