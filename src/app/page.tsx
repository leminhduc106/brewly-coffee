
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { featuredProducts, stores, pastOrders, sampleUser } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { LoyaltyPointsCalculator } from '@/components/loyalty-points-calculator';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Gift, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  const handleScrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full">
        <Image
          src="https://picsum.photos/1800/1200"
          alt="Cozy coffee shop interior with warm lighting"
          fill
          className="z-0 object-cover"
          data-ai-hint="coffee shop interior"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
        <div className="relative z-20 flex h-full flex-col items-center justify-end text-center text-white p-8 md:p-16">
          <h1 className="font-headline text-5xl md:text-8xl drop-shadow-2xl">
            Crafted with Passion.
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200 drop-shadow-xl">
            Experience the art of coffee with our ethically sourced beans and
            handcrafted beverages.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg" asChild>
              <Link href="/menu">
                Order Now
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <a href="#stores" onClick={handleScrollTo('stores')}>
                Find a Store
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="menu" className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-headline text-5xl text-center mb-16 text-primary">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner Carousel */}
      <section className="py-20 md:py-28 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <Carousel
            opts={{ loop: true }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              <CarouselItem>
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left p-6">
                  <Image
                    src="https://picsum.photos/800/600"
                    alt="Fall special drink"
                    width={400}
                    height={300}
                    className="rounded-2xl shadow-2xl aspect-[4/3] object-cover"
                    data-ai-hint="seasonal drink"
                  />
                  <div className="md:w-1/2">
                    <h3 className="font-headline text-4xl">
                      Fall Specials Are Here!
                    </h3>
                    <p className="mt-4 text-lg max-w-prose text-accent-foreground/80">
                      Embrace the season with our Pumpkin Spice Latte and Apple
                      Crumble Muffin. Available for a limited time.
                    </p>
                    <Button className="mt-6" size="lg" variant="secondary">
                      Explore Specials
                    </Button>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left p-6">
                  <Image
                    src="https://picsum.photos/800/601"
                    alt="New pastry"
                    width={400}
                    height={300}
                    className="rounded-2xl shadow-2xl aspect-[4/3] object-cover"
                    data-ai-hint="delicious pastry"
                  />
                  <div className="md:w-1/2">
                    <h3 className="font-headline text-4xl">
                      New! The Brewly Cronut
                    </h3>
                    <p className="mt-4 text-lg max-w-prose text-accent-foreground/80">
                      A perfect hybrid of a croissant and a donut. Flaky,
                      creamy, and utterly delicious. Try one today!
                    </p>
                    <Button className="mt-6" size="lg" variant="secondary">Order Now</Button>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-5 gap-16 py-20 md:py-28">
        {/* Main Content: Loyalty & Orders */}
        <div className="lg:col-span-3 flex flex-col gap-16">
          {/* Loyalty & Rewards Section */}
          <section id="loyalty">
            <h2 className="font-headline text-5xl mb-12 text-primary">Loyalty & Rewards</h2>
            <Card className="overflow-hidden shadow-2xl rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30 p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={sampleUser.avatar}
                    alt="User avatar"
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-primary/50"
                  />
                  <div>
                    <CardTitle className="font-body text-2xl font-bold">
                      {sampleUser.name}
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      {sampleUser.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="text-lg shadow-lg bg-amber-500 hover:bg-amber-500/90 text-white"
                >
                  {sampleUser.tier}
                </Badge>
              </CardHeader>
              <CardContent className="p-8 grid gap-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-base font-medium">Your Points</p>
                    <p className="font-bold text-primary text-xl">
                      {sampleUser.loyaltyPoints.toLocaleString()} / 2,000
                    </p>
                  </div>
                  <Progress
                    value={(sampleUser.loyaltyPoints / 2000) * 100}
                    className="h-4"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {2000 - sampleUser.loyaltyPoints} points to Platinum Tier
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Order History Section */}
          <section id="orders">
            <h2 className="font-headline text-5xl mb-12 text-primary">Your Order History</h2>
            <Card className="shadow-2xl rounded-3xl">
              <CardContent className="p-8 flex flex-col gap-4">
                {pastOrders.length > 0 ? pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-4 border rounded-2xl hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                  >
                    <div>
                      <p className="font-semibold text-lg">Order #{order.id}</p>
                      <p className="text-base text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-primary">
                        ${order.total.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          order.status === 'completed'
                            ? 'bg-green-600 hover:bg-green-600/90 text-white mt-1'
                            : 'mt-1'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                )) : <p className="text-muted-foreground text-center p-8">No past orders found.</p>}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar-like content: Store Locator */}
        <aside className="lg:col-span-2">
          <section id="stores" className="sticky top-28">
            <h2 className="font-headline text-5xl mb-12 text-primary">Our Stores</h2>
            <div className="flex flex-col gap-8">
              {stores.map((store) => (
                <Card key={store.id} className="overflow-hidden shadow-2xl rounded-3xl group">
                  <div className="h-48 bg-muted overflow-hidden">
                     <Image
                      src={`https://picsum.photos/seed/${store.id}/600/400`}
                      alt={`Image of ${store.name}`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint="coffee shop exterior"
                    />
                  </div>
                  <CardContent className="p-6">
                    <CardTitle className="font-body text-2xl font-bold">
                      {store.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-base mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {store.address}
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      {store.openingHours}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-4 text-primary text-base"
                    >
                      Open in Google Maps{' '}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
