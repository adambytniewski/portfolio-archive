'use client'

import { useEffect } from 'react'

/**
 * RevealOnView — when any element with `[data-reveal]` enters the viewport,
 * adds `data-revealed="true"` so CSS animations / transitions can play.
 *
 * This sidesteps the React-strict-mode + GSAP delayed-tween race we hit on
 * the page in dev. It's smaller, leaner, and more reliable than ScrollTrigger
 * for one-shot reveal animations. ScrollTrigger is still used for scrub-based
 * parallax in IssueCover.
 */
export default function RevealOnView() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-revealed', 'true'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).setAttribute('data-revealed', 'true')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
