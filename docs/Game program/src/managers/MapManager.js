class MapManager {
  constructor(data) {
    this.data = data;
    this.tileSize = data.tilewidth;
    this.cols = data.width;
    this.rows = data.height;
    this.tileMap = data.layers[0].data;
    
    // Calculate the total width of the world and use it for the Camera.
    this.gridWidth = this.cols * this.tileSize;
    this.gridHeight = this.rows * this.tileSize;
    
    // Obtain the first layer of map data
    this.tileMap = data.layers[0].data;
    this.walls = [];
  }


  isSolid(tileX, tileY) {
    if (tileX < 0 || tileX >= this.cols || tileY < 0 || tileY >= this.rows) return false;
    let index = tileX + tileY * this.cols;
    return (this.tileMap[index] || 0) !== 0;
  }

  isGrapplePoint(targetX, targetY){

  }


  getWalls() {
    let walls = [];
    for (let i = 0; i < this.tileMap.length; i++) {
      let id = this.tileMap[i];
      if (id !== 0) {
        let x = (i % this.cols) * this.tileSize;
        let y = Math.floor(i / this.cols) * this.tileSize;
        walls.push({ x: x, y: y, w: this.tileSize, h: this.tileSize });
      }
    }
    return walls;
  }

  getTileAt(worldX, worldY) {
    let col = Math.floor(worldX / this.tileSize);
    let row = Math.floor(worldY / this.tileSize);

    // Check if the index exceeds the map boundary.
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return 0;

    let index = col + row * this.cols;
    return this.tileMap[index] || 0;
  }

  display(grassImg, stoneImg){
    let sourceTileSize = 60;

    for (let i = 0; i < this.tileMap.length; i++) {
      let id = this.tileMap[i];
      if (id === 0) continue;

      let x = (i % this.cols) * this.tileSize;
      let y = Math.floor(i / this.cols) * this.tileSize;

      if (id === 1) {
        image(grassImg, x, y, this.tileSize, this.tileSize, 0, 0, sourceTileSize, sourceTileSize);
      } else if (id === 2) {
        image(stoneImg, x, y, this.tileSize, this.tileSize, 0, 0, sourceTileSize, sourceTileSize);
      }
    }
  }
}