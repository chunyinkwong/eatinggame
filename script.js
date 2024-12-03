document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const gameOverScreen = document.getElementById('game-over-screen');
    const restartButton = document.getElementById('restart-button');
    const titleScreen = document.getElementById('title-screen');
    const playButton = document.getElementById('play-button');
    const tutorialButton = document.getElementById('tutorial-button');
    let gameOver = false;
    let gameActive = false;
    let ballInterval;
    let titleScreenBallInterval;

    // Create the player circle
    const player = document.createElement('div');
    player.classList.add('player');
    player.style.width = '10px';
    player.style.height = '10px';
    player.style.position = 'absolute';
    container.appendChild(player);

    // Update player position based on mouse movement
    document.addEventListener('mousemove', (event) => {
        if (gameActive && !gameOver) {
            player.style.left = `${event.clientX - player.offsetWidth / 2}px`;
            player.style.top = `${event.clientY - player.offsetHeight / 2}px`;
        }
    });

    function createBall() {
        if (!gameActive) return; // Only create balls when the game is active

        const ball = document.createElement('div');
        ball.classList.add('ball');

        let size = getRandomBallSize(parseFloat(player.style.width));

        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = getRandomPastelColor();
        ball.style.border = '2px solid black';

        const { startX, startY, endX, endY } = getRandomStartEndPosition(size);
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        ball.style.setProperty('--endX', `${endX - startX}px`);
        ball.style.setProperty('--endY', `${endY - startY}px`);
        ball.style.animationDuration = `${Math.random() * 4 + 3}s`;

        container.appendChild(ball);

        ball.addEventListener('animationend', () => container.removeChild(ball));
        checkCollision(ball);
    }

    function createTitleScreenBall() {
        const ball = document.createElement('div');
        ball.classList.add('ball');

        let size = Math.random() * 50 + 10;

        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = getRandomPastelColor();
        ball.style.border = '2px solid black';

        const { startX, startY, endX, endY } = getRandomStartEndPosition(size);
        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        ball.style.setProperty('--endX', `${endX - startX}px`);
        ball.style.setProperty('--endY', `${endY - startY}px`);
        ball.style.animationDuration = `${Math.random() * 4 + 3}s`;

        container.appendChild(ball);

        ball.addEventListener('animationend', () => container.removeChild(ball));
    }

    function getRandomBallSize(playerSize) {
        if (playerSize <= 20) {
            return Math.random() * 50 + 10;
        } else if (playerSize <= 50) {
            return Math.random() * 75 + 10;
        } else {
            return Math.random() * 150 + 10;
        }
    }

    function getRandomPastelColor() {
        return `hsl(${Math.random() * 360}, 100%, 80%)`;
    }

    function getRandomStartEndPosition(size) {
        const startPosition = Math.random() * 4;
        let startX, startY, endX, endY;

        switch (Math.floor(startPosition)) {
            case 0:
                startX = Math.random() * window.innerWidth;
                startY = -size;
                endX = Math.random() * window.innerWidth;
                endY = window.innerHeight + size;
                break;
            case 1:
                startX = window.innerWidth + size;
                startY = Math.random() * window.innerHeight;
                endX = -size;
                endY = Math.random() * window.innerHeight;
                break;
            case 2:
                startX = Math.random() * window.innerWidth;
                startY = window.innerHeight + size;
                endX = Math.random() * window.innerWidth;
                endY = -size;
                break;
            case 3:
                startX = -size;
                startY = Math.random() * window.innerHeight;
                endX = window.innerWidth + size;
                endY = Math.random() * window.innerHeight;
                break;
        }
        return { startX, startY, endX, endY };
    }

    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }

    function checkCollision(ball) {
        const checkCollisionInterval = setInterval(() => {
            if (gameOver) {
                clearInterval(checkCollisionInterval);
                return;
            }

            const ballRect = ball.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (isColliding(ballRect, playerRect)) {
                handleCollision(ball, checkCollisionInterval);
            }
        }, 10);
    }

    function handleCollision(ball, checkCollisionInterval) {
        const ballSize = parseFloat(ball.style.width);
        const playerSize = parseFloat(player.style.width);

        if (ballSize > playerSize + 5) {
            clearInterval(checkCollisionInterval);
            container.classList.add('game-over');
            gameOverScreen.style.display = 'block';
            container.style.filter = 'blur(5px)';
            gameOver = true;

            document.querySelectorAll('.ball').forEach(ball => ball.style.animationPlayState = 'paused');
        } else {
            const newSize = playerSize + Math.round(ballSize * (ballSize > playerSize ? 0.1 : 0.2));
            player.style.width = `${newSize}px`;
            player.style.height = `${newSize}px`;
            container.removeChild(ball);
            clearInterval(checkCollisionInterval);
        }
    }

    playButton.addEventListener('click', () => {
        clearInterval(titleScreenBallInterval);
        titleScreen.style.display = 'none';
        container.style.filter = 'none'; 
        gameActive = true;
        ballInterval = setInterval(createBall, 250);

        // Remove all existing balls
        document.querySelectorAll('.ball').forEach(ball => container.removeChild(ball));
    });

    tutorialButton.addEventListener('click', () => {
        alert('Use your mouse to move the player and avoid larger balls. Eat smaller balls to grow.');
    });

    restartButton.addEventListener('click', () => {
        container.classList.remove('game-over');
        gameOverScreen.style.display = 'none';
        titleScreen.style.display = 'flex';
        container.style.filter = 'blur(5px)'; 
        gameOver = false;
        gameActive = false;
        player.style.width = '10px';
        player.style.height = '10px';
        clearInterval(ballInterval);

        document.querySelectorAll('.ball').forEach(ball => container.removeChild(ball));
        titleScreenBallInterval = setInterval(createTitleScreenBall, 250);
    });

    // Start creating balls for the title screen
    container.style.filter = 'blur(5px)'; 
    titleScreenBallInterval = setInterval(createTitleScreenBall, 250);
});
//
