import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Davo Delivery" className="w-12 h-12" />
          <div>
            <div className="font-bold text-xl">
              <span className="text-purple-700">Davo</span>
              <span className="text-purple-900">Delivery</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${
                language === 'ru'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              RU 🇷🇺
            </button>
            <button
              onClick={() => setLanguage('uz')}
              className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${
                language === 'uz'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              UZ 🇺🇿
            </button>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-purple-700 border-purple-700 hover:bg-purple-50"
          >
            {t.logout}
          </Button>
        </div>
      </div>
    </header>
  );
}
