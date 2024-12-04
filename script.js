document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const gameOverScreen = document.getElementById('game-over-screen');
    const winScreen = document.getElementById('win-screen');
    const tutorialScreen = document.getElementById('tutorial-screen');
    const leaderboardScreen = document.getElementById('leaderboard-screen');
    const restartButton = document.getElementById('restart-button');
    const restartButtonWin = document.getElementById('restart-button-win');
    const returnTitleButton = document.getElementById('return-title-button');
    const returnTitleButtonWin = document.getElementById('return-title-button-win');
    const returnTitleButtonLeaderboard = document.getElementById('return-title-button-leaderboard');
    const titleScreen = document.getElementById('title-screen');
    const playButton = document.getElementById('play-button');
    const tutorialButton = document.getElementById('tutorial-button');
    const closeTutorialButton = document.getElementById('close-tutorial-button');
    const timerDisplay = document.getElementById('timer');
    const leaderboardList = document.getElementById('leaderboard-list');
    const leaderboardButton = document.getElementById('leaderboard-button');
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const submitNameButton = document.getElementById('submit-name-button');
    let gameOver = false;
    let gameActive = false;
    let ballInterval;
    let titleScreenBallInterval;
    let timerInterval;
    let timer = 0;

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
            stopTimer();

            document.querySelectorAll('.ball').forEach(ball => ball.style.animationPlayState = 'paused');
        } else {
            const newSize = playerSize + Math.round(ballSize * (ballSize > playerSize ? 0.1 : 0.2));
            player.style.width = `${newSize}px`;
            player.style.height = `${newSize}px`;
            container.removeChild(ball);
            clearInterval(checkCollisionInterval);

            if (newSize >= 250) {
                winScreen.style.display = 'block';
                container.style.filter = 'blur(5px)';
                gameOver = true;
                stopTimer();
                promptForNameAndSaveScore(timer);
            }
        }
    }

    function startTimer() {
        timer = 0;
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function resetGame() {
        container.classList.remove('game-over');
        gameOverScreen.style.display = 'none';
        winScreen.style.display = 'none';
        titleScreen.style.display = 'flex';
        container.style.filter = 'blur(5px)'; 
        gameOver = false;
        gameActive = false;
        player.style.width = '10px';
        player.style.height = '10px';
        clearInterval(ballInterval);
        stopTimer();
        timerDisplay.textContent = 'Time: 0s';

        document.querySelectorAll('.ball').forEach(ball => container.removeChild(ball));
        titleScreenBallInterval = setInterval(createTitleScreenBall, 250);
    }

    function updateLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboardList.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.name} - ${entry.score}s`;
            leaderboardList.appendChild(li);
        });
    }

    function saveScore(name, score) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => a.score - b.score); 
        if (leaderboard.length > 10) leaderboard.pop();
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
    }

    function promptForNameAndSaveScore(score) {
        nameModal.style.display = 'block';

        submitNameButton.onclick = () => {
            const name = nameInput.value.trim();
            if (name) {
                saveScore(name, score);
                nameModal.style.display = 'none';
                nameInput.value = '';
            }
        };
    }

    playButton.addEventListener('click', () => {
        clearInterval(titleScreenBallInterval);
        titleScreen.style.display = 'none';
        container.style.filter = 'none'; 
        gameActive = true;
        ballInterval = setInterval(createBall, 250);
        startTimer();

        // Remove all existing balls
        document.querySelectorAll('.ball').forEach(ball => container.removeChild(ball));
    });

    tutorialButton.addEventListener('click', () => {
        tutorialScreen.style.display = 'block';
    });

    closeTutorialButton.addEventListener('click', () => {
        tutorialScreen.style.display = 'none';
    });

    restartButton.addEventListener('click', () => {
        resetGame();
        playButton.click();
    });

    restartButtonWin.addEventListener('click', () => {
        resetGame();
        playButton.click();
    });

    returnTitleButton.addEventListener('click', resetGame);
    returnTitleButtonWin.addEventListener('click', resetGame);
    returnTitleButtonLeaderboard.addEventListener('click', resetGame);

    leaderboardButton.addEventListener('click', () => {
        leaderboardScreen.style.display = 'block';
        titleScreen.style.display = 'none';
        updateLeaderboard();
    });

    returnTitleButtonLeaderboard.addEventListener('click', () => {
        leaderboardScreen.style.display = 'none';
        titleScreen.style.display = 'flex';
    });

    // Start creating balls for the title screen
    container.style.filter = 'blur(5px)'; 
    titleScreenBallInterval = setInterval(createTitleScreenBall, 250);

    // Initialize leaderboard on page load
    updateLeaderboard();

    window.onclick = (event) => {
        if (event.target == nameModal) {
            nameModal.style.display = 'none';
        }
    };
});
// 