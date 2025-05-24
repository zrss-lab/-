const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 玩家坦克
const playerTank = {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    color: '#4CAF50',
    speed: 5,
    direction: 'right', // up, down, left, right
    bullets: []
};

// 敌方坦克
const enemyTank = {
    x: 600,
    y: 400,
    width: 40,
    height: 40,
    color: '#F44336',
    speed: 2
};
function drawTank(tank) {
    ctx.fillStyle = tank.color;
    ctx.fillRect(tank.x, tank.y, tank.width, tank.height);
    
    // 绘制炮管
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.beginPath();
    
    const centerX = tank.x + tank.width/2;
    const centerY = tank.y + tank.height/2;
    
    switch(tank.direction) {
        case 'up':
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, tank.y - 10);
            break;
        case 'down':
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, tank.y + tank.height + 10);
            break;
        case 'left':
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(tank.x - 10, centerY);
            break;
        case 'right':
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(tank.x + tank.width + 10, centerY);
    }
    ctx.stroke();
}
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            playerTank.direction = 'up';
            playerTank.y -= playerTank.speed;
            break;
        case 'ArrowDown':
            playerTank.direction = 'down';
            playerTank.y += playerTank.speed;
            break;
        case 'ArrowLeft':
            playerTank.direction = 'left';
            playerTank.x -= playerTank.speed;
            break;
        case 'ArrowRight':
            playerTank.direction = 'right';
            playerTank.x += playerTank.speed;
            break;
        case ' ': // 空格键发射子弹
            fireBullet();
            break;
    }
});
function fireBullet() {
    const bullet = {
        x: playerTank.x + playerTank.width/2,
        y: playerTank.y + playerTank.height/2,
        radius: 5,
        speed: 7,
        direction: playerTank.direction
    };
    playerTank.bullets.push(bullet);
}

function updateBullets() {
    playerTank.bullets.forEach((bullet, index) => {
        // 移动子弹
        switch(bullet.direction) {
            case 'up': bullet.y -= bullet.speed; break;
            case 'down': bullet.y += bullet.speed; break;
            case 'left': bullet.x -= bullet.speed; break;
            case 'right': bullet.x += bullet.speed; break;
        }
        
        // 绘制子弹
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI*2);
        ctx.fillStyle = '#FFEB3B';
        ctx.fill();
        
        // 检测碰撞
        if (checkCollision(bullet, enemyTank)) {
            playerTank.bullets.splice(index, 1);
            resetEnemy();
        }
        
        // 移除超出边界的子弹
        if (bullet.x < 0 || bullet.x > canvas.width || 
            bullet.y < 0 || bullet.y > canvas.height) {
            playerTank.bullets.splice(index, 1);
        }
    });
}
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制所有对象
    drawTank(playerTank);
    drawTank(enemyTank);
    updateBullets();
    
    // 简单AI：敌人随机移动
    if (Math.random() < 0.02) {
        const directions = ['up', 'down', 'left', 'right'];
        enemyTank.direction = directions[Math.floor(Math.random()*4)];
    }
    
    // 根据方向移动敌人
    switch(enemyTank.direction) {
        case 'up': enemyTank.y -= enemyTank.speed; break;
        case 'down': enemyTank.y += enemyTank.speed; break;
        case 'left': enemyTank.x -= enemyTank.speed; break;
        case 'right': enemyTank.x += enemyTank.speed; break;
    }
    
    // 边界检查
    keepInBounds(playerTank);
    keepInBounds(enemyTank);
    
    requestAnimationFrame(gameLoop);
}

// 启动游戏
gameLoop();
function checkCollision(bullet, tank) {
    return bullet.x > tank.x && 
           bullet.x < tank.x + tank.width &&
           bullet.y > tank.y && 
           bullet.y < tank.y + tank.height;
}

function resetEnemy() {
    enemyTank.x = Math.random() * (canvas.width - 40);
    enemyTank.y = Math.random() * (canvas.height - 40);
}

function keepInBounds(tank) {
    tank.x = Math.max(0, Math.min(canvas.width - tank.width, tank.x));
    tank.y = Math.max(0, Math.min(canvas.height - tank.height, tank.y));
}