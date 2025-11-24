import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { PharmacyTable } from '@/components/PharmacyTable';
import { getPharmacyList, updatePharmacyStatus, Pharmacy } from '@/lib/api';
import { toast } from 'sonner';

export default function AgentPanel() {
  const { t } = useLanguage();
  const { token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      navigate('/login');
      return;
    }

    fetchPharmacies();
  }, [token, authLoading, navigate, showInactive]);

  const fetchPharmacies = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getPharmacyList(
        token,
        '',
        0,
        showInactive ? null : true
      );
      setPharmacies(response.payload?.list || []);
    } catch (error) {
      console.error('Failed to fetch pharmacies:', error);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    pharmacyId: number,
    field: 'brandedPacket' | 'training',
    value: boolean
  ) => {
    if (!token) return;

    try {
      await updatePharmacyStatus(token, pharmacyId, field, value);

      setPharmacies((prev) =>
        prev.map((p) =>
          p.id === pharmacyId ? { ...p, [field]: value } : p
        )
      );

      toast.success(t.saved);
    } catch (error) {
      console.error('Failed to update pharmacy:', error);
      toast.error(t.error);
    }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.agentPanel}</h1>
          <p className="text-gray-600 mt-2">
            {t.pharmacyName}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <PharmacyTable
            pharmacies={pharmacies}
            isLoading={isLoading}
            isAdmin={false}
            onUpdateStatus={handleUpdateStatus}
            activeFilter={showInactive ? null : true}
            onFilterChange={setShowInactive}
          />
        </div>
      </main>
    </div>
  );
}
