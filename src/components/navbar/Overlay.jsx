export default function Overlay({ open, onClose }) {
  if (!open) return null;
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-40 cursor-default"
    />
  );
}

