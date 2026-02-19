let player;
let mapManager;
let mapData;
let coin;
let entities = [];

function preload() {
  mapData = loadJSON('assets/map/level_1.json');
  playerImg = loadImage('assets/img/player_idle.png'); 
}

function setup() {
  createCanvas(1000, 600);
  mapManager = new MapManager(mapData);
  player = new Player(100,50, playerImg);
  entities.push(player);
  coin = new Coin(980,480);
  entities.push(coin);
}

function draw() {
  background(173, 228, 249);

  // 1. Update 階段 (維持不變)
  for (let e of entities) {
    e.update(mapManager);
  }

  // --- 相機邏輯開始 ---
  push(); 

  // 主角出現在畫面水平中心
  let targetCamX = -player.pos.x + width / 2;

  // 限制相機邊界：不讓相機拍到地圖左側(0)以外或右側(地圖寬度)以外
  let camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);

  // 執行畫布偏移
  translate(camX, 0); 

  // 2. Display 階段 (這些東西會隨著相機移動)
  mapManager.display();
  for (let e of entities) {
    e.display();
  }

  pop(); 
  // --- 相機邏輯結束 ---

  // 3. UI 階段 (放在 pop 之後，才會固定在螢幕上)
  // UIManager.display(); 
}