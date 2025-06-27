// Particle system for visual effects
class Particle {
  constructor(x, y, vx, vy, size, color, alpha = 1, decay = 0.02) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.size = size
    this.color = color
    this.alpha = alpha
    this.decay = decay
    this.gravity = 0.1
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.alpha -= this.decay
    this.size *= 0.98

    return this.alpha > 0 && this.size > 0.5
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }
}

class ParticleSystem {
  constructor() {
    this.particles = []
  }

  addParticles(x, y, count, color, type = "default") {
    for (let i = 0; i < count; i++) {
      let particle

      switch (type) {
        case "click":
          particle = new Particle(
            x,
            y,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            Math.random() * 5 + 2,
            color,
            1,
            0.02,
          )
          break

        case "pop":
          particle = new Particle(
            x,
            y,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            Math.random() * 8 + 3,
            color,
            1,
            0.015,
          )
          break

        case "spawn":
          particle = new Particle(
            x,
            y,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            Math.random() * 4 + 1,
            "#FFD700",
            1,
            0.025,
          )
          break

        default:
          particle = new Particle(
            x,
            y,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            Math.random() * 3 + 1,
            color,
          )
      }

      this.particles.push(particle)
    }
  }

  update() {
    this.particles = this.particles.filter((particle) => particle.update())
  }

  draw(ctx) {
    this.particles.forEach((particle) => particle.draw(ctx))
  }

  clear() {
    this.particles = []
  }
}
