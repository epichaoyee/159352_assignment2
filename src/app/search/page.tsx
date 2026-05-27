'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IFlight } from '@/lib/models/Flight';
import { AIRPORTS } from '@/lib/constants';
import Link from 'next/link';
import { Plane, User, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  const [flights, setFlights] = useState<IFlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        // Using the teacher's recommended endpoint format
        const res = await fetch(`/api/schedules?orig=${origin}&dest=${destination}&date1=${date}`);
        const data = await res.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && date) {
      fetchFlights();
    }
  }, [origin, destination, date]);

  const originAirport = origin ? AIRPORTS[origin as keyof typeof AIRPORTS] : null;
  const destAirport = destination ? AIRPORTS[destination as keyof typeof AIRPORTS] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Flights</h1>
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          {originAirport?.city} ({origin}) <ArrowRight className="h-4 w-4" /> {destAirport?.city} ({destination}) 
          <span className="mx-2">•</span> 
          {date ? format(new Date(date), 'EEEE, MMMM do, yyyy') : ''}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <p className="mt-4 text-gray-500">Searching for best deals...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No flights found</h2>
          <p className="text-gray-600 mb-8">We couldn't find any flights for the selected date and route. Some of our routes are infrequent.</p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors">
            Try another date
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => {
            const activeBookings = flight.bookings?.filter(b => b.status === 'booked') || [];
            const remainingSeats = flight.capacity - activeBookings.length;
            const isFull = remainingSeats <= 0;
            
            return (
              <div key={flight._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                      {flight.flightNumber}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <Plane className="h-4 w-4" /> {flight.aircraft}
                    </span>
                  </div>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{format(new Date(flight.departureTime), 'HH:mm')}</p>
                      <p className="text-gray-500">{flight.origin}</p>
                    </div>
                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                      <div className="w-full h-[2px] bg-gray-200 relative">
                        <Plane className="h-4 w-4 text-primary-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Direct</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
                      <p className="text-gray-500">{flight.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price per person</p>
                    <p className="text-3xl font-bold text-primary-600">${flight.price}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                      <User className="h-3 w-3" /> {remainingSeats} seats left
                    </p>
                  </div>
                  <Link 
                    href={isFull ? '#' : `/book/${flight._id}`}
                    className={`px-8 py-3 rounded-lg font-bold transition-all ${
                      isFull 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isFull ? 'Sold Out' : 'Select'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-12 w-12 text-primary-600 animate-spin" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
