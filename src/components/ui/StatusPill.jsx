export default function StatusPill({ status }) {
  const normalized = String(status || "").toLowerCase();
  const map = {
    working: "bg-green-100 text-green-800 border-green-200",
    outage: "bg-red-100 text-red-800 border-red-200",
    maintenance: "bg-orange-100 text-orange-800 border-orange-200",
    default: "bg-slate-100 text-slate-800 border-slate-200",
  };
  const cls = map[normalized] || map.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

