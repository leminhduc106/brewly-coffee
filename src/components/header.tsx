
"use client";

import Link from 'next/link';
import { Coffee, ShoppingBag, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';


export function Header() {
  const { setIsOpen, cartCount } = useCart();
  const { user, signOutUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOutUser();
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const handleScrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const cleanId = id.replace('#', '');
    
    // If we're not on the homepage, navigate there first
    if (pathname !== '/') {
      router.push('/');
      // Use a timeout to allow the page to navigate before trying to scroll
      setTimeout(() => {
        const element = document.getElementById(cleanId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300); // A small delay is often necessary
    } else {
      // If we're already on the homepage, just scroll
      const element = document.getElementById(cleanId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-xl font-bold text-primary leading-tight">
              AMBASSADOR's COFFEE
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Where Philippines meets Vietnam
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/menu" className="transition-colors hover:text-primary">
            Menu
          </Link>
          <a href="/#stores" onClick={handleScrollTo('#stores')} className="transition-colors hover:text-primary cursor-pointer">
            Stores
          </a>
          <a href="/#loyalty" onClick={handleScrollTo('#loyalty')} className="transition-colors hover:text-primary cursor-pointer">
            Rewards
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="relative"
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Open Cart</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-6 w-6" />
                <span className="sr-only">User Profile</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
