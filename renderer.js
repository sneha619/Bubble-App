// Rendering engine for drawing bubbles, arrows, and effects
class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.arrowStartX = canvas.width - 50  // Start 50px from right edge
    this.arrowEndX = canvas.width - 100   // End 100px from right edge
  }

  clear() {
    // Clear canvas with gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height)
    gradient.addColorStop(0, "#f8f9fa")
    gradient.addColorStop(1, "#ffffff")
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawBubble(bubble) {
    const pulseSize = Math.sin(bubble.pulsePhase) * 3
    const currentRadius = bubble.radius + (bubble.isHovered ? 5 : 0) + pulseSize

    // Shadow
    this.ctx.shadowColor = "rgba(0,0,0,0.3)"
    this.ctx.shadowBlur = 10
    this.ctx.shadowOffsetX = 3
    this.ctx.shadowOffsetY = 3

    // Gradient fill
    const gradient = this.ctx.createRadialGradient(
      bubble.x - currentRadius / 3,
      bubble.y - currentRadius / 3,
      0,
      bubble.x,
      bubble.y,
      currentRadius,
    )
    gradient.addColorStop(0, this.lightenColor(bubble.color, 40))
    gradient.addColorStop(1, bubble.color)

    this.ctx.beginPath()
    this.ctx.arc(bubble.x, bubble.y, currentRadius, 0, 2 * Math.PI)
    this.ctx.fillStyle = gradient
    this.ctx.fill()

    // Reset shadow
    this.ctx.shadowColor = "transparent"
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0

    // Border
    this.ctx.strokeStyle = this.darkenColor(bubble.color, 20)
    this.ctx.lineWidth = bubble.isHovered ? 3 : 2
    this.ctx.stroke()

    // Highlight
    this.ctx.beginPath()
    this.ctx.arc(bubble.x - currentRadius / 4, bubble.y - currentRadius / 4, currentRadius / 4, 0, 2 * Math.PI)
    this.ctx.fillStyle = "rgba(255,255,255,0.6)"
    this.ctx.fill()
  }

  drawArrow(bubble) {
    const x = this.arrowStartX
    const y = bubble.y
    const arrowLength = 50
    const arrowHeadSize = 15

    // Draw arrow shaft (pointing left)
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x - arrowLength, y)
    this.ctx.strokeStyle = "#000000"
    this.ctx.lineWidth = 4
    this.ctx.lineCap = "round"
    this.ctx.stroke()

    // Draw arrow head (pointing left)
    this.ctx.beginPath()
    this.ctx.moveTo(x - arrowLength, y)
    this.ctx.lineTo(x - arrowLength + arrowHeadSize, y - arrowHeadSize / 2)
    this.ctx.lineTo(x - arrowLength + arrowHeadSize, y + arrowHeadSize / 2)
    this.ctx.closePath()
    this.ctx.fillStyle = "#000000"
    this.ctx.fill()

    // Reset shadow
    this.ctx.shadowColor = "transparent"
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
  }

  drawTrail(bubble) {
    if (bubble.trail.length < 2) return

    this.ctx.strokeStyle = bubble.color
    this.ctx.lineWidth = 3
    this.ctx.lineCap = "round"

    for (let i = 1; i < bubble.trail.length; i++) {
      const point = bubble.trail[i]
      const prevPoint = bubble.trail[i - 1]

      this.ctx.globalAlpha = point.alpha * 0.5
      this.ctx.beginPath()
      this.ctx.moveTo(prevPoint.x, prevPoint.y)
      this.ctx.lineTo(point.x, point.y)
      this.ctx.stroke()
    }

    this.ctx.globalAlpha = 1
  }

  lightenColor(color, amount) {
    return (
      "#" +
      color
        .slice(1)
        .split("")
        .map((char) => {
          const hex = Number.parseInt(char + char, 16)
          const lighter = Math.min(255, hex + amount)
          return lighter.toString(16).slice(-2)
        })
        .join("")
    )
  }

  darkenColor(color, amount) {
    return (
      "#" +
      color
        .slice(1)
        .split("")
        .map((char) => {
          const hex = Number.parseInt(char + char, 16)
          const darker = Math.max(0, hex - amount)
          return darker.toString(16).slice(-2)
        })
        .join("")
    )
  }
}
