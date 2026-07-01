import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Target, MapPin, MessageSquare, AlertCircle } from "lucide-react";
import { materialRequestApi } from "../api/materialRequestApi";
import { companyApi } from "../api/companyApi";
import type { MaterialRequestDto } from "../types/materialRequest";
import type { CompanyDto } from "../types/company";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [request, setRequest] = useState<MaterialRequestDto | null>(null);
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      setError("");
      try {
        const reqData = await materialRequestApi.getById(id);
        setRequest(reqData);

        // Fetch company data to show who made the request
        const allCompanies = await companyApi.getAll();
        const reqCompany = allCompanies.find((c) => c.userId === reqData.userId);
        if (reqCompany) {
          setCompany(reqCompany);
        }
      } catch (err) {
        setError("Failed to load material request details.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-4xl mx-auto pt-8">
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex flex-col items-center justify-center text-center p-8 gap-4">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p>{error || "Request not found."}</p>
          <Button variant="ghost" onClick={() => navigate("/app/requests")}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === request.userId;

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Header Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details (Left Col) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dashboard-card border-[#2dd4bf]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2dd4bf]/10 blur-3xl rounded-full" />
            <h1 className="text-2xl font-bold text-white mb-2">{request.materialType}</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2 mb-6">
              Requested on {new Date(request.createdAt).toLocaleDateString()}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1a2e2e] p-4 rounded-lg flex items-center gap-4">
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Target Quantity</p>
                  <p className="text-lg font-bold text-white mt-0.5">{request.targetQuantity} kg</p>
                </div>
              </div>
              <div className="bg-[#1a2e2e] p-4 rounded-lg flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Search Radius</p>
                  <p className="text-lg font-bold text-white mt-0.5">{request.locationPreferenceRadiusKm} km</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar (Right Col) */}
        <div className="space-y-6">
          {/* Company Info */}
          <Card className="dashboard-card" title="Requester">
            {company ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">{company.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{company.sector}</p>
                </div>
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <p>{company.address || "No address provided"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Company details unavailable.</p>
            )}

            {!isOwner && (
              <Button
                variant="primary"
                className="w-full mt-6 btn-primary-gradient"
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={() => navigate(`/app/messages?user=${request.userId}`)}
              >
                Message Requester
              </Button>
            )}
            
            {isOwner && (
              <Button
                variant="secondary"
                className="w-full mt-6"
                onClick={() => navigate('/app/requests')}
              >
                Manage My Requests
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
