import type { SiteImage } from "@/lib/images";

/*
 * Pre-optimised AVIF/WebP pair from the build pipeline — next/image would
 * re-encode what sharp already produced. Explicit dimensions for zero CLS;
 * LQIP painted underneath while the real asset streams in.
 */
export function GlassImage({
  image,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
}: {
  image: SiteImage;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={`${image.avifMob} 800w, ${image.avifHalf} ${Math.round(image.width / 2)}w, ${image.avif} ${image.width}w`}
        sizes={sizes}
      />
      <img
        src={image.webp}
        srcSet={`${image.webpMob} 800w, ${image.webpHalf} ${Math.round(image.width / 2)}w, ${image.webp} ${image.width}w`}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`image-premium block h-auto w-full ${imageClassName ?? ""}`}
        style={{
          backgroundImage: `url(${image.lqip})`,
          backgroundSize: "cover",
        }}
      />
    </picture>
  );
}
