import SearchForm from '@/components/SearchForm';
import { Plane, MapPin, Calendar, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center bg-primary-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
          <img 
              src="https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=2070&auto=format&fit=crop" 
            alt="Private Jet" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Luxury Travel, Simplified.
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Experience the ultimate point-to-point service from Dairy Flat Airport to Sydney, Rotorua, Great Barrier Island, and more.
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <SearchForm />
            <p className="mt-4 text-xs text-gray-400 text-center">
              Tip: Some routes are infrequent — e.g. Sydney departs Fridays only, Rotorua runs Mon–Fri, Great Barrier Mon/Wed/Fri.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Fly With Us?</h2>
            <p className="mt-4 text-lg text-gray-600">Premium service for the discerning traveler.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="h-8 w-8 text-primary-600" />
                </div>
              <h3 className="text-xl font-semibold mb-3">Modern Fleet</h3>
              <p className="text-gray-600">Fly in our SyberJet SJ30i, Cirrus SF50, or HondaJet Elite aircraft.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exclusive Routes</h3>
              <p className="text-gray-600">Direct flights from Dairy Flat to key destinations in NZ and Australia.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intimate Experience</h3>
              <p className="text-gray-600">Small passenger counts ensure a personalized and luxury experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Preview */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sydney', code: 'YSSY', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop' },
               { name: 'Rotorua', code: 'NZRO', image: 'https://images.unsplash.com/photo-1589871146114-066802382547?q=80&w=2070&auto=format&fit=crop' },
              { name: 'Great Barrier Island', code: 'NZGB', image: 'https://images.unsplash.com/photo-1610405105252-969f6979435b?q=80&w=2070&auto=format&fit=crop' },
            ].map((dest) => (
              <div key={dest.code} className="group relative rounded-xl overflow-hidden shadow-lg h-64">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-xl">{dest.name}</h3>
                    <p className="text-gray-200">{dest.code}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
