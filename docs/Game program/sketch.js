let mapManager;
let map1Data, map2Data;
let tileSetImg, stoneImg;
let levelManager;
let goalImg;
let player;
let physics;
let entities = [];
let uiManager;
let titleTextImg, modeTextImg, tutorialTextImg, gameOverTextImg, gameWinTextImg;
let startBtnImg, normalBtnImg, hardBtnImg, restartBtnImg;
let heartImg;
let gameState = 'START'; // 'START', 'MODE', 'TUTORIAL' ,'PLAYING', 'GAMEOVER', 'GAMECLEAR'
let mode = 'NORMAL';
let antImgs = [];

let camX = 0;
let camY = 0;


function preload() {
  map1Data = loadJSON("assets/map/level_1.json");
  map2Data = loadJSON("assets/map/level_2.json");

  playerImg = loadImage("assets/img/player_idle.png");
  tileSetImg = loadImage("assets/img/Tiles/grass.png");
  stoneImg = loadImage("assets/img/Tiles/stone.png");
  heartImg = loadImage('assets/img/uiManager/heart.png');
  goalImg = loadImage("assets/img/goal.png");

  titleTextImg = loadImage('assets/img/uiManager/text/title.png');
  modeTextImg = loadImage('assets/img/uiManager/text/mode_text.png');
  tutorialTextImg = loadImage('assets/img/uiManager/text/tutorialText.png');
  gameOverTextImg = loadImage('assets/img/uiManager/text/game_over_text.png');
  gameWinTextImg = loadImage('assets/img/uiManager/text/game_win_text.png');

  startBtnImg = loadImage('assets/img/uiManager/button/startBtn.png');
  normalBtnImg = loadImage('assets/img/uiManager/button/normalBtn.png');
  hardBtnImg = loadImage('assets/img/uiManager/button/hardBtn.png');
  restartBtnImg = loadImage('assets/img/uiManager/button/restartBtn.png');

  for (let i = 1; i <= 8; i++) {
    antImgs.push(loadImage(`assets/img/enemy/ant/ant-${i}.png`));
  }
}

function setup() {
  let canvas = createCanvas(1000, 840);
  canvas.elt.oncontextmenu = () => false;

  entities = [];
  uiManager = new UIManager();
  levelManager = new LevelManager(map1Data, map2Data, goalImg);
  initGame();
}

function draw() {
  background(173, 228, 249);

  if (gameState === 'START'){
    uiManager.displayStart(titleTextImg, startBtnImg);
  } else if (gameState === 'MODE'){
    uiManager.displayMode(modeTextImg, normalBtnImg, hardBtnImg);
  } else if (gameState === 'TUTORIAL'){
    uiManager.displayTutorial(tutorialTextImg, startBtnImg);
  } else if (gameState === 'GAMEOVER'){
    uiManager.displayGameOver(gameOverTextImg, restartBtnImg);
  } else if (gameState === 'GAMECLEAR'){
    uiManager.displayGameWin(gameWinTextImg, restartBtnImg);
  } else if (gameState === 'PLAYING'){

    if (player.isDead) {
      gameState = 'GAMEOVER';
      return;
    }

    if (levelManager.isReachedGoal(player)) {
      if (levelManager.nextLevel()) {
        initGame();
      } else {
        gameState = 'GAMECLEAR'; 
        return;
      } 
    }

    let targetCamX = - player.pos.x + width / 2;
    let targetCamY = levelManager.currentLevel === 1 ? 0 : -player.pos.y + height * 0.8;
    camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
    camY = levelManager.currentLevel === 1 ? 0 : constrain(targetCamY, - mapManager.gridHeight, 0);

    for (let e of entities) {
      e.update(mapManager, physics);

      if (e !== player) {
        if (overlaps(player, e)) {
          e.onCollide(player)
        }
      }
    }
    entities = entities.filter(e => !e.isDead);
  
    // Camera logic 
    push();
    translate(camX, camY);

    if(levelManager.currentLevel === 1){
      mapManager.display(tileSetImg, stoneImg);
    } else{
      mapManager.display(stoneImg, tileSetImg);

    }
    levelManager.displayGoal();

    for (let e of entities) {
      e.display();
    }

    pop();

    uiManager.display(heartImg);
  }
}


function overlaps(a, b) {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

function mousePressed() {
   if (!uiManager) return;

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
      resetGame();
    }
  } else if (gameState === 'GAMECLEAR'){
    if (uiManager.isRestartButtonClicked(mouseX, mouseY)) {
      resetGame();
      gameState = 'START';
    }
  }
}


function initGame() {
  entities = [];
  let data = levelManager.getLevelData(levelManager.currentLevel, mode);
  mapManager = new MapManager(data.mapData);
  physics = new Physics(mapManager);
  levelManager.spawnEnemies(levelManager.currentLevel, mode, entities);
  if (levelManager.currentLevel === 1){
    player = new Player(150, 200, 72, 48, playerImg);
  } else if (levelManager.currentLevel === 2){
    player = new Player(150, 1300, 72, 48, playerImg);
  }

  entities.push(player);
}

function resetGame() {
  levelManager.currentLevel = 1;
  initGame();
  player.isDead = false;
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