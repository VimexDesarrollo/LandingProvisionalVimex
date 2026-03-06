import type { KeyboardEvent, MouseEvent } from 'react'

const CLICK_CLASS = 'is-liquid-clicking'
const TIMER_KEY = 'liquidClickTimerId'
const ANIMATION_MS = 640

function triggerLiquidClick(target: HTMLElement, x: number, y: number) {
  target.style.setProperty('--liquid-click-x', `${x}px`)
  target.style.setProperty('--liquid-click-y', `${y}px`)

  const previousTimer = Number(target.dataset[TIMER_KEY])
  if (!Number.isNaN(previousTimer)) {
    window.clearTimeout(previousTimer)
  }

  target.classList.remove(CLICK_CLASS)
  void target.offsetWidth
  target.classList.add(CLICK_CLASS)

  const timerId = window.setTimeout(() => {
    target.classList.remove(CLICK_CLASS)
    delete target.dataset[TIMER_KEY]
  }, ANIMATION_MS)

  target.dataset[TIMER_KEY] = String(timerId)
}

export function runLiquidClickFromMouse(event: MouseEvent<HTMLElement>) {
  const target = event.currentTarget
  const bounds = target.getBoundingClientRect()
  triggerLiquidClick(target, event.clientX - bounds.left, event.clientY - bounds.top)
}

export function runLiquidClickFromKeyboard(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  const target = event.currentTarget
  const bounds = target.getBoundingClientRect()
  triggerLiquidClick(target, bounds.width / 2, bounds.height / 2)
}
