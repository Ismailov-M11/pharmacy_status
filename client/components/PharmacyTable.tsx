import { Pharmacy } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';

interface PharmacyTableProps {
  pharmacies: Pharmacy[];
  isLoading: boolean;
  isAdmin?: boolean;
  activeFilter: boolean | null;
  onFilterChange: (active: boolean | null) => void;
  telegramBotFilter: boolean | null;
  onTelegramBotFilterChange: (value: boolean | null) => void;
  brandedPacketFilter: boolean | null;
  onBrandedPacketFilterChange: (value: boolean | null) => void;
  trainingFilter: boolean | null;
  onTrainingFilterChange: (value: boolean | null) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onPharmacyClick?: (pharmacy: Pharmacy) => void;
}

export function PharmacyTable({
  pharmacies,
  isLoading,
  isAdmin = false,
  activeFilter,
  onFilterChange,
  telegramBotFilter,
  onTelegramBotFilterChange,
  brandedPacketFilter,
  onBrandedPacketFilterChange,
  trainingFilter,
  onTrainingFilterChange,
  searchQuery = '',
  onSearchChange,
  onPharmacyClick,
}: PharmacyTableProps) {
  const { t } = useLanguage();

  const handleFilterChange = (value: string, setter: (val: boolean | null) => void) => {
    if (value === 'true') {
      setter(true);
    } else if (value === 'false') {
      setter(false);
    } else {
      setter(null);
    }
  };

  const getStatusText = (value: boolean) => {
    return value ? t.yes : t.no;
  };

  const getTelegramBotStatus = (marketChats: any) => {
    const hasChat = marketChats && Array.isArray(marketChats) && marketChats.length > 0;
    return hasChat ? t.yes : t.no;
  };

  const getTelegramBotDetails = (marketChats: any) => {
    if (!marketChats || !Array.isArray(marketChats) || marketChats.length === 0) {
      return null;
    }
    return marketChats[0];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
            type="text"
            placeholder={`${t.pharmacyName} / ${t.address}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full sm:max-w-md"
            disabled
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2" disabled>
                {t.filter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-center py-8">
          <span className="text-gray-500">{t.loadingPharmacies}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input
          type="text"
          placeholder={`${t.pharmacyName} / ${t.address}...`}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full sm:max-w-md"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {t.filter}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={activeFilter === true ? "true" : activeFilter === false ? "false" : "null"}
              onValueChange={(val) => handleFilterChange(val, onFilterChange)}
            >
              <DropdownMenuRadioItem value="true">
                {t.active}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="false">
                {t.inactive}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="null">
                {t.allPharmacies}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-[73px] z-40 bg-white">
            <tr>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap" style={{ width: '50px' }}>
                {t.number}
              </th>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap" style={{ width: '100px' }}>
                {t.code}
              </th>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700" style={{ width: '180px', minWidth: '180px' }}>
                <div className="break-words">{t.pharmacyName}</div>
              </th>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700" style={{ width: '200px', minWidth: '200px' }}>
                <div className="break-words">{t.address}</div>
              </th>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700" style={{ width: '150px', minWidth: '150px' }}>
                <div className="break-words">{t.landmark}</div>
              </th>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap" style={{ width: '120px' }}>
                {t.pharmacyPhone}
              </th>
              <th className="px-2 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap" style={{ width: '120px' }}>
                {t.leadPhone}
              </th>

              <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-gray-700 whitespace-nowrap min-w-max">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                      <span>{t.telegramBot}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={telegramBotFilter === true ? "true" : telegramBotFilter === false ? "false" : "null"}
                      onValueChange={(val) => handleFilterChange(val, onTelegramBotFilterChange)}
                    >
                      <DropdownMenuRadioItem value="null">{t.allPharmacies}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="true">{t.yes}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="false">{t.no}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-gray-700 whitespace-nowrap min-w-max">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                      <span>{t.brandedPacket}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={brandedPacketFilter === true ? "true" : brandedPacketFilter === false ? "false" : "null"}
                      onValueChange={(val) => handleFilterChange(val, onBrandedPacketFilterChange)}
                    >
                      <DropdownMenuRadioItem value="null">{t.allPharmacies}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="true">{t.yes}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="false">{t.no}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-gray-700 whitespace-nowrap min-w-max">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                      <span>{t.training}</span>
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={trainingFilter === true ? "true" : trainingFilter === false ? "false" : "null"}
                      onValueChange={(val) => handleFilterChange(val, onTrainingFilterChange)}
                    >
                      <DropdownMenuRadioItem value="null">{t.allPharmacies}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="true">{t.yes}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="false">{t.no}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-max">
                {t.status}
              </th>
              {isAdmin && (
                <>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-max">
                    {t.leadStatus}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-max">
                    {t.stir}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-max">
                    {t.additionalPhone}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-[180px]">
                    {t.juridicalName}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700" style={{ width: '200px', minWidth: '200px' }}>
                    <div className="break-words">{t.juridicalAddress}</div>
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-[150px]">
                    {t.bankName}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-[150px]">
                    {t.bankAccount}
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-700 whitespace-nowrap min-w-max">
                    {t.mfo}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pharmacies.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 20 : 11} className="px-4 py-8 text-center text-gray-500">
                  {t.noData}
                </td>
              </tr>
            ) : (
              pharmacies.map((pharmacy, index) => {
                const telegramBotDetails = getTelegramBotDetails((pharmacy as any).marketChats);
                const hasTelegramBot = (pharmacy as any).marketChats && Array.isArray((pharmacy as any).marketChats) && (pharmacy as any).marketChats.length > 0;

                return (
                  <tr key={pharmacy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-2 md:py-3 text-gray-900 font-medium whitespace-nowrap align-top">{index + 1}</td>
                    <td className="px-2 py-2 md:py-3 text-gray-900 whitespace-nowrap align-top">
                      <button
                        onClick={() => onPharmacyClick?.(pharmacy)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                      >
                        {pharmacy.code}
                      </button>
                    </td>
                    <td className="px-2 py-2 md:py-3 text-gray-900 font-medium align-top">
                      <div className="break-words overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.4em', minHeight: '4.2em' }}>
                        {pharmacy.name}
                      </div>
                    </td>
                    <td className="px-2 py-2 md:py-3 text-gray-600 align-top">
                      <div className="break-words overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.4em', minHeight: '4.2em' }}>
                        {pharmacy.address}
                      </div>
                    </td>
                    <td className="px-2 py-2 md:py-3 text-gray-600 align-top">
                      <div className="break-words" style={{ lineHeight: '1.4em', minHeight: '4.2em' }}>
                        {(pharmacy as any).landmark || '-'}
                      </div>
                    </td>
                    <td className="px-2 py-2 md:py-3 text-gray-900 whitespace-nowrap align-top">
                      {pharmacy.phone || '-'}
                    </td>
                    <td className="px-2 py-2 md:py-3 text-gray-900 whitespace-nowrap align-top">
                      {pharmacy.lead?.phone || '-'}
                    </td>

                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                      <div className="space-y-1 flex flex-col items-center">
                        <div className={`font-semibold text-xs px-2 py-1 rounded inline-block whitespace-nowrap ${hasTelegramBot
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {getTelegramBotStatus((pharmacy as any).marketChats)}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium inline-block whitespace-nowrap ${fields.brandedPacket
                        ? 'bg-lime-100 text-lime-900'
                        : 'bg-orange-100 text-orange-900'
                        }`}>
                        {getStatusText(fields.brandedPacket)}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium inline-block whitespace-nowrap ${fields.training
                        ? 'bg-lime-100 text-lime-900'
                        : 'bg-orange-100 text-orange-900'
                        }`}>
                        {getStatusText(fields.training)}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap inline-block ${pharmacy.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                          }`}
                      >
                        {pharmacy.active ? t.active : t.inactive}
                      </span>
                    </td>
                    {isAdmin && (
                      <>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-900 text-xs">{pharmacy.lead?.status || '-'}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-900 text-xs whitespace-nowrap">{(pharmacy.lead as any)?.stir || '-'}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-900 text-xs whitespace-nowrap">{(pharmacy.lead as any)?.additionalPhone || '-'}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-600 text-xs max-w-xs truncate">{(pharmacy.lead as any)?.juridicalName || '-'}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-600 text-xs align-top">
                          <div className="break-words" style={{ lineHeight: '1.4em', minHeight: '4.2em' }}>
                            {(pharmacy.lead as any)?.juridicalAddress || '-'}
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-600 text-xs max-w-xs truncate">{(pharmacy.lead as any)?.bankName || '-'}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-900 text-xs font-mono whitespace-nowrap">{(pharmacy.lead as any)?.bankAccount || '-'}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-gray-900 text-xs whitespace-nowrap">{(pharmacy.lead as any)?.mfo || '-'}</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
