import { gsap } from '@/animations/gsap'

interface AnimationOptions {
  reducedMotion: boolean
}

export function animateHeroReveal(root: HTMLElement, options: AnimationOptions): () => void {
  if (options.reducedMotion) {
    return () => undefined
  }

  const context = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } })

    timeline
      .fromTo('[data-hero-overlay]', { opacity: 0 }, { opacity: 1, duration: 0.9, immediateRender: false })
      .fromTo(
        '[data-hero-eyebrow]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, immediateRender: false, clearProps: 'transform,opacity' },
        '-=0.5',
      )
      .fromTo(
        '[data-hero-title]',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, immediateRender: false, clearProps: 'transform,opacity' },
        '-=0.35',
      )
      .fromTo(
        '[data-hero-subtitle]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, immediateRender: false, clearProps: 'transform,opacity' },
        '-=0.55',
      )
      .fromTo(
        '[data-hero-cta]',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, immediateRender: false, clearProps: 'transform,opacity' },
        '-=0.45',
      )
  }, root)

  return () => context.revert()
}

export function animateSectionReveal(root: HTMLElement, options: AnimationOptions): () => void {
  if (options.reducedMotion) {
    return () => undefined
  }

  const context = gsap.context(() => {
    gsap.fromTo(
      '[data-section-heading]',
      { x: -48, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '[data-section-heading]',
          start: 'top 82%',
        },
      },
    )

    gsap.fromTo(
      '[data-section-body]',
      { x: -32, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
        stagger: 0.12,
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '[data-section-body]',
          start: 'top 85%',
        },
      },
    )
  }, root)

  return () => context.revert()
}

export function animateStaggerCards(root: HTMLElement, selector: string, options: AnimationOptions): () => void {
  if (options.reducedMotion) {
    return () => undefined
  }

  const context = gsap.context(() => {
    gsap.from(selector, {
      y: 24,
      opacity: 0,
      stagger: 0.15,
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 75%',
      },
    })
  }, root)

  return () => context.revert()
}

export function animateWhyCardsOnScroll(root: HTMLElement, selector: string, options: AnimationOptions): () => void {
  if (options.reducedMotion) {
    return () => undefined
  }

  const context = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>(selector)

    cards.forEach((card, index) => {
      const xOffset = -(34 + index * 28)
      const yOffset = 8 + index * 2
      const scrubAmount = 0.45 + index * 0.08

      gsap.fromTo(
        card,
        {
          x: xOffset,
          y: yOffset,
          opacity: 0.08,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            end: 'top 50%',
            scrub: scrubAmount,
          },
          clearProps: 'transform,opacity',
        },
      )
    })
  }, root)

  return () => context.revert()
}

export function animateHoverLift(root: HTMLElement, selector: string, options: AnimationOptions): () => void {
  if (options.reducedMotion) {
    return () => undefined
  }

  const cards = Array.from(root.querySelectorAll<HTMLElement>(selector))
  const listeners: Array<() => void> = []

  cards.forEach((card) => {
    const onEnter = () => {
      gsap.to(card, { y: -8, scale: 1.01, duration: 0.28, ease: 'power2.out' })
    }

    const onLeave = () => {
      gsap.to(card, { y: 0, scale: 1, duration: 0.28, ease: 'power2.out' })
    }

    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)

    listeners.push(() => {
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    })
  })

  return () => {
    listeners.forEach((unsubscribe) => unsubscribe())
  }
}
