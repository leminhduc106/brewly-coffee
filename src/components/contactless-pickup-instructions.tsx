import React from 'react';
import { contactlessPickupInstructions, stores } from '@/lib/data';

export function ContactlessPickupInstructions({ storeId }: { storeId: string }) {
  const instructions = contactlessPickupInstructions.find(i => i.storeId === storeId);
  const store = stores.find(s => s.id === storeId);
  if (!instructions || !store) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-headline text-4xl md:text-5xl mb-8 text-primary text-center">Contactless Pickup Instructions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="border rounded-2xl shadow-lg p-8 bg-background w-full">
            <h3 className="font-bold text-2xl mb-2 text-primary">{store.name}</h3>
            <p className="text-base text-muted-foreground mb-1">{store.address}</p>
            <div className="mb-4">
              <span className="font-semibold text-lg">Your Pickup Code: </span>
              <span className="font-mono text-xl bg-primary/10 px-3 py-1 rounded-md text-primary">{instructions.pickupCode}</span>
            </div>
            <ol className="list-decimal pl-6 space-y-2 mb-2">
              {instructions.steps.map((step, idx) => (
                <li key={idx} className="text-base text-muted-foreground">{step}</li>
              ))}
            </ol>
          </div>
          <div className="w-full flex justify-center items-center">
            <iframe
              src={instructions.mapUrl}
              title="Pickup Location Map"
              width="100%"
              height="350"
              className="rounded-2xl border shadow-lg min-h-[250px]"
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
