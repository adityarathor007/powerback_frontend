export default function Card({ className = "", children }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 elevated ${className}`}>
      {children}
    </div>
  );
}

