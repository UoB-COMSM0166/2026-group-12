class MapManager {
  constructor(data) {
    this.data = data;
    this.tileSize = data.tilewidth;
    this.cols = data.width;
    this.rows = data.height;
    
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

  display() {
    for (let i = 0; i < this.tileMap.length; i++) {
      let id = this.tileMap[i];
      if (id === 0) continue; // 跳過空地

      let x = (i % this.cols) * this.tileSize;
      let y = Math.floor(i / this.cols) * this.tileSize;
      
      // 這裡簡單畫個方塊，進階的話可以用 tilesetImg 擷取對應圖塊
      fill(255, 230, 99);
      rect(x, y, this.tileSize, this.tileSize);
    }
  }
}