var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
var timeEl = document.querySelector("#timeEl");
var scoreEl = document.querySelector("#scoreEl");
var statusEl = document.querySelector("#statusEl");
var startGameBtn = document.querySelector("#startGameElBtn");
var modalEl = document.querySelector("#modalEl");
var bigScoreEl = document.querySelector("#bigScoreEl");
var exportGameElBtn = document.querySelector("#exportGameElBtn");
var exportAnswerEl = document.querySelector("#exportAnswerEl");
var answerFromEl = document.querySelector("#answerFromEl");
var submitGameElBtn = document.querySelector("#submitGameElBtn");
var submitFormEl = document.querySelector("#submitFormEl");
var submitAnswerEl = document.querySelector("#submitAnswerEl");
var submitBtnEl = document.querySelector("#submitBtnEl");
var Player = /** @class */ (function () {
    function Player(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    Player.prototype.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    };
    return Player;
}());
var Projectile = /** @class */ (function () {
    function Projectile(time, x, y, radius, color, velocity) {
        this.time = time;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    Projectile.prototype.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    };
    Projectile.prototype.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    };
    return Projectile;
}());
var Enemy = /** @class */ (function () {
    function Enemy(time, x, y, radius, color, velocity) {
        this.time = time;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    Enemy.prototype.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    };
    Enemy.prototype.update = function () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    };
    return Enemy;
}());
var friction = 0.99;
var Particle = /** @class */ (function () {
    function Particle(time, x, y, radius, color, velocity) {
        this.time = time;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    Particle.prototype.draw = function () {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    };
    Particle.prototype.update = function () {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    };
    return Particle;
}());
var Ans = /** @class */ (function () {
    function Ans(time, x, y) {
        this.time = time;
        this.x = x;
        this.y = y;
    }
    return Ans;
}());
var Submittion = /** @class */ (function () {
    function Submittion(time, x, y) {
        this.time = time;
        this.x = x;
        this.y = y;
    }
    return Submittion;
}());
var x = canvas.width / 2;
var y = canvas.height / 2;
var player = new Player(x, y, 10, "white");
var projectiles = [];
var enemies = [];
var particles = [];
var answer = [];
var submittion = [];
var gameState = false;
var time = new Date();
var prevtime = 0;
function init() {
    gameState = true;
    time = new Date();
    player = new Player(x, y, 10, "white");
    projectiles = [];
    enemies = [];
    particles = [];
    answer = [];
    score = 0;
    scoreEl.innerHTML = score.toString();
    statusEl.innerHTML = "Ready!";
    statusEl.style.backgroundColor = "rgb(34 197 94)";
    bigScoreEl.innerHTML = score.toString();
    prevtime = 0;
}
function spawnEnemies() {
    var timer = setInterval(function () {
        if (gameState === false) {
            clearInterval(timer);
        }
        var time1 = new Date();
        var radius = Math.random() * (30 - 4) + 4;
        var x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = canvas.height * Math.random();
        }
        else {
            x = canvas.width * Math.random();
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        var color = "hsl(".concat(Math.random() * 360, ",50%,50%)");
        var angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        var velocity = { x: Math.cos(angle), y: Math.sin(angle) };
        enemies.push(new Enemy((time1.getTime() - time.getTime()) / 1000, x, y, radius, color, velocity));
    }, 1000);
}
var animationId;
var score = 0;
function animate() {
    var time1 = (new Date().getTime() - time.getTime()) / 1000;
    if (prevtime + 1 <= time1 || prevtime === 0) {
        statusEl.innerHTML = "Ready!";
        statusEl.style.backgroundColor = "rgb(34 197 94)";
    }
    animationId = requestAnimationFrame(animate);
    c.fillStyle = "rgba(0,0,0,0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    particles.forEach(function (particle, particleIndex) {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        }
        else {
            particle.update();
        }
    });
    projectiles.forEach(function (projectile, projectileIndex) {
        projectile.update();
        if (projectile.x - projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(function () {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });
    enemies.forEach(function (enemy, enemyIndex) {
        enemy.update();
        var dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            modalEl.style.display = "flex";
            bigScoreEl.innerHTML = score.toString();
            gameState = false;
        }
        projectiles.forEach(function (projectile, projectileIndex) {
            var dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                for (var i = 0; i < enemy.radius * 2; ++i) {
                    particles.push(new Particle(projectile.time, projectile.x, projectile.y, 3, enemy.color, {
                        x: (Math.random() - 0.5) * (Math.random() * 5),
                        y: (Math.random() - 0.5) * (Math.random() * 5)
                    }));
                }
                if (enemy.radius - 10 > 10) {
                    score += 100;
                    scoreEl.innerHTML = score.toString();
                    gsap.to(enemy, { radius: enemy.radius - 10 });
                    setTimeout(function () {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                else {
                    score += 250;
                    scoreEl.innerHTML = score.toString();
                    setTimeout(function () {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
    timeEl.innerHTML = ((new Date().getTime() - time.getTime()) /
        1000).toString();
}
canvas.addEventListener("click", function (event) {
    var angle = Math.atan2(event.offsetY - canvas.height / 2, event.offsetX - canvas.width / 2);
    var velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
    var time1 = (new Date().getTime() - time.getTime()) / 1000;
    if (prevtime !== 0 && prevtime + 1 > time1) {
        bulmaToast.toast({
            message: "Reloading...",
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
            duration: 1000,
            animate: { "in": "fadeIn", out: "fadeOut" },
            position: "bottom-center"
        });
    }
    if (prevtime === 0 || prevtime + 1 <= time1) {
        projectiles.push(new Projectile(time1, canvas.width / 2, canvas.height / 2, 5, "white", velocity));
        prevtime = time1;
        if (gameState === true) {
            answer.push(JSON.stringify(new Ans(time1, velocity.x, velocity.y)));
        }
        statusEl.innerHTML = "Reloading...";
        statusEl.style.backgroundColor = "rgb(239 68 68)";
    }
    console.log("projectiles = ".concat(JSON.stringify(projectiles)));
});
function checkBullet() {
    var timer = setInterval(function () {
        if (gameState === false) {
            clearInterval(timer);
        }
        var time1 = (new Date().getTime() - time.getTime()) / 1000;
        submittion.forEach(function (p, i) {
            if (p.time <= time1 &&
                prevtime + 1 > p.time &&
                prevtime < p.time &&
                prevtime !== 0) {
                bulmaToast.toast({
                    message: "Failed... ".concat(JSON.stringify(p)),
                    type: "is-danger",
                    dismissible: true,
                    pauseOnHover: true,
                    duration: 2000,
                    animate: { "in": "fadeIn", out: "fadeOut" },
                    position: "bottom-center"
                });
                console.log("Failed... ".concat(JSON.stringify(p)));
                submittion.splice(i, 1);
            }
            else if (p.time <= time1 &&
                (prevtime === 0 || prevtime + 1 <= p.time)) {
                console.log("canvasw = ".concat(canvas.width / 2));
                projectiles.push(new Projectile(p.time, canvas.width / 2 + p.x * (time1 - p.time), canvas.height / 2 + p.y * (time1 - p.time), 5, "white", { x: p.x, y: p.y }));
                answer.push(JSON.stringify(new Ans(p.time, p.x, p.y)));
                submittion.splice(i, 1);
                console.log("projectiles1 = ".concat(JSON.stringify(projectiles)));
                prevtime = p.time;
                statusEl.innerHTML = "Reloading...";
                statusEl.style.backgroundColor = "rgb(239 68 68)";
            }
        });
    }, 1);
}
startGameBtn.addEventListener("click", function () {
    init();
    animate(), spawnEnemies();
    modalEl.style.display = "none";
    exportAnswerEl.style.display = "none";
});
exportGameElBtn.addEventListener("click", function () {
    var exportAnswer = [];
    answer.forEach(function (x, i) {
        exportAnswer.push(JSON.parse(x));
    });
    answerFromEl.value = JSON.stringify(exportAnswer, null, 2);
    if (exportAnswerEl.style.display == "flex") {
        exportAnswerEl.style.display = "none";
    }
    else {
        exportAnswerEl.style.display = "flex";
    }
});
submitGameElBtn.addEventListener("click", function () {
    submitFormEl.value = "";
    if (submitAnswerEl.style.display == "flex") {
        submitAnswerEl.style.display = "none";
        submitBtnEl.style.display = "none";
    }
    else {
        submitAnswerEl.style.display = "flex";
        submitBtnEl.style.display = "inline-block";
    }
});
submitBtnEl.addEventListener("click", function () {
    submittion = [];
    var sub = JSON.parse(submitFormEl.value);
    sub.forEach(function (x, i) {
        submittion.push(new Submittion(x.time, x.x, x.y));
    });
    console.log(submittion);
    init();
    animate(), spawnEnemies(), checkBullet();
    modalEl.style.display = "none";
    exportAnswerEl.style.display = "none";
});
