/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Check, MapPin, Search as SearchIcon, SearchXIcon, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import AuthModal from "../components/AuthModal.tsx";
import RestaurantCard from "../components/RestaurantCard.tsx";
import { api, apiError } from "../lib/api";
import toast from "react-hot-toast";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchVal = searchParams.get("search") || "";
  const locationVal = searchParams.get("location") || "";
  const cuisinesSelected = searchParams.getAll("cuisine");
  const pricesSelected = searchParams.getAll("priceRange");
  const sortVal = searchParams.get("sort") || "";
  const [tempSearch, setTempSearch] = useState(searchVal);
  const [tempLocation, setTempLocation] = useState(locationVal);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => { setTempSearch(searchVal); setTempLocation(locationVal); }, [searchVal, locationVal]);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/restaurants", { params: { search: searchVal || undefined, location: locationVal || undefined, cuisine: cuisinesSelected.join(",") || undefined, priceRange: pricesSelected.join(",") || undefined, sort: sortVal || undefined } });
        setRestaurants(data.restaurants || []);
      } catch (error) { toast.error(apiError(error, "Unable to load restaurants")); }
      finally { setLoading(false); }
    };
    fetchRestaurants();
  }, [searchVal, locationVal, cuisinesSelected.join(","), pricesSelected.join(","), sortVal]);

  const priceOptions = ["$", "$$", "$$$", "$$$$"];
  const cuisineOptions = ["Italian", "French", "Japanese", "Steakhouse", "Vegetarian"];
  const toggleMulti = (key: string, val: string) => { const next = new URLSearchParams(searchParams); const current = next.getAll(key); next.delete(key); (current.includes(val) ? current.filter((x) => x !== val) : [...current, val]).forEach((x) => next.append(key, x)); setSearchParams(next); };
  const clearAllFilters = () => { setSearchParams(new URLSearchParams()); setTempSearch(""); setTempLocation(""); };
  const queryLabel = useMemo(() => restaurants.length === 1 ? "Restaurant" : "Restaurants", [restaurants.length]);

  return <div className="min-h-screen bg-surface flex flex-col pt-20"><Navbar /><AuthModal />
    <div className="bg-white border-b border-outline-variant/10 py-4 z-10 sticky top-16 shadow-sm"><div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row gap-4 items-center justify-between">
      <form onSubmit={(e) => { e.preventDefault(); const next = new URLSearchParams(searchParams); tempSearch ? next.set("search", tempSearch) : next.delete("search"); tempLocation ? next.set("location", tempLocation) : next.delete("location"); setSearchParams(next); }} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="relative grow sm:grow-0 min-w-[200px]"><SearchIcon size={16} className="absolute left-2.5 top-2 text-black/55" /><input value={tempSearch} onChange={(e) => setTempSearch(e.target.value)} placeholder="Search cuisine or name..." className="w-full pl-9 pr-3 py-2 text-xs border border-outline-variant/40 rounded-md focus:border-secondary focus:outline-none bg-surface-container-low/30" /></div>
        <div className="relative grow sm:grow-0 min-w-[200px]"><MapPin size={16} className="absolute left-2.5 top-2 text-black/55" /><input value={tempLocation} onChange={(e) => setTempLocation(e.target.value)} placeholder="Location..." className="w-full pl-9 pr-3 py-2 text-xs border border-outline-variant/40 rounded-md focus:border-secondary focus:outline-none bg-surface-container-low/30" /></div>
        <button className="bg-primary hover:bg-secondary text-white text-[10px] font-medium tracking-wider uppercase px-5 py-2.5 rounded-md cursor-pointer">UPDATE</button>
      </form>
      <button onClick={() => setShowMobileFilters(true)} className="md:hidden flex items-center gap-1.5 border border-outline-variant/50 text-xs font-medium px-4 py-2 bg-white cursor-pointer"><SlidersHorizontal size={14}/>Filters</button>
    </div></div>
    <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-10 flex gap-10">
      <aside className="hidden md:block w-64 shrink-0"><div className="sticky top-44 space-y-8"><div className="flex justify-between items-center pb-4 border-b border-outline-variant/10"><h3 className="font-display text-lg font-medium text-primary">Filters</h3><button onClick={clearAllFilters} className="text-[10px] font-medium text-secondary uppercase cursor-pointer">Clear All</button></div>
        <div className="space-y-3"><h4 className="text-xs font-medium text-primary tracking-wider uppercase">Cuisine</h4>{cuisineOptions.map((c) => <button key={c} onClick={() => toggleMulti("cuisine", c)} className="w-full flex items-center justify-between text-left text-xs text-black/55 py-1 cursor-pointer"><span>{c}</span><span className={`w-4 h-4 border rounded-sm flex items-center justify-center ${cuisinesSelected.includes(c) ? "bg-primary border-primary text-white" : "border-outline-variant"}`}>{cuisinesSelected.includes(c) && <Check size={10}/>}</span></button>)}</div>
        <div className="space-y-3"><h4 className="text-xs text-primary tracking-wider uppercase">Price Range</h4><div className="grid grid-cols-4 gap-1.5">{priceOptions.map((p) => <button key={p} onClick={() => toggleMulti("priceRange", p)} className={`py-2 text-center text-xs border rounded-sm cursor-pointer ${pricesSelected.includes(p) ? "bg-primary border-primary text-white" : "border-outline-variant/50"}`}>{p}</button>)}</div></div>
      </div></aside>
      <div className="flex-1 flex flex-col"><div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/10"><p className="text-sm text-black/55">{restaurants.length} {queryLabel} Available</p><select value={sortVal} onChange={(e) => { const next = new URLSearchParams(searchParams); e.target.value ? next.set("sort", e.target.value) : next.delete("sort"); setSearchParams(next); }} className="text-xs bg-transparent border border-outline-variant/30 px-3 py-1.5 focus:outline-none"><option value="">Default (Newest)</option><option value="price_low">Price: Low to High</option><option value="price_high">Price: High to Low</option></select></div>
        {loading ? <div className="grow flex justify-center py-24"><div className="w-10 h-10 border-2 border-outline-variant/30 border-t-secondary rounded-full animate-spin"/></div> : restaurants.length === 0 ? <div className="grow flex flex-col items-center justify-center py-24 text-center"><SearchXIcon size={36} className="text-outline-variant mb-4"/><h3 className="font-display text-xl font-medium mb-2">No Restaurants Found</h3><p className="text-xs text-black/50 max-w-sm mb-6">We couldn't find any premium establishments matching your search query.</p><button onClick={clearAllFilters} className="bg-primary hover:bg-secondary text-white text-xs tracking-widest uppercase px-6 py-3">CLEAR ALL FILTERS</button></div> : <div className="grid gap-6 grow grid-cols-1 lg:grid-cols-2">{restaurants.map((restaurant) => <RestaurantCard key={restaurant._id} restaurant={restaurant}/>)}</div>}
      </div>
    </main>
    {showMobileFilters && <div className="fixed inset-0 z-50 flex justify-end bg-black/50 md:hidden"><div className="w-80 bg-white h-full p-6 flex flex-col justify-between"><div><div className="flex justify-between items-center pb-4 border-b"><h3 className="font-display text-lg">Filters</h3><button onClick={() => setShowMobileFilters(false)}><X/></button></div><div className="py-6">{cuisineOptions.map((c) => <button key={c} onClick={() => toggleMulti("cuisine", c)} className="w-full flex justify-between py-2 text-xs"><span>{c}</span><Check size={12} className={cuisinesSelected.includes(c) ? "text-primary" : "text-transparent"}/></button>)}</div><div className="border-t pt-4 grid grid-cols-4 gap-1">{priceOptions.map((p) => <button key={p} onClick={() => toggleMulti("priceRange", p)} className={`py-2 text-xs border ${pricesSelected.includes(p) ? "bg-primary text-white" : ""}`}>{p}</button>)}</div></div><div className="border-t pt-4 flex gap-3"><button onClick={clearAllFilters} className="flex-1 border py-3 text-xs">CLEAR</button><button onClick={() => setShowMobileFilters(false)} className="flex-1 bg-primary text-white py-3 text-xs">APPLY</button></div></div></div>}
    <Footer/></div>;
}
