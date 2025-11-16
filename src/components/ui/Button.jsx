export default function Button({ as = "button", className = "", variant = "primary", children, ...props }) {
  const Comp = as;
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-slate-900/80 text-white hover:bg-slate-900",
    outline:
      "border border-slate-300 text-slate-800 hover:bg-slate-50",
    ghost:
      "text-slate-700 hover:bg-slate-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm";
  return (
    <Comp className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Comp>
  );
}

