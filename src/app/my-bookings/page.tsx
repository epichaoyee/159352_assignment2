'use client';

import { useState, useEffect } from 'react';
import { IBooking } from '@/lib/models/Booking';
import { IFlight } from '@/lib/models/Flight';
import { format } from 'date-fns';
import { Search, User, Plane, Calendar, MapPin, XCircle, Loader2, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [passengerName, setPassengerName] = useState('');
  const [bookings, setBookings] = useState<(IBooking & { flightId: IFlight })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sampleNames, setSampleNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchSampleNames = async () => {
      try {
        const res = await fetch('/api/bookings/sample-names');
        const data = await res.json();
        setSampleNames(data.names || []);
      } catch (error) {
        console.error('Error fetching sample names:', error);
      }
    };
    fetchSampleNames();
  }, []);

  const handleSearch = async (e?: React.FormEvent, name?: string) => {
    if (e) e.preventDefault();
    const searchName = name || passengerName;
    if (!searchName.trim()) { alert('Please enter a passenger name.'); return; }

    setPassengerName(searchName);
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/bookings?passengerName=${encodeURIComponent(searchName)}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings(bookings.filter(b => b._id.toString() !== bookingId));
        alert('Booking cancelled successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Your Bookings</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your full name as it appears on your booking to view and manage your flight schedules.
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="flex gap-2" noValidate>
          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter passenger name"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            Search
          </button>
        </form>

        {sampleNames.length > 0 && !searched && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 mb-3 flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4" /> Try clicking a passenger name below
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {sampleNames.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSearch(undefined, name)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all shadow-sm"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
              <p className="mt-4 text-gray-500">Retrieving your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No active bookings found</h2>
              <p className="text-gray-600 mb-6">We couldn't find any active bookings for "{passengerName}".</p>
              {sampleNames.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">Try one of these passengers instead:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {sampleNames.filter(n => n !== passengerName).slice(0, 10).map((name) => (
                      <button
                        key={name}
                        onClick={() => handleSearch(undefined, name)}
                        className="px-4 py-2 bg-primary-50 border border-primary-100 rounded-full text-sm text-primary-700 hover:bg-primary-100 transition-all"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Active Bookings ({bookings.length})
              </h2>
              {bookings.map((booking) => (
                <div key={booking._id.toString()} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Flight Info */}
                    <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">
                          {booking.flightId.flightNumber}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">Ref: {booking.bookingReference}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xl font-bold text-gray-900">{format(new Date(booking.flightId.departureTime), 'HH:mm')}</p>
                          <p className="text-sm text-gray-500">{booking.flightId.origin}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <Plane className="h-4 w-4 text-gray-300" />
                          <div className="w-full h-[1px] bg-gray-100 mt-1"></div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{format(new Date(booking.flightId.arrivalTime), 'HH:mm')}</p>
                          <p className="text-sm text-gray-500">{booking.flightId.destination}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(booking.flightId.departureTime), 'MMM dd, yyyy')}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {booking.flightId.aircraft}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="bg-gray-50/50 p-6 flex flex-row md:flex-col justify-center gap-4 min-w-[200px]">
                      <Link 
                        href={`/invoice/${booking._id}`}
                        className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-sm text-center hover:bg-gray-50 transition-colors"
                      >
                        View Invoice
                      </Link>
                      <button 
                        onClick={() => handleCancel(booking._id.toString())}
                        className="flex-1 py-2 px-4 bg-white border border-red-100 text-red-600 font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="h-4 w-4" /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
