let player;
let mapManager;
let mapData;
let gameStats = { score: 0 }; 
let tilesetImg;
let enemyImg;
let entities = [];
let heartImg;
let uiManager;

function preload() {
  mapData = loadJSON('assets/map/level_1.json');
  playerImg = loadImage('assets/img/player_idle.png');
  tilesetImg = loadImage('assets/img/Tiles/grass.png'); 
  enemyImg = loadImage('assets/img/snake.png'); 
  heartImg = loadImage('assets/img/heart.png');
  stoneImg = loadImage('assets/img/Tiles/stone.png');
}

function setup() {
  let canvas = createCanvas(1000, 840);
  canvas.elt.oncontextmenu = () => false;

  entities = [];
  
  mapManager = new MapManager(mapData);
  uiManager = new UIManager(); // 初始化 UIManager
  player = new Player(100, 50, 72, 48, playerImg);
  entities.push(player);

  // --- 怪物與物品定義 ---
  entities.push(new Enemy(600, 400, 50, 50, enemyImg));
  entities.push(new Enemy(1200, 400, 50, 50, enemyImg));
  entities.push(new Enemy(1800, 300, 100, 100, enemyImg));
  entities.push(new Coin(980, 480));

  // 新增：在遊戲後方放置目標「蛋」
  // 這裡設定在 (2200, 400)，並帶入當前關卡編號
  entities.push(new Goal(2200, 400, uiManager.currentLevel)); 
}

function draw() {
  background(173, 228, 249);

  if (player.isDead) {
    setup(); 
    return; 
  }

  // 1. Update 階段
  // 只有在 PLAYING 狀態下才執行更新邏輯
  if (uiManager.gameState === "PLAYING") {
    for (let e of entities) {
      if (e === player) {
        e.update(mapManager, entities);
      } else if (e instanceof Goal) {
        e.update(); // 更新蛋的碰撞與動畫
      } else {
        e.update(mapManager);
      }
      
      if (e !== player && typeof e.checkPlayerCollision === 'function') {
        e.checkPlayerCollision(player);
      }
    }
  }

  entities = entities.filter(e => !e.isDead);

  // --- 相機邏輯 ---
  push(); 
  let targetCamX = -player.pos.x + width / 2;
  let camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
  translate(camX, 0);

  mapManager.display(tilesetImg, stoneImg);
  for (let e of entities) {
    e.display();
  }
  pop(); 

  // 3. UI 階段 (固定在螢幕上)
  uiManager.display(heartImg);
}

// 監聽點擊，處理 UIManager 的 Continue 按鈕功能
function mousePressed() {
  uiManager.handleMousePressed();
}

// ==========================================
// 新增：目標蛋類別 (帶有飄浮動畫)
// ==========================================
class Goal {
  constructor(x, y, level) {
    this.baseX = x;
    this.baseY = y;
    this.y = y;
    this.level = level;
    this.size = 60;
    this.isDead = false;
    this.floatOffset = 0; // 用於計算飄浮
  }

  update() {
    // 1. 飄浮動畫邏輯
    // 使用 sin 函式讓 offset 在 -10 到 10 之間規律變動
    this.floatOffset = sin(frameCount * 0.05) * 10;
    this.y = this.baseY + this.floatOffset;

    // 2. 碰撞偵測 (與主角的距離)
    let d = dist(player.pos.x, player.pos.y, this.baseX, this.y);
    if (d < this.size) {
      this.isDead = true; 
      // 觸發 UIManager 轉場
      uiManager.levelComplete(this.level); 
    }
  }

  display() {
    // 呼叫 UIManager 的繪圖方法畫出編號蛋
    uiManager.drawPixelEgg(this.baseX, this.y, this.size, this.level);
  }
}