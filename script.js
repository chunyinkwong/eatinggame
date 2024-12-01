document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');

    function createBall() {
        const ball = document.createElement('div');
        ball.classList.add('ball');

        const size = Math.random() * 50 + 10; // Random size between 10px and 60px
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;

        const position = Math.random() * (window.innerWidth - size);
        ball.style.left = `${position}px`;

        container.appendChild(ball);

        // Remove ball after animation ends
        ball.addEventListener('animationend', () => {
            container.removeChild(ball);
        });
    }

    // Create a new ball every second
    setInterval(createBall, 1000);
});