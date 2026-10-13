import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'gold' | 'glass' | 'neon-outline';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  title?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  variant = 'gold',
  className = '',
  type = 'button',
  disabled = false,
  title,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * 0.22;
    const deltaY = (clientY - centerY) * 0.22;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantClasses = {
    gold:
      'bg-gradient-to-r from-atelie-rose-300 via-atelie-rose-400 to-atelie-rose-600 text-white font-semibold shadow-gold-glow hover:shadow-gold-glow-lg border border-atelie-rose-200/80',
    glass:
      'bg-white/95 text-atelie-brown-800 border border-atelie-rose-300 hover:border-atelie-rose-500 hover:bg-atelie-rose-50 shadow-sm',
    'neon-outline':
      'bg-white/80 text-atelie-brown-800 border-2 border-atelie-rose-400 hover:border-atelie-rose-600 hover:bg-atelie-rose-50 shadow-xs',
  }[variant];

  const sharedClasses = `relative inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm tracking-wide transition-all duration-300 select-none ${variantClasses} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  } ${className}`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.4 }}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel}
          onClick={onClick}
          title={title}
          className={sharedClasses}
        >
          {children}
        </a>
      ) : (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          title={title}
          className={sharedClasses}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
};
