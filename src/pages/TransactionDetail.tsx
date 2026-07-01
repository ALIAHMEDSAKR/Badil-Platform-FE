import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Shield, 
  ArrowLeft, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  User
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { transactionApi } from "../api/transactionApi";
import { wasteListingApi } from "../api/wasteListingApi";
import { useAuthStore } from "../store/authStore";
import type { TransactionDto } from "../types/transaction";
import type { WasteListingDto } from "../types/wasteListing";
import type { EscrowStatusString } from "../types/enums";

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

interface StatusDetail {
  label: string;
  colorClass: string;
  stepIdx: number;
}

const statusMap: Record<EscrowStatusString, StatusDetail> = {
  AwaitingDeposit: { label: "Awaiting Deposit", colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/25", stepIdx: 1 },
  FundsLocked: { label: "Funds Locked", colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/25", stepIdx: 2 },
  InTransit: { label: "In Transit", colorClass: "text-teal-400 bg-[#2dd4bf]/10 border-[#2dd4bf]/25", stepIdx: 3 },
  InspectionPeriod: { label: "Inspection Period", colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/25", stepIdx: 3 },
  FundsReleased: { label: "Completed", colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", stepIdx: 4 },
  Disputed: { label: "Disputed", colorClass: "text-red-400 bg-red-500/10 border-red-500/25", stepIdx: 3 },
};

export function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const currentUserId = getUserIdFromToken(token);

  const [transaction, setTransaction] = useState<TransactionDto | null>(null);
  const [listing, setListing] = useState<WasteListingDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const tx = await transactionApi.getById(id);
      setTransaction(tx);
      const lst = await wasteListingApi.getById(tx.listingId);
      setListing(lst);
    } catch (err) {
      setError("Failed to load transaction details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="text-center py-20 text-red-400 animate-fade-in">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h3 className="text-lg font-semibold">{error || "Transaction not found"}</h3>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const isBuyer = transaction.buyerId === currentUserId;
  const isSeller = transaction.sellerId === currentUserId;
  const stateInfo = statusMap[transaction.escrowState] || { label: transaction.escrowState, colorClass: "text-gray-400", stepIdx: 1 };

  const handleAction = async (actionFn: () => Promise<void>) => {
    setActionLoading(true);
    try {
      await actionFn();
      await fetchDetails();
    } catch {
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-up pb-12">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/app/escrow')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Escrow Deals
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Deal #{transaction.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Started on {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isBuyer && <Badge variant="info" icon={<User className="w-3 h-3" />}>My Role: Buyer</Badge>}
            {isSeller && <Badge variant="purple" icon={<User className="w-3 h-3" />}>My Role: Seller</Badge>}
            <Badge variant="teal" icon={<Shield className="w-3 h-3" />}>Secured Escrow</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Progress & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dashboard-card">
            <h2 className="text-lg font-semibold text-white mb-6">Contract Status</h2>
            
            {/* Step Progress Vertical */}
            <div className="relative pl-6 pb-6 border-l-2 border-gray-800 ml-4 space-y-10">
              
              {/* Step 1 */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#0b1a1a] ${stateInfo.stepIdx >= 1 ? 'bg-[#2dd4bf]' : 'bg-gray-700'}`}>
                  {stateInfo.stepIdx > 1 ? <CheckCircle className="w-3 h-3 text-[#0b1a1a]" /> : <span className="w-2 h-2 rounded-full bg-[#0b1a1a]" />}
                </div>
                <div className="ml-4">
                  <h3 className={`text-base font-medium ${stateInfo.stepIdx >= 1 ? 'text-white' : 'text-gray-500'}`}>Awaiting Deposit</h3>
                  <p className="text-xs text-gray-400 mt-1">Buyer must deposit funds into the secure escrow account.</p>
                  
                  {transaction.escrowState === "AwaitingDeposit" && isBuyer && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-3 btn-primary-gradient"
                      isLoading={actionLoading}
                      onClick={() => handleAction(() => transactionApi.lockFunds(transaction.id))}
                    >
                      Deposit ${transaction.agreedPrice.toLocaleString()}
                    </Button>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#0b1a1a] ${stateInfo.stepIdx >= 2 ? 'bg-[#2dd4bf]' : 'bg-gray-700'}`}>
                  {stateInfo.stepIdx > 2 ? <CheckCircle className="w-3 h-3 text-[#0b1a1a]" /> : <span className="w-2 h-2 rounded-full bg-[#0b1a1a]" />}
                </div>
                <div className="ml-4">
                  <h3 className={`text-base font-medium ${stateInfo.stepIdx >= 2 ? 'text-white' : 'text-gray-500'}`}>Funds Locked (Secured)</h3>
                  <p className="text-xs text-gray-400 mt-1">Funds are secured. Seller is cleared to dispatch the material.</p>
                  
                  {transaction.escrowState === "FundsLocked" && isSeller && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-3 btn-primary-gradient"
                      isLoading={actionLoading}
                      onClick={() => handleAction(() => transactionApi.confirmDelivery(transaction.id))}
                    >
                      Confirm Dispatch
                    </Button>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#0b1a1a] ${stateInfo.stepIdx >= 3 ? 'bg-[#2dd4bf]' : 'bg-gray-700'}`}>
                  {stateInfo.stepIdx > 3 ? <CheckCircle className="w-3 h-3 text-[#0b1a1a]" /> : <span className="w-2 h-2 rounded-full bg-[#0b1a1a]" />}
                </div>
                <div className="ml-4">
                  <h3 className={`text-base font-medium ${stateInfo.stepIdx >= 3 ? 'text-white' : 'text-gray-500'}`}>In Transit / Inspection</h3>
                  <p className="text-xs text-gray-400 mt-1">Material is en route. Buyer will inspect upon arrival.</p>
                  
                  {transaction.escrowState === "InTransit" && isBuyer && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mt-3 bg-emerald-500 hover:bg-emerald-400 text-black border-none"
                      isLoading={actionLoading}
                      onClick={() => handleAction(() => transactionApi.releaseFunds(transaction.id))}
                    >
                      Approve & Release Payment
                    </Button>
                  )}
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#0b1a1a] ${stateInfo.stepIdx >= 4 ? 'bg-[#2dd4bf]' : 'bg-gray-700'}`}>
                  {stateInfo.stepIdx >= 4 && <CheckCircle className="w-3 h-3 text-[#0b1a1a]" />}
                </div>
                <div className="ml-4">
                  <h3 className={`text-base font-medium ${stateInfo.stepIdx >= 4 ? 'text-white' : 'text-gray-500'}`}>Completed</h3>
                  <p className="text-xs text-gray-400 mt-1">Transaction finished successfully. Funds disbursed.</p>
                </div>
              </div>

            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              variant="ghost" 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => navigate('/app/disputes')}
            >
              Raise Dispute
            </Button>
          </div>
        </div>

        {/* Right Column: Listing Details */}
        <div className="space-y-6">
          <Card className="dashboard-card border-[var(--border)] border p-0 overflow-hidden">
            <div className="p-5 border-b border-[var(--border)] bg-[#1a2e2e]/50">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Deal Summary</h3>
              <div className="text-3xl font-bold text-[#2dd4bf] flex items-center gap-1">
                <DollarSign className="w-6 h-6" />
                {transaction.agreedPrice.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">Total agreed contract value</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Resource</span>
                <p className="text-sm text-white font-medium">{listing?.materialType || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Quantity</span>
                <p className="text-sm text-white">{listing?.quantity || "N/A"} kg</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Counter-party ID</span>
                <p className="text-sm text-white truncate">{isBuyer ? transaction.sellerId : transaction.buyerId}</p>
              </div>
            </div>
            <div className="p-4 bg-black/20 border-t border-[var(--border)] text-center">
              <button 
                onClick={() => listing && navigate(`/app/marketplace/${listing.id}`)}
                className="text-xs text-[#2dd4bf] hover:underline"
              >
                View Original Listing
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
