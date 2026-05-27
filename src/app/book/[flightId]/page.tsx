'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IFlight } from '@/lib/models/Flight';
import { AIRPORTS } from '@/lib/constants';
import { format } from 'date-fns';
import { Plane, User, Mail, CreditCard, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const { flightId } = useParams();
  
  const [flight, setFlight] = useState<IFlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
  });

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch(`/api/flights/${flightId}`);
        if (!res.ok) throw new Error('Flight not found');
        const data = await res.json();
        setFlight(data);
      } catch (error) {
        console.error('Error fetching flight:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId,
          ...formData,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to create booking');
        return;
      }
      
      const booking = await res.json();
      router.push(`/invoice/${booking._id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-12 w-12 text-primary-600 animate-spin" /></div>;
  }

  if (!flight) {
    return <div className="text-center py-20">Flight not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-primary-600" /> Passenger Information
            </h2>
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={formData.passengerName}
                      onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={formData.passengerEmail}
                      onChange={(e) => setFormData({ ...formData, passengerEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary-600" /> Payment Details
            </h2>
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary-900">Secure Booking</p>
                <p className="text-sm text-primary-700">Payment will be processed through our secure gateway. You will receive an invoice after confirmation.</p>
              </div>
            </div>
            <div className="mt-8">
              <button
                form="booking-form"
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Booking'}
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="bg-primary-600 p-6 text-white">
              <h3 className="text-lg font-bold">Flight Summary</h3>
              <p className="text-primary-100 text-sm">{flight.flightNumber}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Departure</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{format(new Date(flight.departureTime), 'HH:mm')}</p>
                  <p className="text-sm text-gray-600">{flight.origin}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 mt-6" />
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Arrival</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
                  <p className="text-sm text-gray-600">{flight.destination}</p>
                </div>
              </div>
              <div className="border-t border-dashed pt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Aircraft</span>
                  <span className="font-medium">{flight.aircraft}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Date</span>
                  <span className="font-medium">{format(new Date(flight.departureTime), 'MMM dd, yyyy')}</span>
                </div>
              </div>
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-3xl font-bold text-primary-600">${flight.price}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right uppercase tracking-widest italic">All taxes included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
