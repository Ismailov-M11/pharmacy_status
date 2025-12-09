import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { PharmacyTable } from "@/components/PharmacyTable";
import { PharmacyDetailModal } from "@/components/PharmacyDetailModal";
import { getPharmacyList, updatePharmacyStatus, Pharmacy } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AgentPanel() {
  const { t } = useLanguage();
  const { token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(true);
  const [telegramBotFilter, setTelegramBotFilter] = useState<boolean | null>(
    null,
  );
  const [brandedPacketFilter, setBrandedPacketFilter] = useState<
    boolean | null
  >(null);
  const [trainingFilter, setTrainingFilter] = useState<boolean | null>(null);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      navigate("/login");
      return;
    }

    fetchPharmacies();
    fetchPharmacies();
  }, [token, authLoading, navigate, activeFilter]);

  useEffect(() => {
    const filtered = pharmacies.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.phone && p.phone.includes(searchQuery)) ||
        (p.lead?.phone && p.lead.phone.includes(searchQuery)) ||
        ((p as any).landmark &&
          (p as any).landmark
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTelegramBot =
        telegramBotFilter === null
          ? true
          : telegramBotFilter
            ? (p as any).marketChats && (p as any).marketChats.length > 0
            : !(p as any).marketChats || (p as any).marketChats.length === 0;

      const matchesBrandedPacket =
        brandedPacketFilter === null
          ? true
          : (p as any).brandedPacket === brandedPacketFilter;

      const matchesTraining =
        trainingFilter === null ? true : (p as any).training === trainingFilter;

      return (
        matchesSearch &&
        matchesTelegramBot &&
        matchesBrandedPacket &&
        matchesTraining
      );
    });
    setFilteredPharmacies(filtered);
  }, [
    searchQuery,
    pharmacies,
    telegramBotFilter,
    brandedPacketFilter,
    trainingFilter,
  ]);

  const fetchPharmacies = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getPharmacyList(token, "", 0, activeFilter);
      setPharmacies(response.payload?.list || []);
      setFilteredPharmacies(response.payload?.list || []);
    } catch (error) {
      console.error("Failed to fetch pharmacies:", error);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePharmacyClick = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPharmacy(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">{t.loading}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.agentPanel}</h1>
          <p className="text-gray-600 mt-2">{t.pharmacyName}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <PharmacyTable
            pharmacies={filteredPharmacies}
            isLoading={isLoading}
            isAdmin={false}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            telegramBotFilter={telegramBotFilter}
            onTelegramBotFilterChange={setTelegramBotFilter}
            brandedPacketFilter={brandedPacketFilter}
            onBrandedPacketFilterChange={setBrandedPacketFilter}
            trainingFilter={trainingFilter}
            onTrainingFilterChange={setTrainingFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPharmacyClick={handlePharmacyClick}
          />
        </div>
        <PharmacyDetailModal
          pharmacy={selectedPharmacy}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateStatus={async (id, field, value) => {
            if (!token) return;
            try {
              const updatedPharmacy = await updatePharmacyStatus(
                token,
                id,
                field,
                value,
              );
              setPharmacies((prev) =>
                prev.map((p) => (p.id === id ? updatedPharmacy : p)),
              );
              setFilteredPharmacies((prev) =>
                prev.map((p) => (p.id === id ? updatedPharmacy : p)),
              );
              setSelectedPharmacy(updatedPharmacy);
            } catch (error) {
              console.error("Failed to update status:", error);
              throw error;
            }
          }}
          isAdmin={false}
        />
      </main>
    </div>
  );
}
