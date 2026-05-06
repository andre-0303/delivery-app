import type { Categoria } from '../types';

interface CategoryBarProps {
  categories: Categoria[];
  active: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryBar({ categories, active, onSelect }: CategoryBarProps) {
  return (
    <div className="cat-bar">
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: 20, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}>
          <button
            onClick={() => onSelect(null)}
            className={`cat-tab ${active === null ? 'cat-tab--active' : 'cat-tab--inactive'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className={`cat-tab ${active === cat.slug ? 'cat-tab--active' : 'cat-tab--inactive'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
