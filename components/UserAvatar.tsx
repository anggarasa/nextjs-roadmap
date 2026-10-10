// components/UserAvatar.tsx
import Image from "next/image";

interface UserAvatarProps {
  src?: string;
  name?: string;
}

export function UserAvatar({
  src = "https://avatars.githubusercontent.com/u/9919?v=4",
  name = "Farhan Coders",
}: UserAvatarProps) {
  return (
    <div className="relative inline-block">
      <Image
        src={src}
        alt={`Avatar ${name}`}
        width={40}
        height={40}
        className="rounded-full object-cover border border-slate-200 shadow-sm"
      />
    </div>
  );
}
