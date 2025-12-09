import { useState } from "react";
import { Pharmacy } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChangeHistory } from "./ChangeHistory";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export interface ChangeRecord {
  id: string;
  field: "brandedPacket" | "training";
  timestamp: string;
  user: string;
  comment: string;
  oldValue: boolean;
  newValue: boolean;
}

interface PharmacyDetailModalProps {
  pharmacy: Pharmacy | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    pharmacyId: number,
    field: "brandedPacket" | "training",
    value: boolean,
    comment: string,
  ) => Promise<void>;
  isAdmin?: boolean;
  currentUsername?: string;
  changeHistory?: ChangeRecord[];
}

export function PharmacyDetailModal({
  pharmacy,
  isOpen,
  onClose,
  onUpdateStatus,
  isAdmin = false,
  currentUsername = "User",
  changeHistory = [],
}: PharmacyDetailModalProps) {
  const { t } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "training" | "package" | "history"
  >("details");
  const [trainingComment, setTrainingComment] = useState("");
  const [packageComment, setPackageComment] = useState("");
  const [trainingError, setTrainingError] = useState("");

  const [packageError, setPackageError] = useState("");
  const [pendingTraining, setPendingTraining] = useState<boolean | null>(null);
  const [pendingPacket, setPendingPacket] = useState<boolean | null>(null);

  // Reset pending state when pharmacy changes or tab changes
  if (pharmacy && pendingTraining === null && activeTab === 'training') {
    setPendingTraining((pharmacy as any).training);
  }
  if (pharmacy && pendingPacket === null && activeTab === 'package') {
    setPendingPacket((pharmacy as any).brandedPacket);
  }

  if (!pharmacy) return null;

  const handleStatusChange = async (
    field: "brandedPacket" | "training",
    newValue: boolean,
    comment: string,
    setError: (err: string) => void,
  ) => {
    if (!comment.trim()) {
      setError(t.commentRequired || "Comment is required");
      return;
    }

    setError("");
    setIsUpdating(true);

    try {
      await onUpdateStatus(pharmacy.id, field, newValue, comment);

      if (field === "training") {
        setTrainingComment("");
      } else {
        setPackageComment("");
      }

      toast.success(t.saved);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(t.error);
    } finally {
      setIsUpdating(false);
    }
  };

  const pharmacyChangeHistory = changeHistory;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto sm:w-full p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <DialogTitle className="break-words text-base sm:text-lg">
                {t.pharmacyDetails || "Pharmacy Details"}
              </DialogTitle>
              <DialogDescription className="break-words text-xs sm:text-sm">
                {t.code || "Code"}: {pharmacy.code}
              </DialogDescription>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabs - only show for admin */}
          {isAdmin && (
            <div className="flex gap-1 border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-2 sm:px-4 py-2 font-medium border-b-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
              >
                {t.details || "Details"}
              </button>
              <button
                onClick={() => setActiveTab("training")}
                className={`px-2 sm:px-4 py-2 font-medium border-b-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${activeTab === "training"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
              >
                {t.training || "Training"}
              </button>
              <button
                onClick={() => setActiveTab("package")}
                className={`px-2 sm:px-4 py-2 font-medium border-b-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${activeTab === "package"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
              >
                {t.brandedPacket || "Branded Packet"}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-2 sm:px-4 py-2 font-medium border-b-2 transition-colors text-xs sm:text-sm whitespace-nowrap ${activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
              >
                {t.history || "History"}
              </button>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {t.code || "Code"}
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm break-words">
                    {pharmacy.code}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {t.status || "Status"}
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium inline-block ${pharmacy.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {pharmacy.active ? t.active : t.inactive}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t.pharmacyName || "Pharmacy Name"}
                </label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm break-words">
                  {pharmacy.name}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {t.address || "Address"}
                </label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm break-words">
                  {pharmacy.address}
                </div>
              </div>

              {(pharmacy as any).landmark && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.landmark || "Landmark"}
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    {(pharmacy as any).landmark}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {t.pharmacyPhone || "Pharmacy Phone"}
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                    {pharmacy.phone || "-"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {t.leadPhone || "Lead Phone"}
                  </label>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                    {pharmacy.lead?.phone || "-"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.telegramBot || "Telegram Bot"}
                  </label>
                  <div className={`p-2 rounded border border-gray-200 text-center ${(pharmacy as any).marketChats?.length > 0
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                    }`}>
                    {(pharmacy as any).marketChats?.length > 0 ? t.yes : t.no}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.brandedPacket || "Branded Packet"}
                  </label>
                  <div className={`p-2 rounded border border-gray-200 text-center ${(pharmacy as any).brandedPacket
                    ? "bg-lime-100 text-lime-900 border-lime-200"
                    : "bg-orange-100 text-orange-900 border-orange-200"
                    }`}>
                    {(pharmacy as any).brandedPacket ? t.yes : t.no}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t.training || "Training"}
                  </label>
                  <div className={`p-2 rounded border border-gray-200 text-center ${(pharmacy as any).training
                    ? "bg-lime-100 text-lime-900 border-lime-200"
                    : "bg-orange-100 text-orange-900 border-orange-200"
                    }`}>
                    {(pharmacy as any).training ? t.yes : t.no}
                  </div>
                </div>
              </div>

              {isAdmin && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {t.leadStatus || "Lead Status"}
                    </label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                      {pharmacy.lead?.status || "-"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        {t.stir || "STIR"}
                      </label>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                        {(pharmacy.lead as any)?.stir || "-"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        {t.additionalPhone || "Additional Phone"}
                      </label>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                        {(pharmacy.lead as any)?.additionalPhone || "-"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {t.juridicalName || "Juridical Name"}
                    </label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                      {(pharmacy.lead as any)?.juridicalName || "-"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {t.juridicalAddress || "Juridical Address"}
                    </label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                      {(pharmacy.lead as any)?.juridicalAddress || "-"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        {t.bankName || "Bank Name"}
                      </label>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                        {(pharmacy.lead as any)?.bankName || "-"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        {t.mfo || "MFO"}
                      </label>
                      <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                        {(pharmacy.lead as any)?.mfo || "-"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {t.bankAccount || "Bank Account"}
                    </label>
                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs sm:text-sm">
                      {(pharmacy.lead as any)?.bankAccount || "-"}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Training Tab */}
          {activeTab === "training" && isAdmin && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.currentStatus || "Current Status"}
                </label>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium inline-block ${(pharmacy as any).training
                    ? "bg-lime-100 text-lime-900"
                    : "bg-orange-100 text-orange-900"
                    }`}
                >
                  {(pharmacy as any).training ? t.yes : t.no}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.comment || "Comment"} *
                </label>
                <Textarea
                  value={trainingComment}
                  onChange={(e) => {
                    setTrainingComment(e.target.value);
                    setTrainingError("");
                  }}
                  placeholder={t.enterComment || "Enter your comment..."}
                  className="min-h-24"
                />
                {trainingError && (
                  <p className="text-red-500 text-sm mt-1">{trainingError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleStatusChange(
                      "training",
                      true,
                      trainingComment,
                      setTrainingError,
                    )
                  }
                  disabled={isUpdating || (pharmacy as any).training}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? "..." : t.yes || "Yes"}
                </Button>
                <Button
                  onClick={() =>
                    handleStatusChange(
                      "training",
                      false,
                      trainingComment,
                      setTrainingError,
                    )
                  }
                  disabled={isUpdating || !(pharmacy as any).training}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isUpdating ? "..." : t.no || "No"}
                </Button>
              </div>
            </div>
          )}

          {/* Package Tab */}
          {activeTab === "package" && isAdmin && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.currentStatus || "Current Status"}
                </label>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium inline-block ${(pharmacy as any).brandedPacket
                    ? "bg-lime-100 text-lime-900"
                    : "bg-orange-100 text-orange-900"
                    }`}
                >
                  {(pharmacy as any).brandedPacket ? t.yes : t.no}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.comment || "Comment"} *
                </label>
                <Textarea
                  value={packageComment}
                  onChange={(e) => {
                    setPackageComment(e.target.value);
                    setPackageError("");
                  }}
                  placeholder={t.enterComment || "Enter your comment..."}
                  className="min-h-24"
                />
                {packageError && (
                  <p className="text-red-500 text-sm mt-1">{packageError}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleStatusChange(
                      "brandedPacket",
                      true,
                      packageComment,
                      setPackageError,
                    )
                  }
                  disabled={isUpdating || (pharmacy as any).brandedPacket}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? "..." : t.yes || "Yes"}
                </Button>
                <Button
                  onClick={() =>
                    handleStatusChange(
                      "brandedPacket",
                      false,
                      packageComment,
                      setPackageError,
                    )
                  }
                  disabled={isUpdating || !(pharmacy as any).brandedPacket}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isUpdating ? "..." : t.no || "No"}
                </Button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && isAdmin && (
            <ChangeHistory records={pharmacyChangeHistory} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
