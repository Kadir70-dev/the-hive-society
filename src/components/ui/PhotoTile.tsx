import Image from "next/image";

interface PhotoTileProps {
  src: string;
  alt: string;
  tag?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
}

export function PhotoTile({
  src,
  alt,
  tag,
  className = "photo",
  priority,
  sizes = "100vw",
  objectPosition = "center",
}: PhotoTileProps) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: "cover", objectPosition }}
        priority={priority}
      />
      {tag && <span className="photo__tag">{tag}</span>}
    </div>
  );
}
