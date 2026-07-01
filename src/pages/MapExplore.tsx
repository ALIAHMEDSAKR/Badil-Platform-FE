import { useState, useEffect, useMemo } from "react";
import { MapPin, SlidersHorizontal, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Card } from "../components/ui/Card";
import { companyApi } from "../api/companyApi";
import type { CompanyDto } from "../types/company";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon issue
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useAuthStore } from "../store/authStore";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

/** Calculate distance between two coordinates in km using Haversine formula */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function MapExplore() {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [radius, setRadius] = useState<number>(50); // km
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await companyApi.getAll();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to load companies for map", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const myCompany = useMemo(() => {
    if (!user) return null;
    return companies.find((c) => c.userId === user.id) || null;
  }, [companies, user]);

  const mapCenter: [number, number] = myCompany
    ? [myCompany.latitude, myCompany.longitude]
    : [24.7136, 46.6753]; // Default to Riyadh

  const filteredCompanies = useMemo(() => {
    if (!myCompany) return companies;
    return companies.filter((c) => {
      // Always include my own company
      if (c.id === myCompany.id) return true;
      const dist = getDistanceKm(
        myCompany.latitude,
        myCompany.longitude,
        c.latitude,
        c.longitude
      );
      return dist <= radius;
    });
  }, [companies, myCompany, radius]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-up">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#2dd4bf]" />
            Map Explore
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Discover nearby factories for symbiotic opportunities.
          </p>
        </div>
        
        {myCompany && (
          <Card className="dashboard-card py-2 px-4 flex items-center gap-4 border-[#2dd4bf]/20 bg-[#2dd4bf]/5">
            <SlidersHorizontal className="w-5 h-5 text-[#2dd4bf]" />
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Search Radius: {radius} km
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-48 accent-[#2dd4bf]"
              />
            </div>
          </Card>
        )}
      </div>

      <Card className="dashboard-card flex-1 p-0 overflow-hidden relative border-[var(--border)] border">
        {!myCompany && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-amber-500/90 text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
            Create a company profile in Settings to enable radius search.
          </div>
        )}
        
        <MapContainer
          center={mapCenter}
          zoom={myCompany ? 10 : 5}
          className="w-full h-full z-0 bg-[#0f172a]"
        >
          {/* CartoDB Dark Matter tile layer matches our UI nicely */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {myCompany && (
            <Circle
              center={mapCenter}
              radius={radius * 1000} // Leaflet radius is in meters
              pathOptions={{ fillColor: "#2dd4bf", color: "#2dd4bf", fillOpacity: 0.1, weight: 1 }}
            />
          )}

          {filteredCompanies.map((c) => (
            <Marker key={c.id} position={[c.latitude, c.longitude]}>
              <Popup className="custom-popup">
                <div className="p-1">
                  <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    {c.name}
                    {c.id === myCompany?.id && (
                      <span className="text-[10px] bg-[#2dd4bf] text-black px-1.5 py-0.5 rounded uppercase font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{c.sector}</div>
                  <div className="text-xs text-gray-500">
                    {c.address}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>
    </div>
  );
}
