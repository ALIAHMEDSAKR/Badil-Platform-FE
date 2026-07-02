import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Box, Target, MapPin } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { materialRequestApi } from "../api/materialRequestApi";

export function NewRequest() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [materialType, setMaterialType] = useState("");
  const [targetQuantity, setTargetQuantity] = useState<number>(0);
  const [locationPreferenceRadiusKm, setLocationPreferenceRadiusKm] = useState<number>(50);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialType.trim()) {
      setError("Material Type is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (targetQuantity <= 0) {
      setError("Quantity must be greater than 0.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await materialRequestApi.create({
        materialType,
        targetQuantity,
        locationPreferenceRadiusKm
      });
      navigate("/app/requests");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save request. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/app/requests")}
          className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a2e2e] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white dashboard-title">New Material Request</h1>
          <p className="text-sm text-gray-400 mt-1">Specify what you are looking for.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card
          header={
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-[#2dd4bf]" />
              <h3 className="font-semibold text-white">Request Details</h3>
            </div>
          }
        >
          <div className="space-y-6">
            <Input
              label="Material Type"
              placeholder="e.g. Recycled HDPE, Copper Wire Scrap"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Input
                  label="Target Quantity"
                  type="number"
                  step="any"
                  placeholder="e.g. 500"
                  value={targetQuantity || ""}
                  onChange={(e) => setTargetQuantity(Number(e.target.value))}
                  required
                />
                <div className="absolute right-3 top-[34px] flex items-center pointer-events-none text-gray-500 text-sm">
                  kg
                </div>
              </div>

              <div className="relative">
                <Input
                  label="Search Radius"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 50"
                  value={locationPreferenceRadiusKm}
                  onChange={(e) => setLocationPreferenceRadiusKm(Number(e.target.value))}
                  required
                />
                <div className="absolute right-3 top-[34px] flex items-center pointer-events-none text-gray-500 text-sm">
                  km
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/app/requests")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            isLoading={isLoading}
          >
            Publish Request
          </Button>
        </div>
      </form>
    </div>
  );
}
