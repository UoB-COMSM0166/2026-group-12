class MapManager {
  constructor(data) {
    this.data = data;
    this.tileSize = 60;
    this.cols = data.width;
    this.rows = data.height;
    this.tileMap = data.layers[0].data;

    // Calculate the total width of the world and use it for the Camera.
    this.gridWidth = this.cols * this.tileSize;
    this.gridHeight = this.rows * this.tileSize;

    // Obtain the first layer of map data
    this.tileMap = data.layers[0].data;
    this.walls = [];

    this.tilesets = {};
    for (let ts of data.tilesets) {
      let name = ts.source.replace(/.*\//, "").replace(".tsx", "");
      this.tilesets[name] = ts.firstgid;
    }
  }

  isSolid(tileX, tileY) {
    if (tileX < 0 || tileX >= this.cols || tileY < 0 || tileY >= this.rows)
      return false;
    let id = this.tileMap[tileX + tileY * this.cols] || 0;
    if (id === 0) return false;

    let t = this.tilesets;
    let decorRanges = [
      [t.bushes, t.bushes + 2],
      [t.pointers, t.pointers + 1],
      [t.fences, t.fences + 1],
      [t.trees, t.trees + 12],
      [t.willows, t.willows + 12],
      [t.ridges, t.ridges + 3],
      [t.grass, t.grass + 1],
    ];

    for (let [start, end] of decorRanges) {
      if (id >= start && id < end) return false;
    }

    return true;
  }

  isGrapplePoint(x, y) {
    let id = this.getTileAt(x, y);
    let t = this.tilesets;
    return id === t.map_tileset + 14;
  }

  notGrapplePoint(x, y) {
    let id = this.getTileAt(x, y);
    let t = this.tilesets;
    // TO DO: isSolid but not grapple point (for tongue retreat)
    // return id === t.map_tileset + 14;
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

  display(
    tilesetImg,
    bushImg,
    pointerImg,
    fenceImg,
    treeImg,
    willowImg,
    ridgeImg,
    grassImg,
  ) {
    let t = this.tilesets;

    for (let i = 0; i < this.tileMap.length; i++) {
      let id = this.tileMap[i];
      if (id === 0) continue;

      let x = (i % this.cols) * this.tileSize;
      let y = Math.floor(i / this.cols) * this.tileSize;

      if (id >= t.map_tileset && id < t.map_tileset + 60) {
        let localId = id - t.map_tileset;
        let srcX = (localId % 10) * 32;
        let srcY = Math.floor(localId / 10) * 32;
        image(tilesetImg, x, y, 60, 60, srcX, srcY, 32, 32);
      } else if (id >= t.bushes && id < t.bushes + 2) {
        let srcX = (id - t.bushes) * 32;
        image(bushImg, x, y, 60, 60, srcX, 0, 32, 32);
      } else if (id === t.pointers) {
        image(pointerImg, x, y, 60, 60, 0, 0, 32, 32);
      } else if (id === t.fences) {
        image(fenceImg, x, y, 60, 60, 0, 0, 32, 32);
      } else if (id >= t.trees && id < t.trees + 12) {
        let localId = id - t.trees;
        let srcX = (localId % 3) * 32;
        let srcY = Math.floor(localId / 3) * 32;
        image(treeImg, x, y, 60, 60, srcX, srcY, 32, 32);
      } else if (id >= t.willows && id < t.willows + 12) {
        let localId = id - t.willows;
        let srcX = (localId % 3) * 32;
        let srcY = Math.floor(localId / 3) * 32;
        image(willowImg, x, y, 60, 60, srcX, srcY, 32, 32);
      } else if (id >= t.ridges && id < t.ridges + 3) {
        let srcX = (id - t.ridges) * 32;
        image(ridgeImg, x, y, 60, 60, srcX, 0, 32, 32);
      } else if (id === t.grass) {
        image(grassImg, x, y, 60, 60, 0, 0, 32, 32);
      }
    }
  }
}
