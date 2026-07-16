import Link from "next/link";
import Image from "next/image";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 group ">
      <Image
        src="/Logo.png"
        alt="Namma Talent Logo"
        width={55}
        height={55}
        className="rounded-md"

        priority
      />

      <div className="flex flex-col leading-tight">
        <span
          className={`font-display font-extrabold text-2xl font-medium  tracking-tight ${dark ? "text-white" : "text-ink"
            }`}
        >
          Namma<span className="text-brand">Talent</span>
        </span>

        <span className="text-lg font-bold   text-brand ">
          ನಮ್ಮ ಟ್ಯಾಲೆಂಟ್
        </span>
      </div>
    </Link>
  );
}