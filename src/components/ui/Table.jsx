export function Table({ children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl elevated overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-slate-50">
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ children, className = "" }) {
  return (
    <th className={`border-b border-slate-200 p-3 text-left text-sm font-semibold text-slate-700 ${className}`}>
      {children}
    </th>
  );
}

export function TR({ children, className = "" }) {
  return <tr className={`hover:bg-slate-50 ${className}`}>{children}</tr>;
}

export function TD({ children, className = "" }) {
  return <td className={`border-b border-slate-100 p-3 text-left ${className}`}>{children}</td>;
}

