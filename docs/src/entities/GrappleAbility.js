class GrappleAbility {
    constructor(player) {
        this.player = player

        // Grapple state
        this.active = false                  // Whether the rope is currently attached
        this.anchor = createVector(0, 0)     // Anchor point
        this.ropeLength = 0                  // Current rope length
        this.maxLength = 400                 // Maximum rope length

        // Swing mechanics
        this.retractSpeed = 2                // Speed when shortening the rope (W key)
        this.extendSpeed = 2                 // Speed when extending the rope (S key)
        this.baseSwingForce = 0.25           // Force applied when swinging

        // Tongue animation state
        this.tongueFlying = false            // Whether the tongue is animating
        this.tonguePos = createVector(0, 0)  // Tongue tip position

        this.tongueStart = createVector(0, 0)   // Starting point of the tongue
        this.tongueTarget = createVector(0, 0)  // Target point of the tongue

        this.tongueProgress = 0              // Progress of animation (0 → 1 → 0)
        this.tongueReturning = false         // Whether the tongue is returning

        // Animation speeds
        this.tongueOutSpeed = 0.18           // Speed of tongue extending
        this.tongueReturnSpeed = 0.4         // Speed of tongue returning

        // Pause at extension
        this.tonguePauseTimer = 0
        this.tonguePauseDuration = 15
    }

    shoot(targetX, targetY) {
    // Prevent shooting if already grappling or animating
    if (this.active || this.tongueFlying) {
        return false
    }

    // Player center
    let p = this.player.pos.copy()
    p.x += this.player.width / 2
    p.y += this.player.height / 2

    // Check range
    let d = dist(p.x, p.y, targetX, targetY)
    if (d > this.maxLength) {
        return false
    }

    // Ray direction
    let dir = createVector(targetX - p.x, targetY - p.y).normalize()

    // ---- 射線：先檢查牆 / GrapplePoint，再決定真正的目標 ----
    let stepSize = 5
    let steps = floor(d / stepSize)

    let hitGrapple = false
    let gx = targetX
    let gy = targetY

    for (let i = 1; i <= steps; i++) {
        let cx = p.x + dir.x * stepSize * i
        let cy = p.y + dir.y * stepSize * i

        // 先看有沒有打到 GrapplePoint
        if (mapManager.isGrapplePoint(cx, cy)) {
            hitGrapple = true
            gx = cx
            gy = cy
            d = dist(p.x, p.y, gx, gy)
            break
        }

        // 再看有沒有撞到牆（非 0 tile）
        if (mapManager.getTileAt(cx, cy) !== 0) {
            // 撞牆：舌頭只到牆前一格，然後不黏
            let bx = p.x + dir.x * stepSize * (i - 1)
            let by = p.y + dir.y * stepSize * (i - 1)

            this.tongueStart.set(p.x, p.y)
            this.tongueTarget.set(bx, by)
            this.tongueProgress = 0
            this.tongueReturning = false
            this.tonguePauseTimer = 0
            this.tongueFlying = true

            this.active = false
            return false
        }
    }

    // ---- 根據射線結果決定：黏 or 只播動畫 ----

    if (hitGrapple) {
        // 有打到 GrapplePoint → 黏住
        this.tongueStart.set(p.x, p.y)
        this.tongueTarget.set(gx, gy)
        this.tongueProgress = 0
        this.tongueReturning = false
        this.tonguePauseTimer = 0
        this.tongueFlying = false   // 直接黏，不播來回動畫

        this.anchor.set(gx, gy)
        this.ropeLength = d
        this.active = true
        return true
    } 
    else {
        // 沒牆、沒 GrapplePoint → 保持你原本的「只播舌頭動畫，不黏」
        this.tongueStart.set(p.x, p.y)
        this.tongueTarget.set(targetX, targetY)
        this.tongueProgress = 0
        this.tongueReturning = false
        this.tonguePauseTimer = 0
        this.tongueFlying = true

        this.active = false
        return false
    }
}


    adjust() {
        if (!this.active) {
            return
        }

        if (keyIsDown(87)) {
            this.ropeLength -= this.retractSpeed   // W key → shorten
        }   
        if (keyIsDown(83)) {
            this.ropeLength += this.extendSpeed    // S key → extend
        }
        this.ropeLength = constrain(this.ropeLength, 40, this.maxLength)
    }

    swing() {
        if (!this.active) {
            return
        }

        let player = this.player

        let delta = p5.Vector.sub(player.pos, this.anchor)
        if (delta.mag() === 0) return

        // Perpendicular direction for swinging
        let tangent = createVector(-delta.y, delta.x).normalize()

        // Swing force scales with rope length (short rope = stronger swing)
        let swingForce = this.baseSwingForce *
            map(this.ropeLength, 40, this.maxLength, 1.5, 0.5)

        // A/D keys control swing direction
        if (keyIsDown(65)) player.vel.add(p5.Vector.mult(tangent, swingForce))     // A
        if (keyIsDown(68)) player.vel.add(p5.Vector.mult(tangent, -swingForce))    // D
    }

    release() {
        if (!this.active) return

        this.active = false

        // Reset player state if needed
        if (this.player.state === PlayerState.GRAPPLE) {
            this.player.state = PlayerState.FALL
        }
    }

    update() {
        // Tongue animation logic
        if (this.tongueFlying) {

            // Pause at full extension
            if (this.tonguePauseTimer > 0) {
                this.tonguePauseTimer--
            } else {
                if (!this.tongueReturning) {
                    // Extending phase
                    this.tongueProgress += this.tongueOutSpeed

                    if (this.tongueProgress >= 1) {
                        this.tongueProgress = 1
                        this.tonguePauseTimer = this.tonguePauseDuration
                        this.tongueReturning = true
                    }
                } else {
                    // Returning phase
                    this.tongueProgress -= this.tongueReturnSpeed

                    if (this.tongueProgress <= 0) {
                        this.tongueProgress = 0
                        this.tongueFlying = false
                    }
                }
            }

            let t = this.tongueProgress

<<<<<<< HEAD
                if (!this.tongueReturning) {
                    t = 1 - pow(1 - t, 2);
                }

                let mouth = createVector(
                    this.player.pos.x + this.player.width * (this.player.facing === 1 ? 0.85 : 0.15),
                    this.player.pos.y + this.player.height * 0.35
                );

                if (!this.tongueReturning) {
                    let currentDist = t * this.tongueTotalDist;
                    this.tonguePos = p5.Vector.add(
                        this.tongueStart,
                        p5.Vector.mult(this.tongueDir, currentDist)
                    );
                } 
                else {
                    this.tonguePos = p5.Vector.lerp(this.tonguePos, mouth, 0.35);
                }
=======
            if (!this.tongueReturning) {
                t = 1 - pow(1 - t, 2)
>>>>>>> 4d021fd (save current grapple changes)
            }

            // Interpolate tongue position
            this.tonguePos = p5.Vector.lerp(this.tongueStart, this.tongueTarget, t)
        }

        // Rope physics
        if (this.active) {
            let player = this.player

            this.adjust()
            this.swing()

            let delta = p5.Vector.sub(player.pos, this.anchor)
            let distance = delta.mag()

            // Enforce rope constraint
            if (distance > this.ropeLength) {
                let excess = distance - this.ropeLength
                let dir = delta.copy().normalize()

                // Pull player back toward radius
                player.pos.sub(p5.Vector.mult(dir, excess * 0.02))
            }

            // Ensures circular swinging motion instead of drifting
            let dir = p5.Vector.sub(player.pos, this.anchor).normalize()
            let velDot = p5.Vector.dot(player.vel, dir)
            player.vel.sub(p5.Vector.mult(dir, velDot))
        }
    }

    display() {
        let p = this.player.pos

<<<<<<< HEAD
        let px = (this.player.facing === 1)
            ? p.x + this.player.width * 0.85
            : p.x + this.player.width * 0.15;
=======
        // For tongue origin based on facing direction
        let px = (this.player.facing === -1)
            ? p.x + this.player.width * 0.85
            : p.x + this.player.width * 0.15
>>>>>>> 4d021fd (save current grapple changes)

        let py = p.y + this.player.height * 0.35

        // Draw tongue (during animation)
        if (this.tongueFlying) {
            stroke(255, 130, 130)
            strokeWeight(4)
            line(px, py, this.tonguePos.x, this.tonguePos.y)
            noStroke()
        }

        // Draw rope (when attached)
        if (this.active) {
            stroke(255, 130, 130)
            strokeWeight(4)
            line(px, py, this.anchor.x, this.anchor.y)
            noStroke()
        }
    }
}
