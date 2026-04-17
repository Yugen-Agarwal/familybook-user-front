import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ 
  open, onClose, onConfirm, title, message, loading, 
  confirmText = 'Confirm', 
  loadingText = 'Confirming...' 
}) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirm'} size="sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={17} className="text-red-500" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed pt-1">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? loadingText : confirmText}
        </button>
      </div>
    </Modal>
  );
}
