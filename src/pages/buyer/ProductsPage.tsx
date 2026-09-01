import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { ProductGrid } from '../../components/product/ProductCard';
import { products, categoryLabels } from '../../data/mockData';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== 'all') result = result.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
    }
    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [search, category, sort]);

  const categories = ['all', ...Object.keys(categoryLabels)];

  return (
    <BuyerLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-muted dark:text-muted-light">Discover premium fashion with AI-powered recommendations</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm focus:border-violet-ai focus:outline-none dark:border-border-dark dark:bg-surface-dark"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm dark:border-border-dark dark:bg-surface-dark"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : categoryLabels[c]}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm dark:border-border-dark dark:bg-surface-dark"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.slice(0, 8).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === c ? 'bg-violet-ai text-white' : 'border border-border hover:border-violet-ai dark:border-border-dark'}`}
          >
            {c === 'all' ? 'All' : categoryLabels[c]}
          </button>
        ))}
      </div>

      <ProductGrid products={filtered} />
    </BuyerLayout>
  );
}
