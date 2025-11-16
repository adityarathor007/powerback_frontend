export default function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] relative border border-slate-200 elevated">
        <button
          className="absolute top-2 right-2 text-slate-500 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div>{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

