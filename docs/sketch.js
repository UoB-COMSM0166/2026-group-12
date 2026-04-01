let mapManager;
let bgImg;
let map0Data, map1Data, map2Data;
let tileSetImg;
let bushImg, pointerImg,downPointerImg, fenceImg, treeImg, willowImg, ridgeImg, grassDecoImg;
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
let cutsceneImgs = [];
let currentCutscene = [];
let cutsceneIndex = 0;
let sfx = {};
let badbunnyImgs = [];

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
  downPointerImg = loadImage("assets/img/Tiles/1 Tiles/down_pointer.png");
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
  carrotImg = loadImage('assets/img/carrot4.png');
  blueButterfly = loadImage("assets/img/item/blueButterfly.png");
  redButterfly = loadImage("assets/img/item/redButterfly.png");

  titleTextImg = loadImage("assets/img/uiManager/text/title.png");
  tutorialTextImg.push(
    loadImage("assets/img/uiManager/text/tutorial_use_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_key_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_grapple_1_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_ice_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_grapple_2_text.png"),
    loadImage("assets/img/uiManager/text/tutorial_fire_text.png"),
    
    loadImage("assets/img/uiManager/text/tutorial_goal_text.png")
  );

  gameOverTextImg = loadImage("assets/img/uiManager/text/game_over_text.png");
  gameWinTextImg = loadImage("assets/img/uiManager/text/game_win_text.png");
  levelTextImg = loadImage("assets/img/uiManager/text/level_text.png");
  cutsceneImgs.push(loadImage("assets/img/uiManager/text/scene1_text.png"));
  cutsceneImgs.push(loadImage("assets/img/uiManager/text/scene2_text.png"));
  cutsceneImgs.push(loadImage("assets/img/uiManager/text/scene3_text.png"));
  cutsceneImgs.push(loadImage("assets/img/uiManager/text/scene4_text.png"));

  startBtnImg = loadImage("assets/img/uiManager/button/startBtn.png");
  restartBtnImg = loadImage("assets/img/uiManager/button/restartBtn.png");
  tutorialBtnImg = loadImage("assets/img/uiManager/button/tutorialBtn.png");
  homeBtnImg = loadImage("assets/img/uiManager/button/homeBtn.png");
  levelEggImgs.push(loadImage("assets/img/uiManager/egg/level1_egg.png"));
  levelEggImgs.push(loadImage("assets/img/uiManager/egg/level2_egg.png"));
  levelEggImgs.push(loadImage("assets/img/uiManager/egg/level3_egg.png"));
  //Enemies(Bad Bunny, Ant and Bee)
  for (let i = 1; i <= 3; i++) {
    badbunnyImgs.push(loadImage(`assets/img/enemy/badbunny/bunny-${i}.png`));
  }


  for (let i = 1; i <= 8; i++) {
    antImgs.push(loadImage(`assets/img/enemy/ant/ant-${i}.png`));
  }

  for (let i = 1; i <= 8; i++) {
    beeImgs.push(loadImage(`assets/img/enemy/bee/bee-${i}.png`));
  }

  sfx.bgm = loadSound("assets/sfx/bgm.mp3");
  sfx.chose = loadSound("assets/sfx/chose.wav");
  sfx.chose.setVolume(0.6);
  sfx.startGame = loadSound("assets/sfx/startGame.wav");
  sfx.startGame.setVolume(0.6);
  sfx.death = loadSound("assets/sfx/death.wav");
  sfx.pass = loadSound("assets/sfx/pass.wav");
  sfx.getKey = loadSound("assets/sfx/getKey.wav");
  sfx.hurt = loadSound("assets/sfx/hurt.wav");
  sfx.heal = loadSound("assets/sfx/heal.wav");
  sfx.heal.setVolume(0.8);
  sfx.shoot = loadSound("assets/sfx/shoot.wav");
  sfx.jump = loadSound("assets/sfx/jump.wav");
  sfx.jump.setVolume(0.6);
  sfx.land = loadSound("assets/sfx/land.wav");
  sfx.stick = loadSound("assets/sfx/stick.wav");
  sfx.stick.setVolume(1.2);
  sfx.stomp = loadSound("assets/sfx/stomp.wav");
  sfx.stomp.setVolume(1.2);
  sfx.transform = loadSound('assets/sfx/transform.wav');
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

  sfx.bgm.setLoop(true);
  sfx.bgm.play();
  
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
  } else if (gameState === "CUTSCENE") {
    let img = currentCutscene[cutsceneIndex];
    image(img, 0, 0, width, height);
  } else if (gameState === "PLAYING") {
    if (levelManager.currentLevel === 0) {
      let tutorialTexts = levelManager.getTutorialTexts(tutorialTextImg);
      for (let text of tutorialTexts) {
        if (player.pos.x >= text.triggerX && player.pos.x < text.endX) {
          let imgW = 1000;
          let imgH = uiManager.getScaledHeight(text.img, imgW);
          image(text.img, width / 2 - imgW / 2, 100, imgW, imgH);
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
      sfx.death.play();
      gameState = "GAMEOVER";
      return;
    }

    if (levelManager.isReachedGoal(player, uiManager)) {
      saveManager.completeLevel(levelManager.currentLevel);
      if (levelManager.nextLevel()) {
        sfx.pass.play();
        initGame();
        if (currentCutscene.length > 0) {
          gameState = 'CUTSCENE';
        } else {
          gameState = 'PLAYING';
        }
      } else {
        gameState = "GAMECLEAR";
        return;
      }
    }

    let targetCamX = -player.pos.x + width / 2;
    let targetCamY = levelManager.currentLevel === 3 ? -player.pos.y + height * 0.8 : 0;
    //Fix the camera by Chuck
    let safeGridHeight = mapManager.gridHeight ? mapManager.gridHeight : 1500;
    
    let smoothCamY = levelManager.currentLevel === 3 ? constrain(targetCamY, -(safeGridHeight - height), 0) : 0;
    //Chuck
    camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
    // camY = levelManager.currentLevel === 3 ? constrain(targetCamY, -(mapManager.gridHeight - height), 0) : 0;
    camY = lerp(camY, smoothCamY, 0.1);

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
    

    mapManager.display(tileSetImg, bushImg, pointerImg, downPointerImg, fenceImg, treeImg, willowImg, ridgeImg, grassDecoImg);
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

  player.onMousePressed(mouseButton)

  if (gameState === "START") {
    if (uiManager.isStartButtonClicked(mouseX, mouseY)) {
      sfx.startGame.play();
      gameState = "LEVEL_SELECT";
    } else if (uiManager.isTutorialButtonClicked(mouseX, mouseY)) {
      levelManager.currentLevel = 0;
      initGame();
      sfx.chose.play();
      gameState = 'PLAYING';
    }
  } else if (gameState === "LEVEL_SELECT") {
    let level = uiManager.getLevelClicked(mouseX, mouseY);
    if (level !== -1) {
      levelManager.currentLevel = level;
      initGame();
      if (currentCutscene.length > 0) {
        sfx.chose.play();
        gameState = "CUTSCENE";
      } else {
        sfx.chose.play();
        gameState = "PLAYING";
      }
    }
  } else if (gameState === "GAMEOVER") {
    if (uiManager.isRestartButtonClicked(mouseX, mouseY)) {
      sfx.startGame.play();
      resetGame();
    } else if (uiManager.isHomeButtonClicked(mouseX, mouseY)) {
      levelManager.currentLevel = 1;
      sfx.startGame.play();
      resetGame();
      gameState = "START";
    }
  } else if (gameState === "CUTSCENE") {
    cutsceneIndex++;
    if (cutsceneIndex >= currentCutscene.length) {
      sfx.chose.play();
      gameState = "PLAYING";
    }
  } else if (gameState === "GAMECLEAR") {
    if (uiManager.isHomeButtonClicked(mouseX, mouseY)) {
      levelManager.currentLevel = 1;
      sfx.startGame.play();
      resetGame();
      gameState = "START";
    }
  }
}

function mouseReleased() {
  if (!uiManager) return;
  player.onMouseReleased(mouseButton)
}


function initGame() {
  entities = [];
  uiManager.currentHearts = uiManager.maxHearts;
  uiManager.currentKeys = 0;
  uiManager.hasEgg = false;
  uiManager.eggCount = 0;
  currentCutscene = levelManager.getCutscenes(levelManager.currentLevel, cutsceneImgs);
  cutsceneIndex = 0;
  camX = 0;
  camY = 0;

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
    player = new Player(6150, 800, 72, 48, playerImg);
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

function keyPressed() {
  if (keyCode === 87) {
    player.onJumpPressed();
  }

  // for testing
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
