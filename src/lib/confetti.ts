import confetti from 'canvas-confetti'

export function celebrateDone() {
  void confetti({
    particleCount: 140,
    spread: 80,
    origin: { y: 0.55 },
    colors: ['#97ce4c', '#44d62c', '#7352d1', '#e4a788', '#f0e14a'],
  })

  window.setTimeout(() => {
    void confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#97ce4c', '#44d62c', '#7352d1'],
    })
    void confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#97ce4c', '#44d62c', '#7352d1'],
    })
  }, 180)
}
