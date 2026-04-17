import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, total, onPage }) {
  if (!pages || pages < 1) return null;

  return (
    <div className="flex items-center justify-between mt-2">
      <p className="text-xs text-gray-400">
        {total != null ? (
          <>Page <span className="font-semibold text-gray-600">{page}</span> of <span className="font-semibold text-gray-600">{pages}</span> · <span className="font-semibold text-gray-600">{total}</span> total</>
        ) : (
          <>Page <span className="font-semibold text-gray-600">{page}</span> of <span className="font-semibold text-gray-600">{pages}</span></>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={14} /> Prev
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
            let p;
            if (pages <= 5)        p = i + 1;
            else if (page <= 3)    p = i + 1;
            else if (page >= pages - 2) p = pages - 4 + i;
            else                   p = page - 2 + i;
            return (
              <button key={p} onClick={() => onPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  p === page ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 border border-gray-200 bg-white'
                }`}
                style={p === page ? { background: 'linear-gradient(135deg,#6366f1,#818cf8)' } : {}}>
                {p}
              </button>
            );
          })}
        </div>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
