'use client';

export default function Modal({ open, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-[#111311]/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={
          'bg-white border border-[#e6e1d4] rounded-2xl p-6 sm:p-7 w-full shadow-modal animate-in fade-in zoom-in-95 duration-150 ' +
          (wide ? 'max-w-[540px]' : 'max-w-[440px]')
        }
      >
        {children}
      </div>
    </div>
  );
}
