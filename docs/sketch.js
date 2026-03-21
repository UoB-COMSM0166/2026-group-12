let mapManager;
let bgImg;
let map0Data, map1Data, map2Data;
let tileSetImg;
let bushImg, pointerImg, fenceImg, treeImg, willowImg, ridgeImg, grassDecoImg;
let levelManager;
let doorLockedImg, doorOpenImg;
let player;
let physics;
let entities = [];
let uiManager;
let titleTextImg, gameOverTextImg, gameWinTextImg;
let tutorialTextImg = [];
let startBtnImg, restartBtnImg, tutorialBtnImg, homeBtnImg;
let heartImg, keyImg;
let gameState = "START"; // 'START', 'LEVEL_SELECT','PLAYING', 'GAMEOVER', 'GAMECLEAR'
let antImgs = [];
let ball = [];
let fireballImg;
let iceballImg;
let blueButterfly, redButterfly;
let levelEggImgs = [];
let levelTextImg;
let saveManager;
let beeImgs = [];
let camX = 0;
let camY = 0;

function preload() {
  map0Data = loadJSON("assets/map/level_0.json");
  map1Data = loadJSON("assets/map/level_1.json");
  map2Data = loadJSON("assets/map/level_2.json");
  map3Data = loadJSON("assets/map/level_3.json");

  bgImg = loadImage("assets/img/Tiles/2 Background/Background.png");

  playerImg = loadImage("assets/img/player_idle.png");
  tileSetImg = loadImage("assets/img/Tiles/1 Tiles/Tileset.png");
  bushImg = loadImage("assets/img/Tiles/1 Tiles/bush.png");
  pointerImg = loadImage("assets/img/Tiles/1 Tiles/pointer.png");
  fenceImg = loadImage("assets/img/Tiles/1 Tiles/fence.png");
  treeImg = loadImage("assets/img/Tiles/1 Tiles/tree.png");
  willowImg = loadImage("assets/img/Tiles/1 Tiles/willow.png");
  ridgeImg = loadImage("assets/img/Tiles/1 Tiles/ridge.png");
  grassDecoImg = loadImage("assets/img/Tiles/1 Tiles/grass_deco.png");

  heartImg = loadImage("assets/img/uiManager/heart.png");
  keyImg = loadImage("assets/img/uiManager/key.png");
  doorLockedImg = loadImage("assets/img/uiManager/door/doorLocked.png");
  doorOpenImg = loadImage("assets/img/uiManager/door/doorOpen.png");
  fireballImg = loadImage("assets/img/fireball.png");
  iceballImg = loadImage("assets/img/iceball.png");
  blueButterfly = loadImage("assets/img/item/blueButterfly.png");
  redButterfly = loadImage("assets/img/item/redButterfly.png");

  titleTextImg = loadImage("assets/img/uiManager/text/title.png");
  tutorialTextImg.push(
    loadImage("assets/img/uiManager/text/tutorial_use_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_key_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_fire_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_ice_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_grapple_1_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_grapple_2_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_goal_text.png")
  );

  gameOverTextImg = loadImage("assets/img/uiManager/text/game_over_text.png");
  gameWinTextImg = loadImage("assets/img/uiManager/text/game_win_text.png");
  levelTextImg = loadImage("assets/img/uiManager/text/level_text.png");

  startBtnImg = loadImage("assets/img/uiManager/button/startBtn.png");
  restartBtnImg = loadImage("assets/img/uiManager/button/restartBtn.png");
  tutorialBtnImg = loadImage("assets/img/uiManager/button/tutorialBtn.png");
  homeBtnImg = loadImage("assets/img/uiManager/button/homeBtn.png");
  levelEggImgs.push(loadImage("assets/img/uiManager/egg/level1_egg.png"));
  levelEggImgs.push(loadImage("assets/img/uiManager/egg/level2_egg.png"));
  levelEggImgs.push(loadImage("assets/img/uiManager/egg/level3_egg.png"));
  //Enemies(Ant and Bee)
  for (let i = 1; i <= 8; i++) {
    antImgs.push(loadImage(`assets/img/enemy/ant/ant-${i}.png`));
  }

  for (let i = 1; i <= 8; i++) {
    beeImgs.push(loadImage(`assets/img/enemy/bee/bee-${i}.png`));
  }

  //Hearts
  heartImg = loadImage("assets/img/uiManager/heart.png");
}

function setup() {
  let canvas = createCanvas(1000, 840);
  canvas.elt.oncontextmenu = () => false;

  entities = [];
  uiManager = new UIManager();
  levelManager = new LevelManager(
    map0Data,
    map1Data,
    map2Data,
    map3Data,
    doorLockedImg,
    doorOpenImg,
  );
  saveManager = new SaveManager();
  initGame();
}

