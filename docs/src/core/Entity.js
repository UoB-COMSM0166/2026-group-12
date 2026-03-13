class Entity {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;

    this.active = true;
  }

  update() {
    throw new Error("Missing update() implementation");
  }

  display() {
    throw new Error("Missing display() implementation");
  }

  get left()   { return this.pos.x; }
  get right()  { return this.pos.x + this.width; }
  get top()    { return this.pos.y; }
  get bottom() { return this.pos.y + this.height; }

}