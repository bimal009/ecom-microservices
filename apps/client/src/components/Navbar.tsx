import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Home, ShoppingCart } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import ProfileButton from "./ProfileButton";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-300 pb-4">
      <Link href="/" className="flex items-center">
       
        <p className="hidden md:block text-md font-medium tracking-wider text-black">
          URBANAURA.
        </p>
      </Link>
      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-700"/>
        </Link>
        <Bell className="w-4 h-4 text-gray-700"/>
        <ShoppingCartIcon/>
         <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <ProfileButton />
            </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;