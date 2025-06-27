// Physics engine for bubble movement and collisions
class Physics {
  static updateBubblePhysics(bubble, canvasWidth, canvasHeight, funMode) {
    if (!bubble.isDragging && funMode) {
      // Update position
      bubble.x += bubble.vx
      bubble.y += bubble.vy

      // Bounce off walls with damping
      if (bubble.x - bubble.radius <= 0 || bubble.x + bubble.radius >= canvasWidth) {
        bubble.vx *= -0.8
        bubble.x = clamp(bubble.x, bubble.radius, canvasWidth - bubble.radius)
      }

      if (bubble.y - bubble.radius <= 0 || bubble.y + bubble.radius >= canvasHeight) {
        bubble.vy *= -0.8
        bubble.y = clamp(bubble.y, bubble.radius, canvasHeight - bubble.radius)
      }

      // Apply air resistance
      bubble.vx *= 0.999
      bubble.vy *= 0.999
    }

    // Update pulse animation
    bubble.pulsePhase += 0.05

    // Update trail
    if (bubble.isDragging || funMode) {
      bubble.trail.push({
        x: bubble.x,
        y: bubble.y,
        alpha: 1,
      })

      if (bubble.trail.length > 10) {
        bubble.trail.shift()
      }
    }

    // Fade trail
    bubble.trail.forEach((point) => {
      point.alpha *= 0.9
    })
    bubble.trail = bubble.trail.filter((point) => point.alpha > 0.1)
  }

  static checkBubbleCollisions(bubbles) {
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const bubble1 = bubbles[i]
        const bubble2 = bubbles[j]

        const distance = getDistance(bubble1.x, bubble1.y, bubble2.x, bubble2.y)
        const minDistance = bubble1.radius + bubble2.radius

        if (distance < minDistance) {
          // Simple collision response
          const angle = Math.atan2(bubble2.y - bubble1.y, bubble2.x - bubble1.x)
          const targetX = bubble1.x + Math.cos(angle) * minDistance
          const targetY = bubble1.y + Math.sin(angle) * minDistance

          const ax = (targetX - bubble2.x) * 0.05
          const ay = (targetY - bubble2.y) * 0.05

          bubble1.vx -= ax
          bubble1.vy -= ay
          bubble2.vx += ax
          bubble2.vy += ay
        }
      }
    }
  }

  static setRandomVelocity(bubble, speed) {
    const angle = Math.random() * Math.PI * 2
    bubble.vx = Math.cos(angle) * speed
    bubble.vy = Math.sin(angle) * speed
  }
}

// Utility functions
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}
