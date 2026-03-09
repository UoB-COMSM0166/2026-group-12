let player;
let mapManager;
let mapData;
let gameStats = { score: 0 };
let tilesetImg;
let enemyImg;
let entities = [];
let heartImg;
let physics;
let uiManager;
let currentLevel = 1;
let mapData2;
let stoneImg;

function preload() {
  mapData = loadJSON("assets/map/level_1.json");
  mapData2 = loadJSON("assets/map/level_2.json");
  playerImg = loadImage("assets/img/player_idle.png");
  tilesetImg = loadImage("assets/img/Tiles/grass.png");
  enemyImg = loadImage("assets/img/snake.png");
  heartImg = loadImage("assets/img/heart.png");
  stoneImg = loadImage("assets/img/Tiles/stone.png");
}

function setup() {
  let canvas = createCanvas(1000, 840);
  canvas.elt.oncontextmenu = () => false;

  entities = [];

  mapManager = new MapManager(currentLevel === 1 ? mapData : mapData2);
  uiManager = new UIManager();
  physics = new Physics(mapManager);

  if (currentLevel === 1) {
    player = new Player(100, 50, 72, 48, playerImg);
    entities.push(player);
    entities.push(new Enemy(600, 400, 50, 50, enemyImg));
    entities.push(new Enemy(1200, 400, 50, 50, enemyImg));
    entities.push(new Enemy(1800, 300, 100, 100, enemyImg));
    let coin = new Coin(980, 480, 30, 30);
    entities.push(coin);
    entities.push(new Goal(2200, 400, uiManager.currentLevel));
  } else if (currentLevel === 2) {
    player = new Player(100, 1572, 72, 48, playerImg);
    entities.push(player);
  }
}

function draw() {
  background(173, 228, 249);

  if (player.isDead) {
    setup();
    return;
  }

  // 過關條件
  if (player.pos.x >= mapManager.gridWidth - player.width) {
    if (currentLevel < 2) {
      currentLevel++;
      setup();
    }
    return;
  }

  let targetCamX = -player.pos.x + width / 2;
  let targetCamY = currentLevel === 1 ? 0 : -player.pos.y + height * 0.8;
  let camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
  let camY = currentLevel === 1 ? 0 : constrain(targetCamY, -mapManager.gridHeight, 0);

  // 1. Update 階段
  for (let e of entities) {
    if (e === player) {
      e.update(mapManager, physics);
    } else if (e instanceof Goal) {
      e.update();
    } else {
      e.update(mapManager);
    }

    if (e !== player) {
      if (overlaps(player, e)) {
        e.onCollide(player);
      }
    }
  }

  entities = entities.filter((e) => !e.isDead);

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

function mousePressed() {
  uiManager.handleMousePressed();
}

function overlaps(a, b) {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}

class Goal {
  constructor(x, y, level) {
    this.baseX = x;
    this.baseY = y;
    this.y = y;
    this.level = level;
    this.size = 60;
    this.isDead = false;
    this.floatOffset = 0;
  }

  update() {
    this.floatOffset = sin(frameCount * 0.05) * 10;
    this.y = this.baseY + this.floatOffset;

    let d = dist(player.pos.x, player.pos.y, this.baseX, this.y);
    if (d < this.size) {
      this.isDead = true;
      uiManager.levelComplete(this.level);
    }
  }

  display() {
    uiManager.drawPixelEgg(this.baseX, this.y, this.size, this.level);
  }
}