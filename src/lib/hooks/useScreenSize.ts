'use client'

import { useState, useEffect } from 'react'

export function useScreenSize() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    function check() {
      setIsDesktop(window.innerWidth >= 768) // md breakpoint
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return { isDesktop }
}
