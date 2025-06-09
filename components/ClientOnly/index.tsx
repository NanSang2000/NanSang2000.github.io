'use client'

import React, { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientOnly ({ children, fallback = null }: ClientOnlyProps): JSX.Element {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (hasMounted === false) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

