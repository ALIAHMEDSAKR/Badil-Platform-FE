// ═══════════════════════════════════════════════════════════════════
// Badil Platform — User & Company Settings Page
// Wired to: companyApi, authStore
// Uses: Card, Input, Button, Badge
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";
import { User, Building2, Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { companyApi } from "../api/companyApi";
import { verificationApi } from "../api/verificationApi";
import { useAuthStore } from "../store/authStore";
import type { CompanyDto } from "../types/company";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon resolution in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (p: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
}

// ── Decode user ID from token helper ──
function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload.nameid ||
      payload.sub ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      null
    );
  } catch {
    return null;
  }
}

export function Settings() {
  const { user, token } = useAuthStore();
  const currentUserId = useMemo(() => getUserIdFromToken(token), [token]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Company Profile Details
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [hasCompany, setHasCompany] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState("");
  const [commercialRegisterNumber, setCommercialRegisterNumber] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  // Fetch company details
  const fetchCompanyDetails = async () => {
    setIsFetching(true);
    setError("");
    try {
      const allCompanies = await companyApi.getAll();
      // Filter for company owned by this user
      const userCompany = allCompanies.find(
        (c) => c.userId === currentUserId || c.userId?.toLowerCase() === currentUserId?.toLowerCase()
      );

      if (userCompany) {
        setCompany(userCompany);
        setHasCompany(true);
        setName(userCompany.name || "");
        setSector(userCompany.sector || "");
        setAddress(userCompany.address || "");
        setTaxRegistrationNumber(userCompany.taxRegistrationNumber || "");
        setCommercialRegisterNumber(userCompany.commercialRegisterNumber || "");
        setLatitude(userCompany.latitude || 30.0444); // Fallback to Cairo lat
        setLongitude(userCompany.longitude || 31.2357); // Fallback to Cairo lng
      } else {
        setHasCompany(false);
        // Defaults for Cairo
        setLatitude(30.0444);
        setLongitude(31.2357);
      }
    } catch (err) {
      setError("Failed to fetch company settings. The backend may be offline.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [currentUserId]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Company Name is required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (hasCompany && company) {
        await companyApi.update(company.id, {
          id: company.id,
          name,
          sector,
          address,
          taxRegistrationNumber,
          commercialRegisterNumber,
          latitude,
          longitude,
        });
        setSuccessMsg("Company profile updated successfully!");
      } else {
        const created = await companyApi.create({
          name,
          sector,
          address,
          taxRegistrationNumber,
          commercialRegisterNumber,
          latitude,
          longitude,
        });
        setCompany(created);
        setHasCompany(true);
        setSuccessMsg("Company profile registered successfully!");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadVerification = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    if (!company) {
      setError("Please save your company profile first before uploading verification docs.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setUploadingDoc(true);
    setError("");
    setSuccessMsg("");
    try {
      const myReqs = await verificationApi.getMine();
      let pendingReq = myReqs.find((r) => r.companyId === company.id && r.status === "Pending");
      if (!pendingReq) {
        pendingReq = await verificationApi.create({ companyId: company.id, documentUrls: [] });
      }
      await verificationApi.uploadDocument(pendingReq.id, file);
      setSuccessMsg("Verification document uploaded! It is now pending review.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to upload document.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setUploadingDoc(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2dd4bf]" />
        <p className="text-sm text-gray-400 mt-4">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your personal details, factory coordinates, and company tax registry.
        </p>
      </div>

      {/* Success/Error status */}
      {successMsg && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User profile side card */}
        <div className="lg:col-span-1 space-y-6">
          <Card header={<h3 className="font-semibold text-white">Personal Account</h3>}>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-20 h-20 rounded-full bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-[#2dd4bf]" />
              </div>
              <h2 className="text-lg font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              <div className="mt-4">
                <Badge variant="teal" size="sm">
                  Role: {user?.role || "User"}
                </Badge>
              </div>
            </div>
            <div className="border-t border-[#1e3a3a] pt-4 mt-4 space-y-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Account ID</p>
                <p className="text-xs text-gray-300 font-mono mt-1 break-all">{currentUserId || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">User Status</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active & Verified</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Company Settings Form */}
        <div className="lg:col-span-2">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#2dd4bf]" />
                  <h3 className="font-semibold text-white">Company & Factory Profile</h3>
                </div>
                {hasCompany && (
                  <Badge variant={company?.isVerified ? "success" : "warning"} size="sm">
                    {company?.isVerified ? "Regulatory Verified" : "Verification Pending"}
                  </Badge>
                )}
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company Name"
                  placeholder="e.g. Acme Polymers Ltd"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Industrial Sector"
                  placeholder="e.g. Chemicals, Plastic Recycling"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
              </div>

              {/* Physical Address */}
              <Input
                label="Registered Business Address"
                placeholder="e.g. Plot 24, Industrial Zone A, Cairo, Egypt"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              {/* Tax & Commercial Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Tax Registration Number (رقم التسجيل الضريبي)"
                  placeholder="e.g. 123-456-789"
                  value={taxRegistrationNumber}
                  onChange={(e) => setTaxRegistrationNumber(e.target.value)}
                />
                <Input
                  label="Commercial Register Number (السجل التجاري)"
                  placeholder="e.g. 987654"
                  value={commercialRegisterNumber}
                  onChange={(e) => setCommercialRegisterNumber(e.target.value)}
                />
              </div>

              {/* Geo-Location Coordinates */}
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Factory Location (GPS Coordinates)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  Coordinates are used by the Marketplace Discovery map to match nearby waste streams. You can click on the map to set your location precisely.
                </p>
                <div className="h-64 rounded-lg overflow-hidden border border-[#1e3a3a] mt-4 relative z-0">
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                      position={[latitude, longitude]}
                      setPosition={(p) => {
                        setLatitude(p[0]);
                        setLongitude(p[1]);
                      }}
                    />
                  </MapContainer>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-[#1e3a3a] flex items-center justify-between">
                <Button type="button" variant="ghost" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={fetchCompanyDetails}>
                  Reload
                </Button>
                <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />} isLoading={isLoading}>
                  {hasCompany ? "Update profile" : "Register company"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Regulatory Verification Card */}
        <div className="lg:col-span-3">
          <Card
            header={
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" />
                <h3 className="font-semibold text-white">Regulatory Verification</h3>
              </div>
            }
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-300">
                  To unlock Escrow features and build trust, Badil requires you to upload your commercial register (سجل تجاري) or tax document (بطاقة ضريبية).
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">Status:</span>
                  <Badge variant={company?.isVerified ? "success" : "warning"} size="sm">
                    {company?.isVerified ? "Verified" : "Pending or Unverified"}
                  </Badge>
                </div>
              </div>
              <div className="shrink-0">
                <Button
                  variant="outline"
                  isLoading={uploadingDoc}
                  onClick={() => document.getElementById("verification-upload")?.click()}
                >
                  Upload Document
                </Button>
                <input
                  type="file"
                  id="verification-upload"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleUploadVerification}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
