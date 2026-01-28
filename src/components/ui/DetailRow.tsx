export default function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-24 shrink-0 text-sm font-medium text-gray-600">
        {label}
      </div>
      <div className="text-sm text-gray-900">{value || "-"}</div>
    </div>
  );
}
