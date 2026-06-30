// ═══════════════════════════════════════════════════════════════════
// Badil Platform — Create / Edit Listing Page
// Wired to: wasteListingApi
// Uses: Card, Button, Input, Select
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, FileText, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { wasteListingApi } from "../api/wasteListingApi";
import type { ListingStatusString } from "../types/enums";

export function NewListing() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [materialType, setMaterialType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ListingStatusString>("Available");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch listing data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchListing = async () => {
      setIsFetching(true);
      setError("");
      try {
        const listing = await wasteListingApi.getById(id);
        setMaterialType(listing.materialType || "");
        setQuantity(listing.quantity || 0);
        setSuggestedPrice(listing.suggestedPrice || 0);
        setDescription(listing.description || "");
        setStatus(listing.status || "Available");
        setImageUrls(listing.imageUrls || []);
        if (listing.imageUrls && listing.imageUrls.length > 0) {
          setPreviewUrl(listing.imageUrls[0]);
        }
      } catch {
        setError("Failed to fetch listing details. The backend may be offline.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchListing();
  }, [id, isEditMode]);

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageUrls([]);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialType.trim()) {
      setError("Material type is required.");
      return;
    }
    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }
    if (suggestedPrice < 0) {
      setError("Suggested price cannot be negative.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let listingId = id || "";

      if (isEditMode) {
        await wasteListingApi.update(listingId, {
          id: listingId,
          materialType,
          quantity,
          description,
          suggestedPrice,
          status,
          imageUrls,
        });
      } else {
        const created = await wasteListingApi.create({
          materialType,
          quantity,
          description,
          suggestedPrice,
          imageUrls: imageUrls.length > 0 ? imageUrls : null,
        });
        listingId = created.id;
      }

      // If a file was selected, upload it now
      if (selectedFile && listingId) {
        try {
          await wasteListingApi.uploadImage(listingId, selectedFile);
        } catch (uploadErr) {
          console.error("Failed to upload image:", uploadErr);
          // Don't block listing success redirect if image upload fails, just log it
        }
      }

      navigate("/app/listings");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2dd4bf]" />
        <p className="text-sm text-gray-400 mt-4">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      {/* Back CTA */}
      <button
        onClick={() => navigate("/app/listings")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Listings
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white dashboard-title">
          {isEditMode ? "Edit Waste Listing" : "Create Waste Listing"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {isEditMode
            ? "Update listings details, status, and images."
            : "Post a new waste or surplus resource to match with industrial partners."}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="dashboard-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Material Type */}
            <Input
              label="Material Type"
              placeholder="e.g. Shredded PET, Spent Catalyst, Wood Pallets"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              required
            />

            {/* Status (always select) */}
            <Select
              label="Listing Status"
              options={[
                { value: "Available", label: "Available / Active" },
                { value: "Draft", label: "Draft" },
                { value: "Sold", label: "Sold / Archive" },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatusString)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity */}
            <Input
              label="Quantity (kg/tons)"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500"
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />

            {/* Price */}
            <Input
              label="Suggested Price (USD)"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 1500 (Set to 0 for Negotiable)"
              value={suggestedPrice || ""}
              onChange={(e) => setSuggestedPrice(Number(e.target.value))}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              placeholder="Provide specifications, impurities list, frequency of availability, loading support, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border bg-black/20 text-gray-200 border-[var(--border)] hover:border-[#2dd4bf]/40 focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/40 focus:border-[#2dd4bf]/60 p-4 h-32 resize-none transition-all duration-200"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Listing Image</label>
            {previewUrl ? (
              <div className="relative w-full max-w-sm h-48 border border-[var(--border)] rounded-lg overflow-hidden bg-black/20">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-[var(--border)] hover:border-[#2dd4bf]/40 rounded-xl p-8 flex flex-col items-center justify-center bg-black/20 transition-colors relative">
                <Upload className="w-8 h-8 text-gray-500 mb-3" />
                <p className="text-sm text-gray-300 font-medium">Click to upload a listing photo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-file-input"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/app/listings")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
              isLoading={isLoading}
              className="btn-primary-gradient"
            >
              {isEditMode ? "Save Changes" : "Create Listing"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
