let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("assets/music/food.mp3");
const gameOverSound = new Audio("assets/music/gameover.mp3");
const moveSound = new Audio("assets/music/move.mp3");
const musicSound = new Audio("assets/music/music.mp3");
let score = 0;
let speed = 16;
let lastTime = 0;
let snakeArr = [{ x: 15, y: 15 }];
let food = { x: 5, y: 8 };

// Game Loop Function...
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastTime) / 1000 < 1 / speed) {
    return;
  }
  lastTime = ctime;
  gameEngine();
}

function isCollide(snake_Arr) {
  // If the snake collides with itself
  for (let i = 1; i < snake_Arr.length; i++) {
    if (
      snake_Arr[i].x === snake_Arr[0].x &&
      snake_Arr[i].y === snake_Arr[0].y
    ) {
      return true;
    }
  }

  // If the snake hits the wall
  if (
    snake_Arr[0].x >= 18 ||
    snake_Arr[0].x <= 0 ||
    snake_Arr[0].y >= 18 ||
    snake_Arr[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // Part-1: Updating Snake and Food positions

  // Snake collision
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    alert("Game Over! Press Any Key to Restart");
    snakeArr = [{ x: 8, y: 15 }];
    inputDir = { x: 0, y: 0 };
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    return;
  }

  // Snake eats food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    foodSound.play();
    score += 1;
    if (score > hiscoreVal) {
      hiscoreVal = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreVal));
      hiscoreBox.innerHTML = "HiScore: " + hiscoreVal;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    do {
      food = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random()),
      };
    } while (
      snakeArr.some((segment) => segment.x === food.x && segment.y === food.y)
    );
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Part-2: Display Snake and Food
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // Display Food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Local Storage for High Score
let hiscore = localStorage.getItem("hiscore");
let hiscoreVal = 0;
if (hiscore === null) {
  localStorage.setItem("hiscore", JSON.stringify(hiscoreVal));
} else {
  hiscoreVal = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "HiScore: " + hiscoreVal;
}

// Game Initialization
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 }; // Start game
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;

    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
  }
});
