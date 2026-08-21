import { useEffect, useState } from 'react';

type AvatarSize = 'sm' | 'md' | 'hero';

interface CharacterAvatarProps {
  name: string;
  src: string;
  size: AvatarSize;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'h-10 w-10 border-2 shadow-[2px_2px_0_#0B0B16]',
  md: 'h-10 w-10 border-2 shadow-[3px_3px_0_#0B0B16] sm:h-12 sm:w-12',
  hero: 'h-28 w-28 border-[4px] shadow-[7px_7px_0_#FF5FB3] sm:h-44 sm:w-44',
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function CharacterAvatar({ name, src, size, className = '' }: CharacterAvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const classes = `flex-none overflow-hidden border-ink bg-bg ${SIZE_CLASSES[size]} ${className}`;

  if (failed) {
    return (
      <span aria-hidden="true" className={`${classes} flex items-center justify-center bg-brand text-white`}>
        <span className="font-display text-sm font-bold tracking-tight">{initials(name)}</span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={classes}>
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top"
      />
    </span>
  );
}