function draw() {

  let bgX = floor(camX * 0.05);
  image(bgImg, bgX, 0, width, height);
  image(bgImg, bgX - width, 0, width, height);
  image(bgImg, bgX + width, 0, width, height);
  fill(255, 255, 255, 30);
  noStroke();
  rect(0, 0, width, height);

  if (gameState === "START") {
    uiManager.displayStart(titleTextImg, startBtnImg, tutorialBtnImg);
  } else if (gameState === "LEVEL_SELECT") {
    uiManager.displayLevel(levelTextImg, levelEggImgs, saveManager);
  } else if (gameState === "GAMEOVER") {
    uiManager.displayGameOver(gameOverTextImg, restartBtnImg, homeBtnImg);
  } else if (gameState === "GAMECLEAR") {
    uiManager.displayGameWin(gameWinTextImg, homeBtnImg);
  } else if (gameState === "PLAYING") {
    if (levelManager.currentLevel === 0) {
      let tutorialTexts = levelManager.getTutorialTexts(tutorialTextImg);
      for (let text of tutorialTexts) {
        if (player.pos.x >= text.triggerX && player.pos.x < text.endX) {
          let imgW = 1000;
          let imgH = uiManager.getScaledHeight(text.img, imgW);
          image(text.img, width / 2 - imgW / 2, 200, imgW, imgH);
        }
      }
      if (player.isDead) {
        player.isDead = false;
        initGame();
        return;
      }
      if (levelManager.isReachedGoal(player, uiManager)) {
        gameState = "GAMECLEAR";
        return;
      }
    }

    if (player.isDead) {
      gameState = "GAMEOVER";
      return;
    }

    if (levelManager.isReachedGoal(player, uiManager)) {
      saveManager.completeLevel(levelManager.currentLevel);
      if (levelManager.nextLevel()) {
        initGame();
      } else {
        gameState = "GAMECLEAR";
        return;
      }
    }

    let targetCamX = -player.pos.x + width / 2;
    let targetCamY = levelManager.currentLevel === 3 ? -player.pos.y + height * 0.8 : 0;
    camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
    camY = levelManager.currentLevel === 3 ? constrain(targetCamY, -(mapManager.gridHeight - height), 0) : 0;

    for (let e of entities) {
      e.update(mapManager, physics);

      if (e !== player) {
        if (!e.isDead && overlaps(player, e)) {
          e.onCollide(player);
        }
      }
    }
    entities = entities.filter((e) => !e.isDead);
    //ball move update
    for (let i = ball.length - 1; i >= 0; i--) {
      let b = ball[i];
      b.update(physics);
      if (!b.isDead) { 
        for (let e of entities) {
          if (e instanceof Enemy && !e.isDead && overlaps(b, e)) {
            e.takeDamage(1, b.element);
            b.isDead = true;
            break;
          }
        }
      }

      //dead ball
      if (b.isDead) {
        ball.splice(i, 1);
      }
    }

    // Camera logic
    push();
    translate(camX, camY);
    

    mapManager.display(tileSetImg, bushImg, pointerImg, fenceImg, treeImg, willowImg, ridgeImg, grassDecoImg);
    levelManager.displayGoal();

    for (let e of entities) {
      e.display();
    }
    for (let b of ball) {
      b.display();
    }

    pop();

    uiManager.display(heartImg, keyImg);
  }
}

function overlaps(a, b) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

function mousePressed() {
  if (!uiManager) return;

  if (gameState === "START") {
    if (uiManager.isStartButtonClicked(mouseX, mouseY)) {
      gameState = "LEVEL_SELECT";
    } else if (uiManager.isTutorialButtonClicked(mouseX, mouseY)) {
      levelManager.currentLevel = 0;
      initGame();
      gameState = "PLAYING";
    }
  } else if (gameState === "LEVEL_SELECT") {
    let level = uiManager.getLevelClicked(mouseX, mouseY);
    if (level !== -1) {
      levelManager.currentLevel = level;
      initGame();
      gameState = "PLAYING";
    }
  } else if (gameState === "GAMEOVER") {
    if (uiManager.isRestartButtonClicked(mouseX, mouseY)) {
      resetGame();
    } else if (uiManager.isHomeButtonClicked(mouseX, mouseY)) {
      levelManager.currentLevel = 1;
      resetGame();
      gameState = "START";
    }
  } else if (gameState === "GAMECLEAR") {
    if (uiManager.isHomeButtonClicked(mouseX, mouseY)) {
      levelManager.currentLevel = 1;
      resetGame();
      gameState = "START";
    }
  }
}

function initGame() {
  entities = [];
  uiManager.currentHearts = uiManager.maxHearts;
  uiManager.currentKeys = 0;
  uiManager.hasEgg = false;
  let data = levelManager.getLevelData(levelManager.currentLevel);
  mapManager = new MapManager(data.mapData);
  physics = new Physics(mapManager);
  //enemy
  levelManager.spawnEnemies(levelManager.currentLevel, entities);
  //items
  levelManager.spawnItems(levelManager.currentLevel, entities);

  if (levelManager.currentLevel === 0) {
    player = new Player(50, 200, 72, 48, playerImg);
  } else if (levelManager.currentLevel === 3) {
    player = new Player(150, 1300, 72, 48, playerImg);
  } else {
    player = new Player(150, 200, 72, 48, playerImg);
  }
  entities.push(player);
}

function resetGame() {
  player.isDead = false;
  initGame();
  gameState = "PLAYING";
}

// for testing
function keyPressed() {
  if (key === "p" || key === "P") {
    console.log("player pos:", player.pos.x, player.pos.y);
  }

  if (key === "l" || key === "L") {
    saveManager.completeLevel(levelManager.currentLevel);
    if (levelManager.nextLevel()) {
      initGame();
    } else {
      gameState = "GAMECLEAR";
    }
  }

  if (key === "c" || key === "C") {
    saveManager.clear();
  }
}
