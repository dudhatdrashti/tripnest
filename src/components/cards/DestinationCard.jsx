import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Star,
  ArrowRight,
  Umbrella,
  Sparkles,
  Heart,
  Mountain,
  Landmark,
  ShoppingBag,
  Utensils,
  Compass,
  Building2,
  Palmtree,
} from 'lucide-react';

// Map destination tags to premium icons
const tagIcons = {
  beach: Umbrella,
  luxury: Sparkles,
  romantic: Heart,
  mountain: Mountain,
  heritage: Landmark,
  shopping: ShoppingBag,
  food: Utensils,
  nature: Compass,
  culture: Landmark,
  urban: Building2,
  tropical: Palmtree,
  modern: Building2,
  desert: Umbrella,
  city: Building2,
};

// Destination-relevant stats (Experiences / Resorts / Attractions) instead of hotel counts
const destinationStats = {
  Paris: { value: 12, label: 'Experiences' },
  Maldives: { value: 8, label: 'Luxury Resorts' },
  'Swiss Alps': { value: 25, label: 'Attractions' },
  'New York': { value: 40, label: 'Experiences' },
  Jaipur: { value: 18, label: 'Palaces' },
  Dubai: { value: 30, label: 'Attractions' },
  Tokyo: { value: 22, label: 'Experiences' },
  Bali: { value: 15, label: 'Retreats' },
};

export default function DestinationCard({ destination, index = 0 }) {
  const stat = destinationStats[destination.name] || {
    value: destination.hotels || 0,
    label: 'Experiences',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={`/destination/${destination.id}`}
        className="group block relative overflow-hidden rounded-3xl h-80 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary-900/20 dark:hover:shadow-black/50"
      >
        {/* Image with zoom on hover */}
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Rating badge — glassmorphism */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1.5 rounded-full shadow-lg shadow-black/20">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-white">{destination.rating}</span>
            <span className="text-[11px] text-white/80 font-medium">Excellent</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
          <div className="flex items-center gap-4 text-white/80 text-sm mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {destination.country}
            </span>
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              {stat.value} {stat.label}
            </span>
          </div>
          {/* Concise premium description */}
          <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
            {destination.description}
          </p>

          {/* Glass tags with icons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {destination.tags.slice(0, 3).map((tag) => {
              const TagIcon = tagIcons[tag] || Compass;
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-xs text-white"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              );
            })}
          </div>

          {/* Hover CTA */}
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            Explore Destination
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
