import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  FileCheck, 
  ShieldCheck, 
  Download,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import { companyApi } from "../api/companyApi";
import { transactionApi } from "../api/transactionApi";
import { useAuthStore } from "../store/authStore";
import type { CompanyDto } from "../types/company";
import type { TransactionDto } from "../types/transaction";

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

export function ComplianceReport() {
  const { token } = useAuthStore();
  const currentUserId = getUserIdFromToken(token);

  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [compRes, txRes] = await Promise.allSettled([
        companyApi.getAll(),
        transactionApi.getMine()
      ]);

      if (compRes.status === "fulfilled" && currentUserId) {
        const myComp = compRes.value.find(c => c.userId === currentUserId);
        setCompany(myComp || null);
      }
      if (txRes.status === "fulfilled") {
        setTransactions(txRes.value);
      }
    } catch {
      setError("Failed to load compliance data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sort transactions by date descending for audit log
  const auditLog = useMemo(() => {
    return [...transactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [transactions]);

  const columns: DataTableColumn<TransactionDto>[] = [
    {
      key: "date",
      header: "Timestamp",
      render: (row) => (
        <span className="text-xs text-gray-300">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
      width: "w-[180px]",
    },
    {
      key: "id",
      header: "Transaction ID",
      render: (row) => (
        <span className="font-mono text-xs text-white">
          {row.id.toUpperCase()}
        </span>
      ),
    },
    {
      key: "type",
      header: "Role",
      render: (row) => {
        const isBuyer = row.buyerId === currentUserId;
        return (
          <Badge variant={isBuyer ? "info" : "purple"} size="sm">
            {isBuyer ? "Buyer" : "Seller"}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Escrow Status",
      render: (row) => (
        <Badge 
          variant={row.escrowState === "FundsReleased" ? "success" : "warning"} 
          size="sm"
        >
          {row.escrowState}
        </Badge>
      ),
    },
    {
      key: "value",
      header: "Value (USD)",
      render: (row) => (
        <span className="text-sm font-semibold text-emerald-400">
          ${row.agreedPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: "action",
      header: "Proof",
      render: () => (
        <Button variant="ghost" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
          Receipt
        </Button>
      ),
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Generating compliance report...</p>
        </div>
      </div>
    );
  }

  const isVerified = company?.isVerified ?? false;

  return (
    <div className="max-w-6xl mx-auto animate-fade-up pb-12">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-[#2dd4bf]" />
            Compliance & Audit
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Documentation and audit logs for ESG and regulatory reporting.
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Download className="w-4 h-4" />}
          className="btn-primary-gradient"
          onClick={() => alert("Downloading full compliance archive (PDF/CSV)...")}
        >
          Download Audit Archive
        </Button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          {error}
        </div>
      )}

      {/* Verification Status Card */}
      <Card className="dashboard-card mb-8 border border-[var(--border)] overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-4 shadow-lg ${
            isVerified 
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-emerald-500/20" 
              : "bg-amber-500/10 border-amber-500 text-amber-400 shadow-amber-500/20"
          }`}>
            {isVerified ? <ShieldCheck className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-xl font-bold text-white">
              {isVerified ? "Company Verified" : "Verification Pending"}
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl">
              {isVerified 
                ? "Your facility's legal and environmental documentation has been audited and approved by Badil Platform. You are fully compliant for marketplace trading."
                : "Your documentation is under review or missing. Full compliance requires valid commercial registration and environmental permits."}
            </p>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-3 border border-[var(--border)]">
                <span className="text-xs text-gray-500 block mb-1">Company Name</span>
                <span className="text-sm text-white font-medium">{company?.name || "Not registered"}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-3 border border-[var(--border)]">
                <span className="text-xs text-gray-500 block mb-1">Sector</span>
                <span className="text-sm text-white font-medium">{company?.sector || "Not registered"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card noPadding className="dashboard-card border border-[var(--border)]">
        <div className="p-5 border-b border-[var(--border)] bg-[#1a2e2e]/30">
          <h2 className="text-lg font-semibold text-white">Transaction Audit Log</h2>
          <p className="text-xs text-gray-400 mt-1">Immutable record of all platform deals for accounting and regulatory tracking.</p>
        </div>
        
        <div className="px-5 pb-2 pt-2 dashboard-table-wrap">
          <DataTable
            columns={columns}
            data={auditLog}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyMessage="No transaction records found."
          />
        </div>
      </Card>
    </div>
  );
}
