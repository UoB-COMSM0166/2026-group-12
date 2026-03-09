let player;
let mapManager;
let mapData;
let gameStats = { score: 0 }; // 新增：初始化計分系統
let tilesetImg;
let enemyImg;
let entities = [];
let heartImg;
let physics;
let currentLevel = 2;
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
  // 阻斷右鍵選單，以便使用右鍵攻擊
  canvas.elt.oncontextmenu = () => false;

  // 重啟遊戲時清空陣列，避免物件重疊
  entities = [];

  //玩家定義區
  mapManager = new MapManager(currentLevel === 1 ? mapData : mapData2);
  uiManager = new UIManager();
  physics = new Physics(mapManager);

  if (currentLevel === 1) {
    player = new Player(100, 50, 72, 48, playerImg);
    entities.push(player);

    // 怪物定義區(x, y, 寬, 高, 影像)
    // 敵人 1
    // ===TO BE ALTERED===
    entities.push(new Enemy(600, 400, 50, 50, enemyImg));

    // 敵人 2
    entities.push(new Enemy(1200, 400, 50, 50, enemyImg));

    // 敵人 3
    entities.push(new Enemy(1800, 300, 100, 100, enemyImg));

    // 建立金幣
    let coin = new Coin(980, 480, 30, 30);
    entities.push(coin);
  } else if (currentLevel === 2) {
    player = new Player(100, 1572, 72, 48, playerImg);
    entities.push(player);
  }
}

function draw() {
  background(173, 228, 249);

  //角色死亡
  if (player.isDead) {
    // 方案 A：直接重啟遊戲
    setup();

    // 方案 B：顯示死亡畫面
    /*
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
    noLoop(); // 停止遊戲迴圈
    */
    return; // 結束這一幀，不執行後面的 update 和 display
  }

  // 過關條件
  if (player.pos.x >= mapManager.gridWidth - player.width) {
    currentLevel++;
    setup();
    return;
  }

  let targetCamX = -player.pos.x + width / 2;
  let targetCamY = currentLevel === 1 ? 0 : -player.pos.y + height * 0.8;
  let camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
  let camY =
    currentLevel === 1 ? 0 : constrain(targetCamY, -mapManager.gridHeight, 0);

  // 1. Update 階段 (維持不變)
  for (let e of entities) {
    // 修改：傳入 entities 給玩家進行主動攻擊判定
    if (e === player) {
      e.update(mapManager, physics, camY);
    } else {
      e.update(mapManager);
    }

    if (e !== player) {
      if (overlaps(player, e)) {
        e.onCollide(player);
      }
    }
  }

  // 移除已經「死亡」的物件（例如被吃掉的金幣）
  entities = entities.filter((e) => !e.isDead);

  // --- 相機邏輯開始 ---
  push();

  // 執行畫布偏移
  translate(camX, camY);

  // 2. Display 階段 (這些東西會隨著相機移動)
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

  // 3. UI 階段 (放在 pop 之後，才會固定在螢幕上)
  uiManager.display(heartImg);
}

function overlaps(a, b) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}
