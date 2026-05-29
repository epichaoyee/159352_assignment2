'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Search } from 'lucide-react';
import { AIRPORTS } from '@/lib/constants';

export default function SearchForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState('NZNE');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin) { alert('Please select an origin airport.'); return; }
    if (!destination) { alert('Please select a destination airport.'); return; }
      if (!date) { alert('Please select a departure date.'); return; }
    if (origin === destination) { alert('Origin and destination cannot be the same.'); return; }
      router.push(`/search?origin=${origin}&destination=${destination}&date=${date}`);
  };

  return (
    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end" noValidate>
      <div className="text-left">
         <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <MapPin className="h-4 w-4" /> From
        </label>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
        >
          <option value="">Select Origin</option>
          {Object.entries(AIRPORTS).map(([code, airport]) => (
              <option key={code} value={code}>{airport.city} ({code})</option>
          ))}
        </select>
      </div>

      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <MapPin className="h-4 w-4" /> To
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
        >
           <option value="">Select Destination</option>
          {Object.entries(AIRPORTS).map(([code, airport]) => (
            <option key={code} value={code}>{airport.city} ({code})</option>
          ))}
        </select>
      </div>

      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Calendar className="h-4 w-4" /> Date
        </label>
        <input
          type="date"
          value={date}
            min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors h-[50px]"
      >
         <Search className="h-5 w-5" /> Search Flights
      </button>
    </form>
  );
}
