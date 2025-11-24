import { useLanguage } from "@/contexts/LanguageContext";
import { ChangeRecord } from "./PharmacyDetailModal";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ChangeHistoryProps {
  records: ChangeRecord[];
}

export function ChangeHistory({ records }: ChangeHistoryProps) {
  const { t } = useLanguage();

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t.noChanges || "No changes yet"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .map((record) => (
          <div
            key={record.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  {record.field === "training"
                    ? t.training || "Training"
                    : t.brandedPacket || "Branded Packet"}
                </p>
                <p className="text-sm text-gray-600">
                  {t.by || "By"}: {record.user}
                </p>
              </div>
              <time className="text-sm text-gray-500">
                {format(new Date(record.timestamp), "PPpp", { locale: ru })}
              </time>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  record.oldValue
                    ? "bg-lime-100 text-lime-900"
                    : "bg-orange-100 text-orange-900"
                }`}
              >
                {record.oldValue ? t.yes : t.no}
              </span>
              <span className="text-gray-400">���</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  record.newValue
                    ? "bg-lime-100 text-lime-900"
                    : "bg-orange-100 text-orange-900"
                }`}
              >
                {record.newValue ? t.yes : t.no}
              </span>
            </div>

            <div className="bg-white rounded p-3 border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {record.comment}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
