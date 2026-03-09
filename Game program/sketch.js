let player;
let mapManager;
let mapData;
// let gameStats = { score: 0 };
let tilesetImg;
let enemyImg;
let entities = [];
let heartImg;
let physics;
let uiManager;
let currentLevel = 1;
let mapData2;
let stoneImg;

let titleImg, startBtnImg;
let modeTextImg, normalBtnImg, hardBtnImg;
let tutorialTextImg;
let gameOverTextImg, restartBtnImg;
let gameState = 'START'; // 'START', 'MODE', 'TUTORIAL' ,'PLAYING', 'GAMEOVER'
let mode = 'NORMAL';
let keySheets = {};
let antImgs = [];


function preload() {
  mapData = loadJSON("assets/map/level_1.json");
  mapData2 = loadJSON("assets/map/level_2.json");
  playerImg = loadImage("assets/img/player_idle.png");
  tilesetImg = loadImage("assets/img/Tiles/grass.png");
  enemyImg = loadImage("assets/img/snake.png");
  heartImg = loadImage('assets/img/uiManager/heart.png')
  stoneImg = loadImage("assets/img/Tiles/stone.png");

  titleImg = loadImage('assets/img/uiManager/text/title.png');
  startBtnImg = loadImage('assets/img/uiManager/button/startBtn.png');
  modeTextImg = loadImage('assets/img/uiManager/text/mode_text.png');
  normalBtnImg = loadImage('assets/img/uiManager/button/normalBtn.png');
  hardBtnImg = loadImage('assets/img/uiManager/button/hardBtn.png');
  tutorialTextImg = loadImage('assets/img/uiManager/text/tutorialText.png');
  gameOverTextImg = loadImage('assets/img/uiManager/text/game_over_text.png');
  restartBtnImg = loadImage('assets/img/uiManager/button/restartBtn.png');
  for (let i = 1; i <= 8; i++) {
    antImgs.push(loadImage(`assets/img/enemy/ant/ant-${i}.png`));
  }
}

function setup() {
  let canvas = createCanvas(1000, 840);
  canvas.elt.oncontextmenu = () => false;

  entities = [];

  mapManager = new MapManager(currentLevel === 1 ? mapData : mapData2);
  uiManager = new UIManager();
  physics = new Physics(mapManager);

  mapManager = new MapManager(mapData);
  uiManager = new UIManager;
  physics = new Physics(mapManager);
  player = new Player(100, 50, 72, 48, playerImg);
  entities.push(player);



  // if (currentLevel === 1) {
  //   player = new Player(100, 50, 72, 48, playerImg);
  //   entities.push(player);
  //   entities.push(new Enemy(600, 400, 50, 50, enemyImg));
  //   entities.push(new Enemy(1200, 400, 50, 50, enemyImg));
  //   entities.push(new Enemy(1800, 300, 100, 100, enemyImg));
  //   let coin = new Coin(980, 480, 30, 30);
  //   entities.push(coin);
  //   entities.push(new Goal(2200, 400, uiManager.currentLevel));
  // } else if (currentLevel === 2) {
  //   player = new Player(100, 1572, 72, 48, playerImg);
  //   entities.push(player);
  // }
}

function draw() {
  background(173, 228, 249);

  if (gameState === 'START'){
    uiManager.displayStart(titleImg, startBtnImg);
  } else if (gameState === 'MODE'){
    uiManager.displayMode(modeTextImg, normalBtnImg, hardBtnImg);
  } else if (gameState === 'TUTORIAL'){
    uiManager.displayTutorial(tutorialTextImg, startBtnImg);
  } else if (gameState === 'GAMEOVER'){
    uiManager.displayGameOver(gameOverTextImg, restartBtnImg);
  } else if (gameState === 'PLAYING'){

    if (player.isDead) {
      gameState = 'GAMEOVER';
      return;
    }

    //   // 過關條件
    // if (player.pos.x >= mapManager.gridWidth - player.width) {
    //   if (currentLevel < 2) {
    //     currentLevel++;
    //     setup();
    //   }
    //   return;
    // }
    let targetCamX = -player.pos.x + width / 2;
    let targetCamY = currentLevel === 1 ? 0 : -player.pos.y + height * 0.8;
    let camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
    let camY = currentLevel === 1 ? 0 : constrain(targetCamY, -mapManager.gridHeight, 0);

    for (let e of entities) {
    if (e === player) {
      e.update(mapManager, physics);
    } 
    // else if (e instanceof Goal) {
    //   e.update();
    // }
    else {
      e.update(mapManager);
    }

    if (e !== player) {
      if (overlaps(player, e)) {
        e.onCollide(player)
      }
    }
  }
  entities = entities.filter(e => !e.isDead);
  

  // --- 相機邏輯開始 ---
  push();
  translate(camX, camY);

  // 2. Display 階段
  if (currentLevel === 1) {
    mapManager.display(tilesetImg, stoneImg);
  } else if (currentLevel === 2) {
    mapManager.display(stoneImg, tilesetImg);
  }
  for (let e of entities) {
    e.display();
  }

  pop();
  // --- 相機邏輯結束 ---

  // 3. UI 階段
  uiManager.display(heartImg);
}
}

// function mousePressed() {
//   uiManager.handleMousePressed();
// }

function overlaps(a, b) {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

function mousePressed() {

  console.log('gameState:', gameState);
  if (gameState === 'START') {
    if (uiManager.isButtonClicked(mouseX, mouseY)) {
      gameState = 'MODE';
    }
  } else if (gameState ==='MODE'){
    if (uiManager.isNormalButtonClicked(mouseX, mouseY)) {
      mode = 'NORMAL';
      initGame();
      gameState = 'TUTORIAL';
    } else if (uiManager.isHardButtonClicked(mouseX, mouseY)){
      mode = 'HARD'
      initGame();
      gameState = 'TUTORIAL';
    }
  } else if (gameState === 'TUTORIAL'){
    if (uiManager.isButtonClicked(mouseX, mouseY)) {
      gameState = 'PLAYING';
    }
  } else if (gameState === 'GAMEOVER'){
    if (uiManager.isRestartButtonClicked(mouseX, mouseY)) {
      console.log("click");
      resetGame();
    }
  }
}

function initGame() {
  entities.push(new Ant(620, 400, 50));
  entities.push(new Ant(1400, 400, 50));
  entities.push(new Ant(1800, 400, 80));
  
  if (mode === 'HARD') {
    entities.push(new Ant(200, 400, 50));
    entities.push(new Ant(2400, 400, 100));
  }
}

function resetGame() {
  entities = [];
  initGame();
  player = new Player(100, 50, 72, 48, playerImg);
  player.isDead = false;
  entities.push(player);
  uiManager.currentHearts = uiManager.maxHearts;
  gameState = 'PLAYING';
}


// class Goal {
//   constructor(x, y, level) {
//     this.baseX = x;
//     this.baseY = y;
//     this.y = y;
//     this.level = level;
//     this.size = 60;
//     this.isDead = false;
//     this.floatOffset = 0;
//   }

//   update() {
//     this.floatOffset = sin(frameCount * 0.05) * 10;
//     this.y = this.baseY + this.floatOffset;

//     let d = dist(player.pos.x, player.pos.y, this.baseX, this.y);
//     if (d < this.size) {
//       this.isDead = true;
//       uiManager.levelComplete(this.level);
//     }
//   }

//   display() {
//     uiManager.drawPixelEgg(this.baseX, this.y, this.size, this.level);
//   }
// }