
"use client";

import Link from 'next/link';
import { Coffee, ShoppingBag, User, LogOut, Shield, Crown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { usePathname, useRouter } from 'next/navigation';


export function Header() {
  const { setIsOpen, cartCount } = useCart();
  const { user, userProfile, signOutUser } = useAuth();
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
            <div className="flex items-center gap-3">
              {/* Staff Dashboard Button - Prominent for Staff */}
              {userProfile?.role && ['staff', 'manager', 'admin'].includes(userProfile.role) && (
                <Button 
                  asChild 
                  variant="default" 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md"
                >
                  <Link href="/staff" className="flex items-center gap-2">
                    {userProfile.role === 'manager' || userProfile.role === 'admin' ? (
                      <Crown className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Staff Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} />
                      <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                    {/* Role indicator badge */}
                    {userProfile?.role && ['staff', 'manager', 'admin'].includes(userProfile.role) && (
                      <div className="absolute -top-1 -right-1">
                        <Badge 
                          variant={userProfile.role === 'manager' || userProfile.role === 'admin' ? 'default' : 'secondary'}
                          className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {userProfile.role === 'manager' || userProfile.role === 'admin' ? (
                            <Crown className="h-3 w-3" />
                          ) : (
                            <Shield className="h-3 w-3" />
                          )}
                        </Badge>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userProfile?.name || user.displayName || user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {userProfile?.role && ['staff', 'manager', 'admin'].includes(userProfile.role) && (
                        <div className="flex items-center gap-1 mt-1">
                          {userProfile.role === 'manager' || userProfile.role === 'admin' ? (
                            <Crown className="h-3 w-3 text-yellow-600" />
                          ) : (
                            <Shield className="h-3 w-3 text-blue-600" />
                          )}
                          <Badge 
                            variant={userProfile.role === 'manager' || userProfile.role === 'admin' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {userProfile.role.toUpperCase()}
                          </Badge>
                          {userProfile.storeId && (
                            <span className="text-xs text-muted-foreground">
                              • {userProfile.storeId.replace('embassy-', '').toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {userProfile?.role && ['staff', 'manager', 'admin'].includes(userProfile.role) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/staff" className="flex items-center">
                          {userProfile.role === 'manager' || userProfile.role === 'admin' ? (
                            <Crown className="mr-2 h-4 w-4" />
                          ) : (
                            <Users className="mr-2 h-4 w-4" />
                          )}
                          <span>Staff Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-6 w-6" />
                  <span className="sr-only">User Profile</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
