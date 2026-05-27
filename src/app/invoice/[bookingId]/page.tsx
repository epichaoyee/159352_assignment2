'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IBooking } from '@/lib/models/Booking';
import { IFlight } from '@/lib/models/Flight';
import { format } from 'date-fns';
import { CheckCircle2, Printer, Download, Mail, Plane, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function InvoicePage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<(IBooking & { flightId: IFlight }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/details/${bookingId}`);
        if (!res.ok) throw new Error('Booking not found');
        const data = await res.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-12 w-12 text-primary-600 animate-spin" /></div>;
  }

  if (!booking) {
    return <div className="text-center py-20">Booking not found.</div>;
  }

  const { flightId: flight } = booking;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">Your flight has been successfully booked. A confirmation email has been sent.</p>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Invoice Header */}
        <div className="bg-primary-600 p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-primary-100 text-sm font-bold uppercase tracking-wider">Booking Reference</p>
            <h2 className="text-4xl font-mono font-bold mt-1">{booking.bookingReference}</h2>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-bold">Dairy Flat Airways</h3>
            <p className="text-primary-100 text-sm">Invoice #INV-{booking._id.toString().substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Passenger Details</h3>
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-900">{booking.passengerName}</p>
                {booking.passengerEmail && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {booking.passengerEmail}
                  </p>
                )}
              </div>
            </div>
            <div className="md:text-right">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Booking Date</h3>
              <p className="text-xl font-bold text-gray-900">{format(new Date(booking.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Flight Information</h3>
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Plane className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flight Number</p>
                    <p className="font-bold text-gray-900">{flight.flightNumber} ({flight.aircraft})</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Departure Date</p>
                    <p className="font-bold text-gray-900">{format(new Date(flight.departureTime), 'EEEE, MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="flex justify-between items-center relative">
                  <div className="z-10 bg-gray-50 pr-4">
                    <p className="text-2xl font-bold text-gray-900">{format(new Date(flight.departureTime), 'HH:mm')}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {flight.origin}
                    </p>
                  </div>
                  <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gray-200 -z-0"></div>
                  <div className="z-10 bg-gray-50 pl-4 text-right">
                    <p className="text-2xl font-bold text-gray-900">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" /> {flight.destination}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm uppercase tracking-widest font-medium">
                  <Clock className="h-4 w-4" /> Non-Stop Flight
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600">
                <Printer className="h-4 w-4" /> Print
              </button>
              <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600">
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Total Amount Paid</p>
              <p className="text-4xl font-bold text-primary-600">${flight.price}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <Link href="/my-bookings" className="text-primary-600 font-bold hover:text-primary-700 underline underline-offset-4">
            View all my bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
