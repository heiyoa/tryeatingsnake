// 获取DOM元素
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverElement = document.getElementById('game-over');
const playAgainBtn = document.getElementById('play-again-btn');

// 游戏配置
const gridSize = 20;
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameSpeed = 300; // 毫秒 - 降低速度，原来是150
let score = 0;
let gameInterval;
let isPaused = false;
let isGameOver = false;
let difficulty = 'normal'; // 难度级别: easy, normal, hard

// 初始化游戏
function initGame() {
    // 设置画布大小
    canvas.width = Math.floor(canvas.offsetWidth / gridSize) * gridSize;
    canvas.height = Math.floor(canvas.offsetHeight / gridSize) * gridSize;
    
    // 初始化蛇
    snake = [
        {x: 5 * gridSize, y: 10 * gridSize},
        {x: 4 * gridSize, y: 10 * gridSize},
        {x: 3 * gridSize, y: 10 * gridSize}
    ];
    
    // 生成食物
    generateFood();
    
    // 重置游戏状态
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    isPaused = false;
    isGameOver = false;
    
    // 隐藏游戏结束界面
    gameOverElement.style.display = 'none';
    
    // 清除之前的游戏循环
    clearInterval(gameInterval);
}

// 生成食物
function generateFood() {
    const maxX = Math.floor(canvas.width / gridSize) - 1;
    const maxY = Math.floor(canvas.height / gridSize) - 1;
    
    // 随机生成食物位置
    let foodX, foodY;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        foodX = Math.floor(Math.random() * maxX) * gridSize;
        foodY = Math.floor(Math.random() * maxY) * gridSize;
        
        // 检查食物是否在蛇身上
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === foodX && snake[i].y === foodY) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = {x: foodX, y: foodY};
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        // 蛇头与身体使用不同颜色
        if (index === 0) {
            ctx.fillStyle = '#4CAF50';
        } else {
            ctx.fillStyle = '#8BC34A';
        }
        
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        
        // 添加边框
        ctx.strokeStyle = '#222';
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    
    // 绘制食物的光晕效果
    ctx.beginPath();
    ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 87, 34, 0.3)';
    ctx.fill();
}

// 移动蛇
function moveSnake() {
    // 更新方向
    direction = nextDirection;
    
    // 获取蛇头
    const head = {x: snake[0].x, y: snake[0].y};
    
    // 根据方向移动蛇头
    switch (direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 生成新食物
        generateFood();
    } else {
        // 如果没吃到食物，移除蛇尾
        snake.pop();
    }
    
    // 检查游戏是否结束
    if (isCollision(head)) {
        endGame();
        return;
    }
    
    // 添加新蛇头
    snake.unshift(head);
}

// 检查碰撞
function isCollision(head) {
    // 检查是否撞墙
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        return true;
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏循环
function gameLoop() {
    if (!isPaused && !isGameOver) {
        moveSnake();
        drawGame();
    }
}

// 开始游戏
function startGame() {
    if (isGameOver) {
        initGame();
    }
    
    isPaused = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// 暂停游戏
function pauseGame() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';
}

// 重新开始游戏
function restartGame() {
    initGame();
    startGame();
}

// 结束游戏
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'flex';
}

// 事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);

// 键盘控制
document.addEventListener('keydown', (event) => {
    // 防止方向键滚动页面
    if ([37, 38, 39, 40].includes(event.keyCode)) {
        event.preventDefault();
    }
    
    // 根据按键更改方向
    switch (event.keyCode) {
        // 上
        case 38:
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        // 下
        case 40:
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        // 左
        case 37:
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        // 右
        case 39:
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
    }
});

// 响应式调整
window.addEventListener('resize', () => {
    initGame();
    if (!isGameOver && !isPaused) {
        drawGame();
    }
});

// 初始化游戏
window.addEventListener('load', () => {
    initGame();
    drawGame();
});