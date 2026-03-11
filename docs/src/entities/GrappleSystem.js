class GrappleSystem {
    constructor(player) {
        this.player = player
        this.active = false
        this.anchor = createVector(0,0)
        this.ropeLength = 0
        this.maxLength = 400
        // Speed
        this.retractSpeed = 4
        this.extendSpeed = 4
        // Force
        this.baseSwingForce = 0.2
    }

    shoot(targetX, targetY) {
        let p = this.player.pos.copy()
        p.x += this.player.width / 2
        p.y += this.player.height / 2

        let d = dist(p.x, p.y, targetX, targetY)

        if (d > this.maxLength) return
        // if (!tileMap.isGrapplePoint(targetX, targetY)) return

        if (!mapManager.isGrapplePoint(targetX, targetY)) return;

        this.anchor.set(targetX, targetY)
        this.ropeLength = d
        this.active = true
        this.player.state = PlayerState.GRAPPLE
    }

    adjust(){
        if (!this.active) return

        if (keyIsDown(87)) { // W
            this.ropeLength -= this.retractSpeed
        }

        if (keyIsDown(83)) { // S
            this.ropeLength += this.extendSpeed
        }

        this.ropeLength = constrain(this.ropeLength, 40, this.maxLength)
    }

    swing(){
        if (!this.active) return

        let player = this.player
        let delta = p5.Vector.sub(player.pos, this.anchor)

        if (delta.mag() === 0) return

        // tangent vector (perpendicular to rope)
        let tangent = createVector(-delta.y, delta.x)
        tangent.normalize()

        let swingFactor = map(this.ropeLength, 40, this.maxLength, 1.5, 0.5)
        let swingForce = this.baseSwingForce * swingFactor

        if (keyIsDown(65)) { // A
            player.vel.add(p5.Vector.mult(tangent, swingForce))
        }

        if (keyIsDown(68)) { // D
            player.vel.add(p5.Vector.mult(tangent, -swingForce))
        }
    }

    release() {
        if (!this.active) return

        this.active = false
        if (this.player.state === PlayerState.GRAPPLE){
            this.player.state = PlayerState.FALL
        }
    }

    update() {
        if (!this.active) return

        let player = this.player

        this.adjust()
        this.swing()

        let delta = p5.Vector.sub(player.pos, this.anchor)
        let dist = delta.mag()
        let error = dist - this.ropeLength
        let dir = delta.copy().normalize()

        player.pos.sub(p5.Vector.mult(dir, error))

        let velDot = p5.Vector.dot(player.vel, dir)
        player.vel.sub(p5.Vector.mult(dir, velDot))
    }

    display() {
        if (!this.active) return

        let p = this.player.pos
        let px
        if (this.player.facing === -1) {
            px = p.x + this.player.width * 0.85   // 右邊嘴巴
        } else {
            px = p.x + this.player.width * 0.15   // 左邊嘴巴
        }

        let py = p.y + this.player.height * 0.35


        stroke(255, 130, 130)
        strokeWeight(4)
        line(px, py, this.anchor.x, this.anchor.y)
        noStroke()
    }

}
