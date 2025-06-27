// Main application class - FIXED VERSION
class EnhancedBubblesApp {
  constructor() {
    this.canvas = document.getElementById("bubblesCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.resetBtn = document.getElementById("resetBtn")
    this.addBubbleBtn = document.getElementById("addBubbleBtn")
    this.modeBtn = document.getElementById("modeBtn")
    this.sizeSlider = document.getElementById("sizeSlider")
    this.speedSlider = document.getElementById("speedSlider")
    this.colorPicker = document.getElementById("colorPicker")

    // Stats elements
    this.bubbleCountEl = document.getElementById("bubbleCount")
    this.clickCountEl = document.getElementById("clickCount")
    this.poppedCountEl = document.getElementById("poppedCount")

    // Set canvas size
    this.resizeCanvas()
    window.addEventListener("resize", () => this.resizeCanvas())

    // Circle properties - positioned on left side
    this.circles = [
      {
        color: "#FFD700",
        originalColor: "#FFD700",
        x: 100,
        y: 100,
        radius: 35,
        clicked: false,
      },
      {
        color: "#4169E1",
        originalColor: "#4169E1",
        x: 100,
        y: 180,
        radius: 35,
        clicked: false,
      },
      {
        color: "#DC143C",
        originalColor: "#DC143C",
        x: 100,
        y: 260,
        radius: 35,
        clicked: false,
      },
      {
        color: "#32CD32",
        originalColor: "#32CD32",
        x: 100,
        y: 340,
        radius: 35,
        clicked: false,
      },
    ]

    // Arrow positions - positioned on right edge
    const arrowX = this.canvas.width - 50; // 50px from right edge
    this.arrows = [
      {
        x: arrowX,
        y: 100,
        targetX: arrowX,
        originalX: arrowX,
        moving: false,
        circleIndex: 0,
      },
      {
        x: arrowX,
        y: 180,
        targetX: arrowX,
        originalX: arrowX,
        moving: false,
        circleIndex: 1,
      },
      {
        x: arrowX,
        y: 260,
        targetX: arrowX,
        originalX: arrowX,
        moving: false,
        circleIndex: 2,
      },
      {
        x: arrowX,
        y: 340,
        targetX: arrowX,
        originalX: arrowX,
        moving: false,
        circleIndex: 3,
      },
    ]

    this.setupEventListeners()
    this.updateStats()
    this.startAnimation()
  }

  initializeElements() {
    // No changes needed here
  }

  initializeState() {
    this.bubbles = window.Bubble.createDefault()
    this.particleSystem = new window.ParticleSystem()
    this.renderer = new window.Renderer(this.canvas, this.ctx)

    this.funMode = false
    this.clickCount = 0
    this.poppedCount = 0
    this.animationId = null
    this.draggedBubble = null
    this.mousePos = { x: 0, y: 0 }
  }

  setupEventListeners() {
    // Button events
    this.resetBtn.addEventListener("click", () => this.reset())
    this.addBubbleBtn.addEventListener("click", () => this.addRandomBubble())
    this.modeBtn.addEventListener("click", () => this.toggleMode())

    // Canvas events
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e))
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e))
    this.canvas.addEventListener("mouseup", () => this.handleMouseUp())
    this.canvas.addEventListener("click", (e) => this.handleClick(e))
    this.canvas.addEventListener("dblclick", (e) => this.handleDoubleClick(e))

    // Control events
    this.sizeSlider.addEventListener("input", () => this.updateBubbleSize())
    this.speedSlider.addEventListener("input", () => this.updateSpeed())

    // Prevent context menu on canvas
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())

    // Add keyboard support
    this.canvas.addEventListener("keydown", (e) => {
      if (e.key === "r" || e.key === "R") {
        this.reset()
      }
    })

    // Make canvas focusable
    this.canvas.setAttribute("tabindex", "0")
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  handleMouseDown(e) {
    const mousePos = this.getMousePos(e)
    this.draggedBubble = this.bubbles.find((bubble) => bubble.containsPoint(mousePos.x, mousePos.y))

    if (this.draggedBubble) {
      this.draggedBubble.setDragging(true, mousePos.x - this.draggedBubble.x, mousePos.y - this.draggedBubble.y)
    }
  }

  handleMouseMove(e) {
    const mousePos = this.getMousePos(e)
    this.mousePos = mousePos

    // Update hover states
    this.bubbles.forEach((bubble) => {
      bubble.setHovered(bubble.containsPoint(mousePos.x, mousePos.y))
    })

    // Handle dragging
    if (this.draggedBubble) {
      this.draggedBubble.updatePosition(mousePos.x, mousePos.y)
    }
  }

  handleMouseUp() {
    if (this.draggedBubble) {
      this.draggedBubble.setDragging(false)
      this.draggedBubble = null
    }
  }

  handleClick(e) {
    this.clickCount++
    this.updateStats()

    const mousePos = this.getMousePos(e)
    const clickedBubble = this.bubbles.find((bubble) => bubble.containsPoint(mousePos.x, mousePos.y))

    if (clickedBubble) {
      this.particleSystem.addParticles(clickedBubble.x, clickedBubble.y, 8, clickedBubble.color, "click")
      window.SoundGenerator.playSound("click")
    }
  }

  handleDoubleClick(e) {
    const mousePos = this.getMousePos(e)
    const clickedBubble = this.bubbles.find((bubble) => bubble.containsPoint(mousePos.x, mousePos.y))

    if (clickedBubble) {
      this.popBubble(clickedBubble)
    }
  }

  popBubble(bubble) {
    const index = this.bubbles.indexOf(bubble)
    if (index > -1) {
      this.particleSystem.addParticles(bubble.x, bubble.y, 15, bubble.color, "pop")
      this.bubbles.splice(index, 1)
      this.poppedCount++
      this.updateStats()
      window.SoundGenerator.playSound("pop")
    }
  }

  addRandomBubble() {
    const newBubble = window.Bubble.createRandom(
      this.canvas.width,
      this.canvas.height,
      Number.parseInt(this.sizeSlider.value),
    )

    this.bubbles.push(newBubble)
    this.updateStats()
    this.particleSystem.addParticles(newBubble.x, newBubble.y, 12, newBubble.color, "spawn")
  }

  toggleMode() {
    this.funMode = !this.funMode
    this.modeBtn.textContent = this.funMode ? "Normal Mode" : "Fun Mode"

    if (this.funMode) {
      this.bubbles.forEach((bubble) => {
        window.Physics.setRandomVelocity(bubble, Number.parseInt(this.speedSlider.value))
      })
    } else {
      this.bubbles.forEach((bubble) => {
        bubble.vx = 0
        bubble.vy = 0
      })
    }
  }

  updateBubbleSize() {
    const newSize = Number.parseInt(this.sizeSlider.value)
    this.bubbles.forEach((bubble) => {
      if (!bubble.isDragging) {
        bubble.radius = newSize
      }
    })
  }

  updateSpeed() {
    if (this.funMode) {
      const speed = Number.parseInt(this.speedSlider.value)
      this.bubbles.forEach((bubble) => {
        const magnitude = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy)
        if (magnitude > 0) {
          bubble.vx = (bubble.vx / magnitude) * speed
          bubble.vy = (bubble.vy / magnitude) * speed
        }
      })
    }
  }

  startAnimation() {
    const animate = () => {
      this.update()
      this.draw()
      this.animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  update() {
    // Update bubble physics
    this.bubbles.forEach((bubble) => {
      window.Physics.updateBubblePhysics(bubble, this.canvas.width, this.canvas.height, this.funMode)
    })

    // Check bubble collisions in fun mode
    if (this.funMode) {
      window.Physics.checkBubbleCollisions(this.bubbles)
    }

    // Update particle system
    this.particleSystem.update()

    // Update arrow positions
    this.updateArrows()
  }

  draw() {
    // Clear canvas
    this.renderer.clear()

    // Draw trails
    this.bubbles.forEach((bubble) => {
      this.renderer.drawTrail(bubble)
    })

    // Draw bubbles
    this.bubbles.forEach((bubble) => {
      this.renderer.drawBubble(bubble)
    })

    // Draw arrows
    this.bubbles.forEach((bubble) => {
      this.renderer.drawArrow(bubble)
    })

    // Draw particles
    this.particleSystem.draw(this.ctx)

    // Draw circles
    this.circles.forEach((circle) => {
      this.drawCircle(circle.x, circle.y, circle.radius, circle.color)
    })

    // Draw arrows
    this.arrows.forEach((arrow) => {
      this.drawArrow(arrow.x, arrow.y)
    })
  }

  updateStats() {
    this.bubbleCountEl.textContent = this.bubbles.length
    this.clickCountEl.textContent = this.clickCount
    this.poppedCountEl.textContent = this.poppedCount
  }

  reset() {
    // Stop animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    // Reset state
    this.bubbles = window.Bubble.createDefault()
    this.particleSystem.clear()
    this.clickCount = 0
    this.poppedCount = 0
    this.funMode = false
    this.modeBtn.textContent = "Fun Mode"
    this.draggedBubble = null

    // Reset circles to original colors and states
    this.circles.forEach((circle) => {
      circle.color = circle.originalColor
      circle.clicked = false
    })

    // Reset arrows to original positions
    this.arrows.forEach((arrow) => {
      arrow.x = arrow.originalX
      arrow.targetX = arrow.originalX
      arrow.moving = false
    })

    this.updateStats()
    this.startAnimation()
  }

  resizeCanvas() {
    const container = this.canvas.parentElement
    this.canvas.width = container.clientWidth
    this.canvas.height = container.clientHeight

    // Update arrow positions when canvas resizes
    this.updateArrowPositions()
    this.draw()
  }

  updateArrowPositions() {
    // Arrow positions - positioned on right edge
    const arrowX = this.canvas.width - 50; // 50px from right edge
    this.arrows = [
      {
        x: arrowX,
        y: 100,
        targetX: arrowX,
        originalX: arrowX,
        moving: false,
        circleIndex: 0,
      },
      {
        x: arrowX,
        y: 180,
        targetX: arrowX,
        originalX: arrowX,
        moving: false,
        circleIndex: 1,
      },
      {
        x: arrowX,
         y: 260,
         targetX: arrowX,
         originalX: arrowX,
         moving: false,
         circleIndex: 2,
       },
       {
         x: arrowX,
         y: 340,
         targetX: arrowX,
         originalX: arrowX,
         moving: false,
         circleIndex: 3,
      },
    ]
  }

  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    // Check if click is inside any circle
    this.circles.forEach((circle, index) => {
      const distance = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2))

      if (distance <= circle.radius && !circle.clicked) {
        // Start arrow movement toward the circle
        this.arrows[index].moving = true
        this.arrows[index].targetX = circle.x + circle.radius + 20
        circle.clicked = true
      }
    })
  }

  updateArrows() {
    this.arrows.forEach((arrow, index) => {
      if (arrow.moving) {
        const speed = 4
        const dx = arrow.targetX - arrow.x

        if (Math.abs(dx) > speed) {
          // Move arrow toward target
          arrow.x += dx > 0 ? -speed : speed
        } else {
          // Arrow has reached the circle
          arrow.x = arrow.targetX
          arrow.moving = false

          // Change circle color when arrow hits it
          this.circles[index].color = this.getRandomColor()
        }
      }
    })
  }

  getRandomColor() {
    const colors = [
      "#FF69B4", // Hot Pink
      "#00CED1", // Dark Turquoise
      "#FFB347", // Peach
      "#98FB98", // Pale Green
      "#DDA0DD", // Plum
      "#F0E68C", // Khaki
      "#87CEEB", // Sky Blue
      "#FFA07A", // Light Salmon
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  drawCircle(x, y, radius, color) {
    // Draw circle with solid fill and black border
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.strokeStyle = "#000000"
    this.ctx.lineWidth = 2
    this.ctx.stroke()
  }

  drawArrow(x, y) {
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
  }
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new EnhancedBubblesApp()
})
