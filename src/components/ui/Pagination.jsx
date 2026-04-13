import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <button className="btn-secondary px-2 py-1" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-gray-600">Page {page} of {pages}</span>
      <button className="btn-secondary px-2 py-1" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
