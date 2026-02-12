document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');
    
    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let score = 0;
    let gameInterval;
    let isGameRunning = false;
    
    let snake = [];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    
    // Theme colors matching CSS
    const COLORS = {
        snakeHead: '#33ff00',
        snakeBody: '#2a8a00',
        food: '#ff3333',
        bg: '#050505',
        grid: 'rgba(51, 255, 0, 0.05)'
    };
    
    function initGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        score = 0;
        dx = 1;
        dy = 0;
        scoreElement.innerText = score;
        spawnFood();
        
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 100);
        isGameRunning = true;
        startBtn.textContent = "SEQUENCE RUNNING...";
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
    }
    
    function gameLoop() {
        if (!isGameRunning) return;
        
        moveSnake();
        if (checkCollision()) {
            gameOver();
            return;
        }
        draw();
    }
    
    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.innerText = score;
            spawnFood();
        } else {
            snake.pop();
        }
    }
    
    function checkCollision() {
        const head = snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        
        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    function spawnFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Ensure food doesn't spawn on snake
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) {
                spawnFood();
            }
        });
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Grid (optional, adds to tech feel)
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        for(let i=0; i<tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i*gridSize, 0);
            ctx.lineTo(i*gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i*gridSize);
            ctx.lineTo(canvas.width, i*gridSize);
            ctx.stroke();
        }

        // Draw Snake
        snake.forEach((part, index) => {
            ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snakeBody;
            ctx.shadowBlur = index === 0 ? 10 : 0;
            ctx.shadowColor = COLORS.snakeHead;
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
            ctx.shadowBlur = 0; // Reset shadow
        });
        
        // Draw Food
        ctx.fillStyle = COLORS.food;
        ctx.shadowBlur = 10;
        ctx.shadowColor = COLORS.food;
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        ctx.shadowBlur = 0; // Reset
    }
    
    function gameOver() {
        isGameRunning = false;
        clearInterval(gameInterval);
        alert(`MISSION FAILED. SCORE FINAL: ${score}`);
        startBtn.textContent = "RETRY MISSION";
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        
        // Reset to initial state drawing
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = COLORS.snakeHead;
        ctx.font = "20px Share Tech Mono";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
    }
    
    // Controls
    document.addEventListener('keydown', (e) => {
        // Prevent default scrolling for arrow keys
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }

        switch(e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });
    
    startBtn.addEventListener('click', initGame);
    
    // Initial draw
    draw();
});