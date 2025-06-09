'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ClientOnly from '../ClientOnly'

interface MotionWrapperProps {
  children: React.ReactNode
  className?: string
  initial?: any
  animate?: any
  transition?: any
  whileHover?: any
  whileTap?: any
  layoutId?: string
  onClick?: () => void
}

export default function MotionWrapper ({
  children,
  className = '',
  initial,
  animate,
  transition,
  whileHover,
  whileTap,
  layoutId,
  onClick,
  ...props
}: MotionWrapperProps): JSX.Element {
  return (
    <ClientOnly fallback={<div className={className}>{children}</div>}>
      <motion.div
        className={className}
        initial={initial}
        animate={animate}
        transition={transition}
        whileHover={whileHover}
        whileTap={whileTap}
        layoutId={layoutId}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    </ClientOnly>
  )
}

