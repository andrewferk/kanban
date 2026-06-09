import confetti from 'canvas-confetti'

export function celebrateDone() {
  void confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
  })
}
