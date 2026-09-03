import Image from "next/image";

export function LogoMark() {
  return (
    <Image
      src="/images/hive-logo.png"
      alt=""
      width={140}
      height={156}
      className="logo__mark"
      priority
    />
  );
}
