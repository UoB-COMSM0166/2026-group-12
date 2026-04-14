class GrappleAbility {
    constructor(player) {
        this.player = player;

        // Grapple state
        this.active = false;                 // Whether the rope is currently attached
        this.anchor = createVector(0, 0);    // Anchor point
        this.ropeLength = 0;                 // Current rope length
        this.maxLength = 400;                // Maximum rope length

        // Swing mechanics
        this.retractSpeed = 1.5;             // Speed when shortening the rope (W key)
        this.extendSpeed = 1;                // Speed when extending the rope (S key)
        this.baseSwingForce = 0.16;          // Force applied when swinging

        // Tongue animation state
        this.tongueFlying = false;           // Whether the tongue is animating
        this.tonguePos = createVector(0, 0); // Tongue tip position

        this.tongueStart = createVector(0, 0);   // Starting point of the tongue
        this.tongueTarget = createVector(0, 0);  // Target point of the tongue

        this.tongueProgress = 0;             // Progress of animation (0 → 1 → 0)
        this.tongueReturning = false;        // Whether the tongue is returning

        // Animation speeds
        this.tongueOutSpeed = 0.15;          // Speed of tongue extending
        this.tongueReturnSpeed = 0.4;        // Speed of tongue returning

        // Pause at extension
        this.tonguePauseTimer = 0;
        this.tonguePauseDuration = 10;

        this.tongueDir = createVector(0, 0);
        this.tongueTotalDist = 0;

        // Previous key states for edge detection
        this.prevW = false;
        this.prevS = false;
    }

    shoot(targetX, targetY) {
        // Prevent shooting if already grappling or animating
        if (this.active || this.tongueFlying) {
            return false;
        }

        // Calculate player's center position
        let p = this.player.pos.copy();
        p.x += this.player.width / 2;
        p.y += this.player.height / 2;

        let dir = createVector(targetX - p.x, targetY - p.y).normalize();

        // Initialize tongue animation
        this.tongueStart.set(p.x, p.y);
        this.tongueDir = dir;

        let foundAnchor = false;
        let stepSize = 5; 
        let steps = floor(this.maxLength / stepSize);

        for (let i = 1; i <= steps; i++) {
            let checkX = p.x + dir.x * stepSize * i;
            let checkY = p.y + dir.y * stepSize * i;

            if (mapManager.isGrapplePoint(checkX, checkY)) {
                this.anchor.set(checkX, checkY);
                this.ropeLength = dist(p.x, p.y, checkX, checkY);
                foundAnchor = true;
                sfx.stick.play();
                break;
            } 
            else if (mapManager.getTileAt(checkX, checkY) !== 0) {
                this.tongueTotalDist = stepSize * (i - 1);
                this.tongueTarget.set(
                    p.x + dir.x * stepSize * (i - 1),
                    p.y + dir.y * stepSize * (i - 1)
                );
                this.tongueProgress = 0;
                this.tongueReturning = false;
                this.tonguePauseTimer = 0;
                this.tongueFlying = true;
                this.active = false;
                return false;
            }
        }

        this.tongueTotalDist = foundAnchor
            ? dist(p.x, p.y, this.anchor.x, this.anchor.y)
            : this.maxLength;

        if (foundAnchor) {
            this.tongueTarget.set(this.anchor.x, this.anchor.y);
        } else {
            this.tongueTarget.set(
                p.x + dir.x * this.maxLength,
                p.y + dir.y * this.maxLength
            );
        }

        this.tongueProgress = 0;
        this.tongueReturning = false;
        this.tonguePauseTimer = 0;
        this.tongueFlying = true;
        this.active = false;

        return foundAnchor;
    }

    adjust() {
        if (!this.active) {
            return;
        }

        if (keyIsDown(87)) {          
            this.ropeLength -= this.retractSpeed;
        }
        if (keyIsDown(83)) {          
            this.ropeLength += this.extendSpeed;
        }

        this.ropeLength = constrain(this.ropeLength, 40, this.maxLength);
    }

    swing() {
        if (!this.active) {
            return;
        }

        let player = this.player;

        let delta = p5.Vector.sub(player.pos, this.anchor);
        if (delta.mag() === 0) return;

        let tangent = createVector(-delta.y, delta.x).normalize();

        let swingForce = this.baseSwingForce *
            map(this.ropeLength, 40, this.maxLength, 1.5, 0.5);

        if (keyIsDown(65)) {
            player.vel.add(p5.Vector.mult(tangent, swingForce));
        }
        if (keyIsDown(68)) {
            player.vel.add(p5.Vector.mult(tangent, -swingForce));
        }
    }

    release() {
        if (!this.active) {
            return;
        }

        this.active = false;
        this.anchor.set(0, 0);

        if (this.player.state === PlayerState.GRAPPLE) {
            this.player.state = PlayerState.FALL;
        }
    }

    update() {
        if (this.tongueFlying) {
            if (this.tonguePauseTimer > 0) {
                this.tonguePauseTimer--;
            } 
            else {
                if (!this.tongueReturning) {
                    this.tongueProgress += this.tongueOutSpeed;

                    if (this.tongueProgress >= 1) {
                        this.tongueProgress = 1;

                        if (this.anchor.x !== 0 && this.anchor.y !== 0) {
                            this.active = true;
                            this.player.state = PlayerState.GRAPPLE;
                            this.tongueFlying = false;
                            this.tonguePos.set(this.anchor.x, this.anchor.y);
                        }

                        else {
                            this.tonguePauseTimer = this.tonguePauseDuration;
                            this.tongueReturning = true;
                        }
                    }
                } 
                else {
                    this.tongueProgress -= this.tongueReturnSpeed;

                    if (this.tongueProgress <= 0) {
                        this.tongueProgress = 0;
                        this.tongueFlying = false;
                    }
                }
            }

            if (this.tongueFlying) {
                let t = this.tongueProgress;

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
            }
        }

        if (this.active) {
            let player = this.player;

            this.adjust();
            this.swing();

            let delta = p5.Vector.sub(player.pos, this.anchor);
            let distance = delta.mag();

            if (distance > this.ropeLength) {
                let excess = distance - this.ropeLength;
                let dir = delta.copy().normalize();
                player.pos.sub(p5.Vector.mult(dir, excess));
            }

            let dir = p5.Vector.sub(player.pos, this.anchor).normalize();
            let velDot = p5.Vector.dot(player.vel, dir);
            player.vel.sub(p5.Vector.mult(dir, velDot));
        }
    }

    display() {
        let p = this.player.pos;

        let px = (this.player.facing === 1)
            ? p.x + this.player.width * 0.85
            : p.x + this.player.width * 0.15;

        let py = p.y + this.player.height * 0.35;

        if (this.tongueFlying) {
            stroke(255, 130, 130);
            strokeWeight(6);
            line(px, py, this.tonguePos.x, this.tonguePos.y);
            noStroke();
        }

        if (this.active) {
            stroke(255, 130, 130);
            strokeWeight(6);
            line(px, py, this.anchor.x, this.anchor.y);
            noStroke();
        }
    }
}