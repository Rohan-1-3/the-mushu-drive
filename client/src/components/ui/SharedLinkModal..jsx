import { toast } from "react-toastify";

export function SharedLinkModal({ isOpen, link, onClose }) {
  if (!isOpen) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl max-w-lg w-full p-8 flex flex-col items-center">
        <div className="mb-4 text-center text-text-light dark:text-text-dark text-lg font-semibold">Shareable Link</div>
        <div className="relative w-full mb-6 flex items-center">
          <input
            type="text"
            value={link}
            readOnly
            className="w-full px-4 py-2 rounded-lg bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 text-base text-text-light dark:text-text-dark pr-12"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-blue-500 hover:text-blue-700"
            title="Copy"
            aria-label="Copy"
            style={{ lineHeight: 1 }}
          >
            {/* Unicode copy icon */}
            <span role="img" aria-label="copy">📋</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-base"
        >Close</button>
      </div>
    </div>
  );
}