class Figure extends Entity {
    constructor(x, y, w, h, type) {
        super(x, y, w, h, type);
        this.vel = createVector(0, 0);

        this.isDead = false;

        // in order to determine whether an operation is possible, and change the animation
        this.onGround = false

        /*
        this.onWallLeft = false
        this.onWallRight = false
        this.hitCeiling = false
         */

    }


    resetCollisionState() {
        this.onGround = false
        this.onWallLeft = false
        this.onWallRight = false
        this.hitCeiling = false
    }

}