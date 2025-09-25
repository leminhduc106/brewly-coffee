import React from 'react';
import { storeAnnouncements } from '@/lib/data';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

function isActive(announcement: any) {
  const now = new Date();
  if (announcement.startDate && isBefore(now, parseISO(announcement.startDate))) return false;
  if (announcement.endDate && isAfter(now, parseISO(announcement.endDate))) return false;
  return true;
}

export function StoreAnnouncements() {
  const activeAnnouncements = storeAnnouncements.filter(isActive);
  if (activeAnnouncements.length === 0) return null;

  return (
    <section className="w-full py-4 md:py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAnnouncements.map((a) => (
            <div key={a.id} className="rounded-2xl shadow-lg bg-gradient-to-br from-primary/10 to-muted/40 border p-6 flex flex-col items-center text-center">
              {a.imageUrl && (
                <img src={a.imageUrl} alt={a.title} className="rounded-xl mb-4 w-full h-40 object-cover" />
              )}
              <h3 className="font-bold text-xl md:text-2xl mb-2 text-primary">{a.title}</h3>
              <p className="text-base text-muted-foreground mb-2">{a.message}</p>
              {a.startDate && (
                <p className="text-xs text-muted-foreground">
                  {a.endDate
                    ? `${format(parseISO(a.startDate), 'MMM d')} - ${format(parseISO(a.endDate), 'MMM d')}`
                    : `From ${format(parseISO(a.startDate), 'MMM d')}`}
                </p>
              )}
              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${a.type === 'promo' ? 'bg-amber-100 text-amber-700' : a.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{a.type.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
