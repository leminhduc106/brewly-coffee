"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { featuredProducts, stores, pastOrders, sampleUser } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { LoyaltyPointsCalculator } from "@/components/loyalty-points-calculator";
import { Recommendations } from "@/components/recommendations";
import { ReferralSystem } from "@/components/referral-system";
import { BirthdayBanner } from "@/components/birthday-banner";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Gift, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import {
  isTodayUserBirthday,
  getNextBirthdayDays,
  updateUserProfile,
} from "@/lib/user-service";
import { useToast } from "@/hooks/use-toast";
import { FeedbackForm } from "@/components/feedback-form";
import { submitOrderFeedback } from "@/lib/feedback-service";
import { useCart } from "@/context/cart-context";
import { getUserOrderHistory } from "@/lib/order-service";
import type { Order } from "@/lib/types";

import { StoreAnnouncements } from "@/components/store-announcements";

export default function Home() {
  // ...existing code...
  const [orderHistory, setOrderHistory] = React.useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(false);
  const ORDERS_PER_PAGE = 5;
  const [orderPage, setOrderPage] = React.useState(0);
  const paginatedOrders = orderHistory.slice(
    orderPage * ORDERS_PER_PAGE,
    (orderPage + 1) * ORDERS_PER_PAGE
  );
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { favorites } = useFavorites();
  const { toast } = useToast();
  const { repeatOrder } = useCart();

  const [birthdayRewardClaimed, setBirthdayRewardClaimed] =
    React.useState(false);

  // Check if birthday reward is already claimed today
  // Load user's real order history from Firebase
  React.useEffect(() => {
    const loadOrderHistory = async () => {
      // Prioritize Firebase user over userProfile since userProfile might be null
      const userId = user?.uid;
      
      if (!userId) {
        setIsLoadingOrders(false);
        return;
      }
      
      setIsLoadingOrders(true);
      try {
        const orders = await getUserOrderHistory(userId);
        setOrderHistory(orders);
      } catch (error) {
        console.error("Error loading order history:", error);
        // Fallback to sample data if Firebase fails
        setOrderHistory(pastOrders);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    loadOrderHistory();
  }, [user]); // Only depend on user, not userProfile

  React.useEffect(() => {
    if (userProfile && isTodayUserBirthday(userProfile.birthday)) {
      const claimedToday = localStorage.getItem(
        `birthday-claimed-${userProfile.uid}-${new Date().toDateString()}`
      );
      setBirthdayRewardClaimed(!!claimedToday);
    }
  }, [userProfile]);

  const handleClaimBirthdayReward = async () => {
    if (!userProfile) return;

    try {
      // Give 100 bonus points
      const newPoints = userProfile.loyaltyPoints + 100;
      await updateUserProfile(userProfile.uid, { loyaltyPoints: newPoints });

      // Mark as claimed for today
      localStorage.setItem(
        `birthday-claimed-${userProfile.uid}-${new Date().toDateString()}`,
        "true"
      );
      setBirthdayRewardClaimed(true);

      // Refresh user profile to get updated points
      await refreshUserProfile();

      toast({
        title: "🎉 Birthday Reward Claimed!",
        description:
          "100 loyalty points have been added to your account! Your free pastry is ready to redeem.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error claiming reward",
        description: "Please try again later.",
      });
    }
  };

  const handleReorder = (order: Order) => {
    if (order.items && order.items.length > 0) {
      repeatOrder(order.items);
      toast({
        title: "Order Added to Cart!",
        description: `${order.items.length} items from Order #${order.id} have been added to your cart.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot Reorder",
        description: "This order has no items to reorder.",
      });
    }
  };

  const handleScrollTo =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

  const isBirthday = userProfile && isTodayUserBirthday(userProfile.birthday);
  const nextBirthdayDays = userProfile
    ? getNextBirthdayDays(userProfile.birthday)
    : undefined;

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
            An honorary diplomatic experience where the warmth of Philippine hospitality 
            meets the elegance of Vietnamese coffee culture in perfect harmony.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg" asChild>
              <Link href="/menu">Order Now</Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg" asChild>
              <a href="#stores" onClick={handleScrollTo("stores")}>
                Visit Our Embassy
              </a>
            </Button>
          </div>
        </div>
      </section>
      {/* Store Announcements / Promos */}

      {/* Our Embassy Locations - Comprehensive Section */}
      <section id="stores" className="py-20 md:py-28 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl text-primary mb-4">
              Our Embassy Locations
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Visit our diplomatic coffee houses where Philippine warmth meets Vietnamese elegance. 
              Each location offers embassy-standard service and cultural experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {stores.map((store) => (
              <Card key={store.id} className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-primary mb-2">
                        {store.name}
                      </CardTitle>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-1 text-secondary flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{store.address}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Embassy
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Operating Hours */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-primary">Diplomatic Hours</p>
                      <p className="text-sm text-muted-foreground">{store.openingHours}</p>
                    </div>
                  </div>
                  
                  {/* Holiday Notices */}
                  {store.holidayNotices && store.holidayNotices.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-primary">
                        🎌 Cultural Calendar & Special Hours
                      </h4>
                      <div className="space-y-2">
                        {store.holidayNotices.map((notice) => {
                          const noticeDate = new Date(notice.date);
                          const isUpcoming = noticeDate >= new Date() || 
                            noticeDate.toDateString() === new Date().toDateString();
                          
                          if (!isUpcoming) return null;
                          
                          return (
                            <div key={notice.date} className="flex items-start gap-2 p-2 bg-secondary/10 rounded-md">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notice.isClosed ? 'bg-red-500' : 'bg-green-500'
                              }`} />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {noticeDate.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs text-muted-foreground">{notice.message}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Embassy Features */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>🇵🇭🇻🇳 Cultural Bridge Experience</span>
                      <span>Embassy Standard Service</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Interactive Embassy Map */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="font-headline text-3xl text-primary mb-4">
                📍 Find Our Embassy Locations
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Navigate to our diplomatic coffee houses across Vietnam. Each location is strategically 
                positioned to serve as a cultural bridge between Philippines and Vietnam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {stores.map((store) => {
                // Generate OpenStreetMap URL for each store location
                const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${store.lng - 0.01}%2C${store.lat - 0.01}%2C${store.lng + 0.01}%2C${store.lat + 0.01}&layer=mapnik&marker=${store.lat}%2C${store.lng}`;
                
                return (
                  <Card key={`map-${store.id}`} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-secondary" />
                        {store.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative">
                        <iframe
                          src={mapUrl}
                          title={`${store.name} Location Map`}
                          width="100%"
                          height="280"
                          className="border-0"
                          loading="lazy"
                          allowFullScreen
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/90 text-primary-foreground text-xs">
                            Embassy Location
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 bg-primary/5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-primary font-medium">{store.openingHours}</span>
                          </div>
                          <a 
                            href={`https://www.openstreetmap.org/?mlat=${store.lat}&mlon=${store.lng}&zoom=16`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-secondary/80 font-medium underline"
                          >
                            Open Full Map →
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Embassy Services Information */}
          <div className="mt-16 text-center">
            <Card className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="font-headline text-2xl text-primary mb-4">
                  Embassy Services & Cultural Programs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="text-center">
                    <h4 className="font-semibold text-primary mb-2">🤝 Cultural Exchange</h4>
                    <p className="text-muted-foreground">
                      Regular Philippines-Vietnam cultural events and language exchanges
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-primary mb-2">☕ Coffee Diplomacy</h4>
                    <p className="text-muted-foreground">
                      Expert-curated blends celebrating both nations' coffee heritage
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-primary mb-2">🏛️ Embassy Standards</h4>
                    <p className="text-muted-foreground">
                      Professional service with diplomatic attention to detail
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <StoreAnnouncements />

      {/* Birthday Banner */}
      {userProfile &&
        (isBirthday ||
          (nextBirthdayDays !== undefined && nextBirthdayDays <= 3)) && (
          <div className="container mx-auto px-4 md:px-6 py-6">
            <BirthdayBanner
              userName={userProfile.name}
              onClaimReward={handleClaimBirthdayReward}
              isRewardClaimed={birthdayRewardClaimed}
              nextBirthdayDays={nextBirthdayDays}
            />
          </div>
        )}

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





      {/* Cultural Specials Carousel */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl text-primary mb-4">
              Cultural Specials
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Celebrating the rich coffee traditions of Philippines and Vietnam
            </p>
          </div>
          <Carousel opts={{ loop: true }} className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                      <div className="relative">
                        <Image
                          src="https://picsum.photos/800/600"
                          alt="Philippine Barako Coffee"
                          width={400}
                          height={300}
                          className="rounded-2xl shadow-lg aspect-[4/3] object-cover"
                          data-ai-hint="Philippine barako coffee"
                        />
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                          🇵🇭 Philippine Heritage
                        </Badge>
                      </div>
                      <div className="md:w-1/2">
                        <h3 className="font-headline text-3xl md:text-4xl text-primary mb-4">
                          Barako Diplomacy Special
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          Experience the bold strength of Philippine Barako coffee, served 
                          with traditional Filipino hospitality. A tribute to our cultural roots.
                        </p>
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                          Discover Philippine Heritage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              <CarouselItem>
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                      <div className="relative">
                        <Image
                          src="https://picsum.photos/800/601"
                          alt="Cultural Fusion Pastry"
                          width={400}
                          height={300}
                          className="rounded-2xl shadow-lg aspect-[4/3] object-cover"
                          data-ai-hint="fusion pastry"
                        />
                        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                          🤝 Cultural Fusion
                        </Badge>
                      </div>
                      <div className="md:w-1/2">
                        <h3 className="font-headline text-3xl md:text-4xl text-primary mb-4">
                          Treaty Croissant Collection
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          A diplomatic fusion of French technique with Filipino ube and 
                          Vietnamese coconut cream. Where pastry diplomacy meets perfection.
                        </p>
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          Taste the Harmony
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="hidden md:flex -right-12 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-5 gap-16 py-20 md:py-28">
        {/* Main Content: Loyalty & Orders */}
        <div className="lg:col-span-5 flex flex-col gap-16">
          {/* Loyalty & Rewards Section */}
          <section id="loyalty">
            <h2 className="font-headline text-5xl mb-12 text-primary text-center">
              Loyalty & Rewards
            </h2>
            <Card className="overflow-hidden shadow-2xl rounded-3xl w-full">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30 p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={userProfile?.avatar || sampleUser.avatar}
                    alt="User avatar"
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-primary/50"
                  />
                  <div>
                    <CardTitle className="font-body text-2xl font-bold">
                      {userProfile?.name || sampleUser.name}
                    </CardTitle>
                    <p className="text-base text-muted-foreground">
                      {userProfile?.email || sampleUser.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="text-lg shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  {userProfile?.tier || sampleUser.tier}
                </Badge>
              </CardHeader>
              <CardContent className="p-8 grid gap-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-base font-medium">Your Points</p>
                    <p className="font-bold text-primary text-xl">
                      {(
                        userProfile?.loyaltyPoints || sampleUser.loyaltyPoints
                      ).toLocaleString()}{" "}
                      / 2,000
                    </p>
                  </div>
                  <Progress
                    value={
                      ((userProfile?.loyaltyPoints ||
                        sampleUser.loyaltyPoints) /
                        2000) *
                      100
                    }
                    className="h-4"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {2000 -
                      (userProfile?.loyaltyPoints ||
                        sampleUser.loyaltyPoints)}{" "}
                    points to Platinum Tier
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Order History Section */}
          <section id="orders">
                        <h2 className="font-headline text-5xl my-14 text-primary text-center">
              Your Order History
            </h2>
            <Card className="shadow-2xl rounded-3xl w-full">
              <CardContent className="p-8 flex flex-col gap-4">
                {isLoadingOrders ? (
                  <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your orders...</p>
                  </div>
                ) : orderHistory.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-4 p-6 border rounded-2xl hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">
                            Order #{order.id.slice(-8)}
                          </p>
                          <p className="text-base text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              { 
                                year: "numeric", 
                                month: "long", 
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )}
                          </p>
                          {order.items && order.items.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              {order.deliveryOption === "delivery" ? " • Delivery" : " • Pickup"}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-primary">
                            {order.total.toLocaleString()}₫
                          </p>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "preparing"
                                ? "secondary"
                                : order.status === "ready"
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              order.status === "completed"
                                ? "bg-green-600 hover:bg-green-600/90 text-white mt-1"
                                : order.status === "preparing"
                                ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground mt-1"
                                : order.status === "ready"
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground mt-1"
                                : "mt-1"
                            }
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Order Items Display */}
                      {order.items && order.items.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.selectedSize} • {item.selectedMilk}
                                  {item.quantity > 1 && ` • x${item.quantity}`}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        {order.items && order.items.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Reorder
                          </Button>
                        )}
                        {order.status === "completed" && !order.feedback && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <span>⭐</span>
                            Rate Order
                          </Button>
                        )}
                      </div>

                      {/* Feedback Form for completed orders */}
                      {order.status === "completed" && (
                        <FeedbackForm
                          orderId={order.id}
                          initialRating={order.rating}
                          initialFeedback={order.feedback}
                          onSubmit={async (rating, feedback) => {
                            await submitOrderFeedback(
                              order.id,
                              rating,
                              feedback
                            );
                            // Update local state to reflect the feedback
                            setOrderHistory(prev => 
                              prev.map(o => 
                                o.id === order.id 
                                  ? { ...o, rating, feedback }
                                  : o
                              )
                            );
                            toast({
                              title: "Feedback submitted!",
                              description: "Thank you for helping us improve.",
                            });
                          }}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12">
                    <div className="mb-4">
                      <Gift className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">No orders yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Start your diplomatic coffee journey with your first order!
                      </p>
                    </div>
                    <Button asChild className="mt-4">
                      <Link href="/menu">Browse Our Menu</Link>
                    </Button>
                  </div>
                )}

                {/* Pagination for order history */}
                {orderHistory.length > ORDERS_PER_PAGE && (
                  <div className="flex justify-center items-center gap-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOrderPage(Math.max(0, orderPage - 1))}
                      disabled={orderPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {orderPage + 1} of {Math.ceil(orderHistory.length / ORDERS_PER_PAGE)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOrderPage(Math.min(Math.ceil(orderHistory.length / ORDERS_PER_PAGE) - 1, orderPage + 1))}
                      disabled={orderPage >= Math.ceil(orderHistory.length / ORDERS_PER_PAGE) - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <Recommendations userFavorites={favorites} maxRecommendations={4} />
    </div>
  );
}
