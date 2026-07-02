import { useState, useEffect, useCallback } from "react";
import { 
  AlertOctagon,
  Plus,
  X,
  MessageCircle,
  FileText
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { disputeApi } from "../api/disputeApi";
import { transactionApi } from "../api/transactionApi";
import { useAuthStore } from "../store/authStore";
import type { DisputeTicketDto } from "../types/dispute";
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

export function Disputes() {
  const { token } = useAuthStore();
  const currentUserId = getUserIdFromToken(token);

  const [disputes, setDisputes] = useState<DisputeTicketDto[]>([]);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [dispRes, txRes] = await Promise.all([
        disputeApi.getAll(),
        transactionApi.getMine()
      ]);

      if (currentUserId) {
        // Filter out only disputes raised by the current user
        setDisputes(dispRes.filter(d => d.raisedByUserId === currentUserId));
      }
      setTransactions(txRes);
    } catch {
      setError("Failed to load dispute data.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxId || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      await disputeApi.create({
        transactionId: selectedTxId,
        reason: reason.trim()
      });
      setIsModalOpen(false);
      setSelectedTxId("");
      setReason("");
      await fetchData();
    } catch (err) {
      alert("Failed to raise dispute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === 'open') {
      return <Badge variant="warning" dot>Open</Badge>;
    } else if (status.toLowerCase() === 'resolved') {
      return <Badge variant="success" dot>Resolved</Badge>;
    }
    return <Badge variant="info" dot>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-400" />
            Dispute Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your open disputes or report an issue with an escrow transaction.
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-red-500 hover:bg-red-600 text-white border-none"
          onClick={() => setIsModalOpen(true)}
        >
          Raise New Dispute
        </Button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          {error}
        </div>
      )}

      {!error && disputes.length === 0 ? (
        <div className="text-center py-20 bg-black/10 border border-[var(--border)] rounded-xl">
          <AlertOctagon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300">No Open Disputes</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
            You currently have no active disputes. That's a good thing!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {disputes.map((d) => (
            <Card key={d.id} className="dashboard-card border border-[var(--border)] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-300 text-sm bg-black/20 px-2 py-1 rounded">
                    Ticket #{d.id.slice(0, 8).toUpperCase()}
                  </span>
                  {getStatusBadge(d.status)}
                </div>
                <p className="text-sm text-white font-medium">Related Transaction: {d.transactionId}</p>
                <div className="p-3 rounded-lg bg-[#1a2e2e]/30 border border-[#2dd4bf]/10 mt-2">
                  <p className="text-sm text-gray-300 italic flex gap-2">
                    <MessageCircle className="w-4 h-4 shrink-0 text-gray-500 mt-0.5" />
                    "{d.reason}"
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-gray-500 block mb-1">Created At</span>
                <span className="text-sm text-gray-300 block mb-3">{new Date(d.createdAt).toLocaleDateString()}</span>
                {d.status === "Resolved" && (
                  <Button variant="outline" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                    View Resolution
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Raise Dispute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="dashboard-card w-full max-w-md border border-[var(--border)] relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a2e2e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Raise a Dispute</h2>
            <p className="text-sm text-gray-400 mb-6">Select the problematic transaction and describe the issue.</p>
            
            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Select Transaction
                </label>
                <select 
                  className="w-full bg-[#0a1414] border border-[var(--border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-400 transition-colors"
                  value={selectedTxId}
                  onChange={(e) => setSelectedTxId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Transaction --</option>
                  {transactions.map(tx => (
                    <option key={tx.id} value={tx.id}>
                      Deal #{tx.id.slice(0, 8).toUpperCase()} - ${tx.agreedPrice} ({tx.escrowState})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Reason / Description
                </label>
                <textarea 
                  className="w-full bg-[#0a1414] border border-[var(--border)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-400 transition-colors min-h-[120px]"
                  placeholder="Describe the issue in detail..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border)] mt-6">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                <Button 
                  variant="primary" 
                  className="bg-red-500 hover:bg-red-600 border-none text-white" 
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!selectedTxId || !reason.trim()}
                >
                  Submit Dispute
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
