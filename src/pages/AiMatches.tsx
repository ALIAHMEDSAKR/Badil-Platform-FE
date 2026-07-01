import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Activity, Zap } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { aiMatchApi, type ResourceMatchDto } from "../api/aiMatchApi";
import { wasteListingApi } from "../api/wasteListingApi";
import { materialRequestApi } from "../api/materialRequestApi";
import { useAuthStore } from "../store/authStore";
import type { WasteListingDto } from "../types/wasteListing";
import type { MaterialRequestDto } from "../types/materialRequest";

export function AiMatches() {
  const { isAdmin } = useAuthStore();
  const [matches, setMatches] = useState<ResourceMatchDto[]>([]);
  const [listings, setListings] = useState<Record<string, WasteListingDto>>({});
  const [requests, setRequests] = useState<Record<string, MaterialRequestDto>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // First fetch all matches (or just personal matches if we had a /mine endpoint)
      // Since ResourceMatchController only has GetAll, we will filter on the frontend for now
      // assuming we can see our own listings/requests
      const allMatches = await aiMatchApi.getAll();
      
      const myListings = await wasteListingApi.getMine();
      const myRequests = await materialRequestApi.getMine();
      
      const myListingIds = new Set(myListings.map(l => l.id));
      const myRequestIds = new Set(myRequests.map(r => r.id));

      const relevantMatches = isAdmin 
        ? allMatches 
        : allMatches.filter(m => myListingIds.has(m.listingId) || myRequestIds.has(m.requestId));

      setMatches(relevantMatches);

      // Fetch the details for the matched listings/requests
      const listingIdsToFetch = new Set(relevantMatches.map(m => m.listingId));
      const requestIdsToFetch = new Set(relevantMatches.map(m => m.requestId));

      const listingMap: Record<string, WasteListingDto> = {};
      const requestMap: Record<string, MaterialRequestDto> = {};

      await Promise.all([
        ...Array.from(listingIdsToFetch).map(async id => {
          try {
            const l = await wasteListingApi.getById(id);
            listingMap[id] = l;
          } catch { /* ignore if not found */ }
        }),
        ...Array.from(requestIdsToFetch).map(async id => {
          try {
            const r = await materialRequestApi.getById(id);
            requestMap[id] = r;
          } catch { /* ignore if not found */ }
        })
      ]);

      setListings(listingMap);
      setRequests(requestMap);
    } catch (err) {
      setError("Failed to load AI matches.");
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAutoMatch = async () => {
    setIsMatching(true);
    try {
      const res = await aiMatchApi.autoMatch();
      alert(`Auto-match complete. Created ${res.matchesCreated} new matches.`);
      fetchData();
    } catch (err: any) {
      alert("Failed to run auto-match engine. " + (err?.response?.data?.message || ""));
    } finally {
      setIsMatching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (score >= 70) return "text-teal-400 bg-teal-400/10 border-teal-400/20";
    if (score >= 50) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Analyzing compatibility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#2dd4bf]" />
            AI Matches
          </h1>
          <p className="text-gray-400 mt-1">
            Machine learning powered recommendations for industrial symbiosis.
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={handleAutoMatch}
            isLoading={isMatching}
            leftIcon={<Zap className="w-4 h-4" />}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none"
          >
            Run Auto-Match Engine
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <Card className="dashboard-card flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-[#1a2e2e] rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Matches Found</h3>
          <p className="text-gray-400 max-w-md">
            Our AI engine hasn't found any highly compatible matches for your listings or requests yet. Check back later or create more detailed listings!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => {
            const listing = listings[match.listingId];
            const request = requests[match.requestId];
            const scoreClass = getScoreColor(match.semanticCompatibilityScore);

            return (
              <Card key={match.id} className="dashboard-card hover:border-[#2dd4bf]/30 transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${scoreClass}`}>
                    <Sparkles className="w-3 h-3" />
                    {match.semanticCompatibilityScore.toFixed(0)}% Match
                  </div>
                  <span className="text-xs text-gray-500">
                    {match.distanceKm.toFixed(1)} km away
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  {/* Seller / Listing Side */}
                  <div className="bg-[#1a2e2e]/50 p-3 rounded-lg border border-[var(--border)] h-full flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                      Available Resource
                    </span>
                    <span className="text-sm font-semibold text-white line-clamp-2">
                      {listing ? listing.materialType : "Loading..."}
                    </span>
                    {listing && (
                      <span className="text-xs text-[#2dd4bf] mt-auto pt-2">
                        {listing.quantity} kg
                      </span>
                    )}
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-600" />

                  {/* Buyer / Request Side */}
                  <div className="bg-[#1a2e2e]/50 p-3 rounded-lg border border-[var(--border)] h-full flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">
                      Target Request
                    </span>
                    <span className="text-sm font-semibold text-white line-clamp-2">
                      {request ? request.materialType : "Loading..."}
                    </span>
                    {request && (
                      <span className="text-xs text-amber-400 mt-auto pt-2">
                        Needs {request.targetQuantity} units
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-end gap-2">
                  {listing && (
                    <Link to={`/app/marketplace/${listing.id}`}>
                      <Button variant="outline" size="sm">View Listing</Button>
                    </Link>
                  )}
                  {request && (
                    <Link to={`/app/requests/${request.id}`}>
                      <Button variant="outline" size="sm">View Request</Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
