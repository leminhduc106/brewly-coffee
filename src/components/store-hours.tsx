import React from 'react';
import { stores } from '@/lib/data';
import { format, isToday, isFuture, parseISO } from 'date-fns';

export function StoreHours() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="font-headline text-4xl md:text-5xl mb-8 text-primary text-center">Store Hours & Holiday Notices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="border rounded-2xl shadow-lg p-6 bg-background">
              <h3 className="font-bold text-2xl mb-2 text-primary">{store.name}</h3>
              <p className="text-base text-muted-foreground mb-1">{store.address}</p>
              <p className="text-lg font-medium mb-4">Regular Hours: <span className="text-primary">{store.openingHours}</span></p>
              <div className="space-y-2">
                {store.holidayNotices && store.holidayNotices.length > 0 ? (
                  <>
                    <h4 className="font-semibold text-base mb-2 text-secondary-foreground">Holiday Notices:</h4>
                    {store.holidayNotices
                      .filter(notice => isFuture(parseISO(notice.date)) || isToday(parseISO(notice.date)))
                      .map((notice) => (
                        <div key={notice.date} className="flex items-center gap-2">
                          <span className={`font-bold ${notice.isClosed ? 'text-red-600' : 'text-green-700'}`}>{format(parseISO(notice.date), 'MMM d, yyyy')}</span>
                          <span className="text-sm">{notice.message}</span>
                        </div>
                      ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming holiday notices.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
