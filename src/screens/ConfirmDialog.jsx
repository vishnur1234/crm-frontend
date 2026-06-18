import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-500/15 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
