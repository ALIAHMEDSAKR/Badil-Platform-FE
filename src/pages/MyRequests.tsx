import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, ListOrdered, Tag, AlertCircle, Edit2, Eye } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";
import { materialRequestApi } from "../api/materialRequestApi";
import type { MaterialRequestDto } from "../types/materialRequest";

export function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaterialRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<MaterialRequestDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await materialRequestApi.getMine();
      setRequests(data);
    } catch {
      setError("Failed to load your requests. The backend may be offline.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) =>
      r.materialType?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await materialRequestApi.delete(deleteTarget.id);
      setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete request. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<MaterialRequestDto>[] = [
    {
      key: "material",
      header: "Material Type",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a2e2e] flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 text-gray-500" />
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
      header: "Target Quantity",
      render: (row) => <span className="text-sm font-medium text-white">{row.targetQuantity} kg</span>,
    },
    {
      key: "radius",
      header: "Search Radius",
      render: (row) => <span className="text-sm text-gray-400">{row.locationPreferenceRadiusKm} km</span>,
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
            onClick={() => navigate(`/app/requests/${row.id}`)}
          >
            View
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
      width: "w-48",
    },
  ];

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white dashboard-title">My Material Requests</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your active sourcing requests for industrial materials.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="btn-primary-gradient"
          onClick={() => navigate("/app/requests/new")}
        >
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="stat" className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg stat-icon-glow bg-[#2dd4bf]/15 text-[#2dd4bf]">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Requests</p>
              <p className="text-2xl font-bold text-white mt-1">{requests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchRequests}>
            Retry
          </Button>
        </div>
      )}

      <Card noPadding className="dashboard-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-5 pt-5 pb-0 gap-4">
          <div className="flex-1 flex items-center gap-2 dashboard-search rounded-lg px-3 py-2 w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by material type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-300 placeholder:text-gray-500 outline-none w-full"
            />
          </div>
        </div>

        <div className="mt-4 px-5 pb-2 dashboard-table-wrap">
          <DataTable
            columns={columns}
            data={filteredRequests}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyMessage="No requests found matching your criteria. Click 'New Request' to add one."
            onRowClick={(row) => navigate(`/app/requests/${row.id}`)}
          />
        </div>
      </Card>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Request"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} isLoading={isDeleting}>
              Delete Request
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">Are you sure you want to delete this material request?</p>
            <p className="text-sm text-gray-400 mt-2">
              This action cannot be undone. Request for{" "}
              <strong className="text-white">{deleteTarget?.materialType}</strong> will be permanently removed.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
