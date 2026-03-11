class GrappleSystem {
    constructor(player) {
        this.player = player
        this.active = false
        this.anchor = createVector(0,0)
        this.ropeLength = 0
        this.maxLength = 400

        // Speed
        this.retractSpeed = 2
        this.extendSpeed = 2
        this.baseSwingForce = 0.25

        // tongue appear
        this.tongueFlying = false
        this.tonguePos = createVector(0,0)
        this.tongueTimer = 0 
        this.tongueDuration = 5 
    }

    shoot(targetX, targetY) {
        let p = this.player.pos.copy()
        p.x += this.player.width / 2
        p.y += this.player.height / 2

        let d = dist(p.x, p.y, targetX, targetY)
        if (d > this.maxLength) return

        this.tongueFlying = true
        this.tonguePos.set(targetX, targetY)
        this.tongueTimer = this.tongueDuration 

        if (mapManager.isGrapplePoint(targetX, targetY)) {
            this.anchor.set(targetX, targetY)
            this.ropeLength = d
            this.active = true
            this.player.state = PlayerState.GRAPPLE
            this.tongueFlying = false
        }
    }

    adjust() {
        if (!this.active) return
        if (keyIsDown(87)) this.ropeLength -= this.retractSpeed
        if (keyIsDown(83)) this.ropeLength += this.extendSpeed
        this.ropeLength = constrain(this.ropeLength, 40, this.maxLength)
    }

    swing() {
        if (!this.active) return
        let player = this.player
        let delta = p5.Vector.sub(player.pos, this.anchor)
        if (delta.mag() === 0) return
        let tangent = createVector(-delta.y, delta.x).normalize()
        let swingForce = this.baseSwingForce * map(this.ropeLength, 40, this.maxLength, 1.5, 0.5)
        if (keyIsDown(65)) player.vel.add(p5.Vector.mult(tangent, swingForce))
        if (keyIsDown(68)) player.vel.add(p5.Vector.mult(tangent, -swingForce))
    }

    release() {
        if (!this.active) return
        this.active = false
        if (this.player.state === PlayerState.GRAPPLE) this.player.state = PlayerState.FALL
    }

    update() {
        if (this.tongueFlying) {
            this.tongueTimer--
            if (this.tongueTimer <= 0) {
                this.tongueFlying = false
            }
        }

        if (this.active) {
            let player = this.player
            this.adjust()
            this.swing()
            let delta = p5.Vector.sub(player.pos, this.anchor)
            let distance = delta.mag()
            let error = distance - this.ropeLength
            let dir = delta.copy().normalize()
            player.pos.sub(p5.Vector.mult(dir, error))
            let velDot = p5.Vector.dot(player.vel, dir)
            player.vel.sub(p5.Vector.mult(dir, velDot))
        }
    }

    display() {
        let p = this.player.pos
        let px = (this.player.facing === -1) ? p.x + this.player.width * 0.85 : p.x + this.player.width * 0.15
        let py = p.y + this.player.height * 0.35

        if (this.tongueFlying) {
            stroke(255,130,130)
            strokeWeight(4)
            line(px, py, this.tonguePos.x, this.tonguePos.y)
            noStroke()
        }

        // hooked tongue
        if (this.active) {
            stroke(255,130,130)
            strokeWeight(4)
            line(px, py, this.anchor.x, this.anchor.y)
            noStroke()
        }
    }
}