import { hotels, destinations, testimonials, specialOffers, categories, stats } from '../data/hotels';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Hotels
  async getHotels(filters = {}) {
    await delay(500);
    let results = [...hotels];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(
        (h) =>
          h.name.toLowerCase().includes(search) ||
          h.location.city.toLowerCase().includes(search) ||
          h.location.country.toLowerCase().includes(search) ||
          h.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (filters.minPrice) {
      results = results.filter((h) => h.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter((h) => h.price <= Number(filters.maxPrice));
    }
    if (filters.rating) {
      results = results.filter((h) => h.rating >= Number(filters.rating));
    }
    if (filters.propertyType) {
      results = results.filter((h) => h.propertyType === filters.propertyType);
    }
if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter((h) =>
        filters.amenities.every((a) => h.amenities.includes(a))
      );
    }

    // Feature filters (freeCancellation, family, etc.)
    if (filters.features && filters.features.length > 0) {
      results = results.filter((h) => {
        const amenityMap = {
          breakfast: 'breakfast',
          pool: 'pool',
          parking: 'parking',
          wifi: 'wifi',
          ac: 'ac',
          pets: 'pets',
        };
        return filters.features.every((f) => {
          if (f === 'freeCancellation') return true; // all hotels offer free cancellation in mock data
          if (f === 'family') return true; // all hotels are considered family-friendly
          return h.amenities.includes(amenityMap[f]);
        });
      });
    }
if (filters.sort) {
      switch (filters.sort) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          results.sort((a, b) => a.id - b.id);
          break;
        case 'recommended':
          results.sort(
            (a, b) =>
              (b.popular ? 1 : 0) - (a.popular ? 1 : 0) ||
              b.rating - a.rating ||
              b.reviews - a.reviews
          );
          break;
        default:
          results.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      }
    }

    return results;
  },

  async getHotelById(id) {
    await delay(300);
    return hotels.find((h) => h.id === Number(id)) || null;
  },

  async getFeaturedHotels() {
    await delay(400);
    return hotels.filter((h) => h.featured);
  },

  async getPopularHotels() {
    await delay(400);
    return hotels.filter((h) => h.popular);
  },

  async getSimilarHotels(hotelId, limit = 4) {
    await delay(300);
    const hotel = hotels.find((h) => h.id === Number(hotelId));
    if (!hotel) return [];
    return hotels
      .filter(
        (h) =>
          h.id !== Number(hotelId) &&
          (h.location.city === hotel.location.city ||
            h.tags.some((t) => hotel.tags.includes(t)))
      )
      .slice(0, limit);
  },

  // Destinations
  async getDestinations() {
    await delay(400);
    return destinations;
  },

  async getDestinationById(id) {
    await delay(300);
    return destinations.find((d) => d.id === Number(id)) || null;
  },

  async getDestinationHotels(destinationId) {
    await delay(400);
    const dest = destinations.find((d) => d.id === Number(destinationId));
    if (!dest) return [];
    return hotels.filter(
      (h) =>
        h.location.city.toLowerCase() === dest.name.toLowerCase() ||
        h.location.country.toLowerCase() === dest.country.toLowerCase()
    );
  },

  // Testimonials
  async getTestimonials() {
    await delay(200);
    return testimonials;
  },

  // Special Offers
  async getSpecialOffers() {
    await delay(300);
    return specialOffers;
  },

  // Categories
  async getCategories() {
    await delay(200);
    return categories;
  },

  // Stats
  async getStats() {
    await delay(200);
    return stats;
  },

  // Search suggestions
  async getSearchSuggestions(query) {
    await delay(200);
    if (!query) return { hotels: [], destinations: [] };
    const q = query.toLowerCase();

    const matchedHotels = hotels
      .filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.city.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedDestinations = destinations
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 5);

    return { hotels: matchedHotels, destinations: matchedDestinations };
  },

  // Bookings
  async createBooking(bookingData) {
    await delay(800);
    const booking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    const bookings = JSON.parse(localStorage.getItem('tripnest_bookings') || '[]');
    bookings.unshift(booking);
    localStorage.setItem('tripnest_bookings', JSON.stringify(bookings));
    return booking;
  },

  async getUserBookings() {
    await delay(400);
    return JSON.parse(localStorage.getItem('tripnest_bookings') || '[]');
  },

  async cancelBooking(bookingId) {
    await delay(300);
    const bookings = JSON.parse(localStorage.getItem('tripnest_bookings') || '[]');
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
    localStorage.setItem('tripnest_bookings', JSON.stringify(updated));
    return updated.find((b) => b.id === bookingId);
  },
};
