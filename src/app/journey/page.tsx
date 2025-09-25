
'use client';

import dynamic from 'next/dynamic';
import { allProducts } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';

// Dynamically import the JourneyMap component and disable server-side rendering (SSR)
const JourneyMap = dynamic(() => import('@/components/journey-map'), {
  ssr: false,
  loading: () => <div style={{ height: '600px' }} className="bg-muted animate-pulse" />,
});

export default function CoffeeJourneyPage() {
  const coffeeOrigins = allProducts
    .filter(p => p.origin)
    .map(p => p.origin!);

  // Remove duplicates
  const uniqueOrigins = Array.from(new Map(coffeeOrigins.map(o => [o.country, o])).values());

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl md:text-7xl text-primary">
            Our Coffee Journey
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We travel the world to source the highest quality beans from ethical farms. Explore the origins of your favorite coffees and the stories behind them.
          </p>
        </div>

        <Card className="shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-0">
             <JourneyMap origins={uniqueOrigins} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
