import Image, { type ImageProps } from 'next/image';

type GameImageProps = Omit<ImageProps, 'unoptimized'> & {
  unoptimized?: boolean;
};

/** Figma 由来の PNG アセット向け。透過・色味を保つため unoptimized を既定にする */
export function GameImage({
  alt = '',
  unoptimized = true,
  ...props
}: GameImageProps) {
  return <Image alt={alt} unoptimized={unoptimized} {...props} />;
}
