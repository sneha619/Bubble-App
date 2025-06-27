// Bubble class definition - FIXED VERSION
class Bubble {
  constructor(color, x, y, radius, originalY = y) {
    this.color = color
    this.x = x
    this.y = y
    this.radius = radius
    this.originalY = originalY
    this.vx = 0
    this.vy = 0
    this.isDragging = false
    this.isHovered = false
    this.pulsePhase = Math.random() * Math.PI * 2
    this.trail = []
    this.offsetX = 0
    this.offsetY = 0
  }

  static createDefault() {
    return [
      new Bubble("#FFD700", 80, 100, 25, 100),
      new Bubble("#4169E1", 80, 180, 25, 180),
      new Bubble("#DC143C", 80, 260, 25, 260),
      new Bubble("#32CD32", 80, 340, 25, 340),
    ]
  }

  static createRandom(canvasWidth, canvasHeight, radius) {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
    return new Bubble(
      colors[Math.floor(Math.random() * colors.length)],
      Math.random() * (canvasWidth - 100) + 50,
      Math.random() * (canvasHeight - 100) + 50,
      radius,
    )
  }

  containsPoint(x, y) {
    const Utils = {
      getDistance: (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2),
    }
    return Utils.getDistance(x, y, this.x, this.y) <= this.radius
  }

  setDragging(isDragging, offsetX = 0, offsetY = 0) {
    this.isDragging = isDragging
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  updatePosition(x, y) {
    if (this.isDragging) {
      this.x = x - this.offsetX
      this.y = y - this.offsetY
    }
  }

  setHovered(isHovered) {
    this.isHovered = isHovered
  }
}
