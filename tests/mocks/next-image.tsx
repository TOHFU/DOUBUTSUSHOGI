import type { ImgHTMLAttributes } from 'react';

type NextImageMockProps = ImgHTMLAttributes<HTMLImageElement> & {
  src?: string | { src: string };
  priority?: boolean;
  unoptimized?: boolean;
};

/** Vitest Browser では next/image の Node 依存を避けるため img に差し替える */
export default function Image({
  src,
  alt = '',
  priority,
  unoptimized,
  ...props
}: NextImageMockProps) {
  void priority;
  void unoptimized;

  const resolvedSrc = typeof src === 'string' ? src : src?.src;

  return <img src={resolvedSrc} alt={alt} {...props} />;
}
