import Link from "next/link";
import Image from "next/image";
import planningPokerProLogo from "../../../public/pppLogo.svg";

export default function Navbar() {
  return (
    <header className="px-4">
      <nav className="flex max-w-[1300px] h-20 mx-auto justify-between">
        {/* Logo */}
        <Link href="/" className="my-auto w-48 md:w-36 sm:w-28">
          <Image src={planningPokerProLogo} alt="Planning Poker Pro Logo" priority />
        </Link>

        {/* Nav Links */}
        <div className="flex gap-x-5 hover:border-b-4 hover:border-b-[#9C2770]">
          <a
            href="#howItWorks"
            className="m-auto text-blue font-bold text-lg sm:text-xs"
          >
            How It Works
          </a>
        </div>
      </nav>
    </header>
  );
}
