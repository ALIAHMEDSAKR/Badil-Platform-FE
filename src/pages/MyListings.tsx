// ═══════════════════════════════════════════════════════════════════
// Badil Platform — My Listings Page
// Wired to: wasteListingApi
// Uses: Card, Badge, Button, DataTable, Input
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ListOrdered,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";
import { wasteListingApi } from "../api/wasteListingApi";
import type { WasteListingDto } from "../types/wasteListing";
import type { ListingStatusString } from "../types/enums";

// ── Stat Card Component ─────────────────────────────────────────────

interface StatItem {
  icon: typeof ListOrdered;
  iconBg: string;
  label: string;
  value: number;
}

function StatCard({ stat }: { stat: StatItem }) {
  const Icon = stat.icon;
  return (
    <Card variant="stat">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${stat.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
        </div>
      </div>
    </Card>
  );
}

// ── Status Helpers ──────────────────────────────────────────────────

function getStatusBadge(status: ListingStatusString) {
  const map: Record<ListingStatusString, { label: string; variant: "teal" | "success" | "neutral" }> = {
    Available: { label: "Available", variant: "teal" },
    Sold: { label: "Sold", variant: "success" },
    Draft: { label: "Draft", variant: "neutral" },
  };
  const entry = map[status] || { label: status, variant: "neutral" as const };
  return (
    <Badge variant={entry.variant} size="sm" dot>
      {entry.label}
    </Badge>
  );
}

function getValidationBadge(isValidated: boolean) {
  return isValidated ? (
    <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />}>
      Validated
    </Badge>
  ) : (
    <Badge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>
      Pending AI
    </Badge>
  );
}

export function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<WasteListingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<WasteListingDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await wasteListingApi.getMine();
      setListings(data);
    } catch {
      setError("Failed to load your listings. The backend may be offline.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Stat calculations ──
  const stats = useMemo(() => {
    const total = listings.length;
    const available = listings.filter((l) => l.status === "Available").length;
    const sold = listings.filter((l) => l.status === "Sold").length;
    const draft = listings.filter((l) => l.status === "Draft").length;

    return [
      {
        icon: ListOrdered,
        iconBg: "bg-[#2dd4bf]/15 text-[#2dd4bf]",
        label: "Total Listings",
        value: total,
      },
      {
        icon: Tag,
        iconBg: "bg-teal-500/15 text-teal-400",
        label: "Available",
        value: available,
      },
      {
        icon: CheckCircle,
        iconBg: "bg-emerald-500/15 text-emerald-400",
        label: "Sold / Rehomed",
        value: sold,
      },
      {
        icon: Clock,
        iconBg: "bg-gray-500/15 text-gray-400",
        label: "Drafts",
        value: draft,
      },
    ];
  }, [listings]);

  // ── Filtered data ──
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        l.materialType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [listings, searchQuery, statusFilter]);

  // ── Delete Handler ──
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await wasteListingApi.delete(deleteTarget.id);
      setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete listing. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Table Columns ──
  const columns: DataTableColumn<WasteListingDto>[] = [
    {
      key: "material",
      header: "Material Type",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2e2e] flex items-center justify-center shrink-0">
            {row.imageUrls?.[0] ? (
              <img
                src={row.imageUrls[0]}
                alt={row.materialType}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Tag className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[200px]">{row.materialType}</p>
            <p className="text-[11px] text-gray-500">ID: #{row.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      ),
      width: "min-w-[220px]",
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) => <span className="text-sm font-medium text-white">{row.quantity} kg/tons</span>,
    },
    {
      key: "price",
      header: "Suggested Price",
      render: (row) => (
        <span className="text-sm font-semibold text-white">
          ${row.suggestedPrice?.toLocaleString() || "Negotiable"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "validation",
      header: "AI Validation",
      render: (row) => getValidationBadge(row.isVisuallyValidated),
    },
    {
      key: "actions",
      header: "Actions",
      headerAlign: "center",
      render: (row) => (
        <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/listing/${row.id}`)}
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/app/listings/edit/${row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </Button>
        </div>
      ),
      width: "w-56",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Listings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage and track your company's waste materials.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate("/app/listings/new")}
        >
          New Listing
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchListings}>
            Retry
          </Button>
        </div>
      )}

      {/* Search & Table list */}
      <Card noPadding>
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-5 pt-5 pb-0 gap-4">
          <div className="flex-1 flex items-center gap-2 bg-[#0f2424] border border-[#1e3a3a] rounded-lg px-3 py-2 w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by material type or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {["All", "Available", "Sold", "Draft"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === tab
                    ? "text-[#2dd4bf] bg-[#2dd4bf]/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#1a2e2e]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table list */}
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredListings}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyMessage="No listings found matching your criteria. Click 'New Listing' to add one."
            onRowClick={(row) => navigate(`/listing/${row.id}`)}
          />
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Listing"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting}>
              Delete Listing
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Are you sure you want to delete this listing?</p>
            <p className="text-sm text-gray-400 mt-2">
              This action cannot be undone. Listing for{" "}
              <strong className="text-white">{deleteTarget?.materialType}</strong> will be permanently removed.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
