import Image from "next/image";

export function LogoMark() {
  return (
    <Image
      src="/images/hive-logo.png"
      alt=""
      width={162}
      height={140}
      className="logo__mark"
      priority
    />
  );
}
