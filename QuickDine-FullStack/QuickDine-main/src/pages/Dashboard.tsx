/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import RestaurantCard from "../components/RestaurantCard.tsx";
import AuthModal from "../components/AuthModal.tsx";
import { api, apiError, mediaUrl } from "../lib/api";

export default function Dashboard() {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [{ data: bookingData }, { data: recommendationData }] = await Promise.all([
          api.get("/bookings/my"),
          api.get("/restaurants/featured"),
        ]);
        setBookings(bookingData.bookings || []);
        setRecommendations(recommendationData.restaurants || []);
      } catch (error) {
        toast.error(apiError(error, "Unable to load dashboard"));
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((booking) => {
    return new Date(booking.date) >= today && booking.status === "confirmed";
  });

  const pastBookings = bookings.filter((booking) => {
    return new Date(booking.date) < today || booking.status !== "confirmed";
  });

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
      setBookings((prev) => prev.map((booking) => (booking._id === bookingId ? data.booking : booking)));
      toast.success("Reservation cancelled successfully.");
    } catch (error) {
      toast.error(apiError(error, "Cancellation failed"));
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col pt-20">
      <Navbar />
      <AuthModal />

      <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
        <div className="space-y-10">
          <div className="pb-4 border-b border-outline-variant/10">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary">
              Welcome back, {user.name.split(" ")[0]}
            </h2>
            <p className="text-xs text-black/55 mt-1.5">Manage your upcoming dining experiences.</p>
          </div>

          <section className="space-y-4">
            <h3 className="font-display text-lg font-medium text-primary">Upcoming Bookings</h3>

            {loadingBookings ? (
              <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">Loading...</div>
            ) : upcomingBookings.length === 0 ? (
              <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">
                <CalendarDaysIcon size={36} className="mx-auto text-outline-variant mb-2" />
                <p className="text-xs text-black/55 italic">No upcoming reservations scheduled.</p>
                <Link
                  to="/search"
                  className="inline-block mt-4 bg-primary hover:bg-secondary text-white text-[10px] font-medium tracking-widest uppercase px-6 py-2.5"
                >
                  Book a Table
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 bg-surface">
                        <img
                          src={mediaUrl(booking.restaurant?.image)}
                          alt={booking.restaurant?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-medium text-secondary tracking-widest uppercase">
                          {booking.restaurant?.cuisine}
                        </span>
                        <h4 className="font-display text-base font-medium text-primary">{booking.restaurant?.name}</h4>
                        <p className="text-xs text-black/55 flex items-center gap-1">
                          <MapPinIcon size={12} /> {booking.restaurant?.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-on-surface bg-surface-container-low p-4 rounded-md border border-outline-variant/10 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={14} className="text-secondary" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon size={14} className="text-secondary" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon size={14} className="text-secondary" />
                        <span>{booking.guests} Guests</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase text-error border border-outline-variant/40 rounded-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            {!loadingBookings && pastBookings.length > 0 && (
              <>
                <h3 className="font-display text-lg font-medium text-primary">Dining History</h3>
                <div className="bg-white border border-outline-variant/20 rounded-md overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-medium tracking-wider text-black/55 uppercase">
                        <th className="p-4">Restaurant</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Party</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {pastBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-surface/50">
                          <td className="p-4 font-medium text-primary">
                            <Link to={`/restaurant/${booking.restaurant?.slug}`} className="hover:text-secondary">
                              {booking.restaurant?.name}
                            </Link>
                          </td>
                          <td className="p-4">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </td>
                          <td className="p-4">{booking.guests} Guests</td>
                          <td className="p-4">
                            <span className="text-[9px] uppercase tracking-wider">{booking.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {recommendations.length > 0 && (
            <section className="space-y-4 pt-10 border-t border-outline-variant/10">
              <h3 className="font-display text-lg font-medium text-primary">Recommended for You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.slice(0, 3).map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
