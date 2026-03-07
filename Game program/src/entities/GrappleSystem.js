class GrappleSystem {
    constructor(player) {
        this.player = player
        this.active = false
        this.anchor = createVector(0,0)
        this.ropeLength = 0
        this.maxLength = 300
    }

    shoot(targetX, targetY, tileMap) {
        let p = this.player.position

        let d = dist(p.x, p.y, targetX, targetY)

        // check if tongue could reach the grapple point
        if (d > this.maxLength) return
        if (!tileMap.isGrapplePoint(targetX, targetY)) return

        this.anchor.set(targetX, targetY)

        this.ropeLength = d

        this.active = true
    }

    // tongue's length can be adjusted by pressing 'w' or 's'
    adjust(){
        // TO BE IMPLEMENTED
    }

    // control the accelerate and direction by pressing 'a' or 'd'
    swing(){
        // TO BE IMPLEMENTED
    }
    release() {
        this.active = false
    }

    update() {
        if (!this.active) return

        let player = this.player

        let delta = p5.Vector.sub(player.position, this.anchor)

        let dist = delta.mag()

        let error = dist - this.ropeLength

        let dir = delta.normalize()

        player.position.sub(p5.Vector.mult(dir, error))

        let velDot = p5.Vector.dot(player.velocity, dir)

        player.velocity.sub(p5.Vector.mult(dir, velDot))

    }

}