class MapManager {
  constructor(data) {
    this.data = data;
    this.tileSize = data.tilewidth;
    this.cols = data.width;
    //this.rows = data.height;
    this.tileMap = data.layers[0].data;
    this.gridWidth = this.cols * this.tileSize;
    
    // 計算世界總寬度，給 Camera 使用
    this.gridWidth = this.cols * this.tileSize;
    
    // 取得第一層地圖數據 (Tiled 的 data 是一維陣列)
    this.tileMap = data.layers[0].data;
    this.walls = []; // 存儲牆壁物件供物理引擎查詢
  }


  getWalls() {
    let walls = [];
    for (let i = 0; i < this.tileMap.length; i++) {
      let id = this.tileMap[i];
      if (id !== 0) { // 假設 ID 不等於 0 的都是地板
        let x = (i % this.cols) * this.tileSize;
        let y = Math.floor(i / this.cols) * this.tileSize;
        walls.push({ x: x, y: y, w: this.tileSize, h: this.tileSize });
      }
    }
    return walls;
  }
  // 在 MapManager.js 類別內新增
getTileAt(worldX, worldY) {
  let col = Math.floor(worldX / this.tileSize);
  let row = Math.floor(worldY / this.tileSize);

  // 檢查索引是否超出地圖邊界
  if (col < 0 || col >= this.cols || row < 0) return 0;

  let index = col + row * this.cols;
  return this.tileMap[index] || 0; // 回傳該位置的 Tile ID
}

 // 修改：將 display 放入類別內，並動態計算圖片偏移
  display(tilesetImg) {
    // 新增一個變數定義「圖片裡」的圖塊大小
    let sourceTileSize = 31;
    // 動態計算你的圖片一列有幾個圖塊
    let tilesPerRow = Math.floor(tilesetImg.width / this.tileSize);

    for (let i = 0; i < this.tileMap.length; i++) {
      let id = this.tileMap[i];
      if (id === 0) continue; 

      let x = (i % this.cols) * this.tileSize;
      let y = Math.floor(i / this.cols) * this.tileSize;
      
      // 計算該 ID 在圖片中的位置 (gid = id - 1)
      let gid = id - 1; 
      let sx = (gid % tilesPerRow) * sourceTileSize; // 從圖片 31 像素的地方開始切
      let sy = Math.floor(gid / tilesPerRow) * sourceTileSize;

      // image(圖片, x, y, 顯示寬, 顯示高, 裁切x, 裁切y, 裁切寬, 裁切高)
      // 這裡會把 31x31 的圖片拉伸成 60x60 顯示
      image(tilesetImg, x, y, this.tileSize, this.tileSize, sx, sy, sourceTileSize, sourceTileSize);
    }
  }
}


