import { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, RefreshCw, SlidersHorizontal, Sparkles } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { ProductGrid } from '../../components/product/ProductCard';
import { categoryLabels } from '../../services';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { getUserFriendlyMessage } from '../../services/apiClient';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [minPrice] = useState<number | ''>('');
  const [maxPrice] = useState<number | ''>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['all', ...Object.keys(categoryLabels)];

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      if (minPrice !== '' && minPrice > 0) params.minPrice = Number(minPrice);
      if (maxPrice !== '' && maxPrice > 0) params.maxPrice = Number(maxPrice);
      params.limit = 100;
      params.offset = 0;

      switch (sort) {
        case 'featured':
          params.sort = 'createdAt';
          params.order = 'desc';
          break;
        case 'price-low':
          params.sort = 'price';
          params.order = 'asc';
          break;
        case 'price-high':
          params.sort = 'price';
          params.order = 'desc';
          break;
        case 'rating':
          params.sort = 'rating';
          params.order = 'desc';
          break;
        default:
          params.sort = 'createdAt';
          params.order = 'desc';
      }

      const { products: list } = await productService.getAll(params);
      setProducts([...list]);
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setError(msg);
      console.error('[ProductsPage] loadProducts failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.category.includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }
    if (minPrice !== '' && minPrice > 0) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== '' && maxPrice > 0) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }
    return result;
  }, [products, search, category, minPrice, maxPrice]);

  return (
    <BuyerLayout>
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 text-[#D4AF37]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              ARCHIVE CATALOG
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#E5E2E3]">
            Curated Collection
          </h1>
          <p className="mt-1 font-sans text-xs text-[#9E9E9E]">
            {products.length} archival creations with autonomous AI fit certainty
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <span>Displaying {filtered.length} garments</span>
        </div>
      </div>

      {/* Control Bar: Search & Selectors */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            placeholder="Search silhouettes, fabrics, occasions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] py-2.5 pl-10 pr-4 text-xs tracking-wide text-[#E5E2E3] placeholder-[#737373] transition-colors focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
          />
        </div>

        {/* Sort & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] px-3 py-1.5">
            <SlidersHorizontal className="h-3 w-3 text-[#737373]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs tracking-wider uppercase text-[#E5E2E3] focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#131314] text-[#E5E2E3]">Featured Drop</option>
              <option value="price-low" className="bg-[#131314] text-[#E5E2E3]">Price: Ascending</option>
              <option value="price-high" className="bg-[#131314] text-[#E5E2E3]">Price: Descending</option>
              <option value="rating" className="bg-[#131314] text-[#E5E2E3]">Highest Rated</option>
            </select>
          </div>

          <button
            onClick={loadProducts}
            disabled={loading}
            className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-2.5 text-[#9E9E9E] hover:border-[rgba(212,175,55,0.4)] hover:text-[#D4AF37] transition-colors cursor-pointer disabled:opacity-50"
            title="Reload catalog"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => {
          const isSelected = category === c;
          const label = c === 'all' ? 'All Silhouettes' : categoryLabels[c] || c.replace(/-/g, ' ');
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-[3px] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border border-[rgba(212,175,55,0.5)] bg-[#1C1B1C] text-[#D4AF37] shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)]'
                  : 'border border-[rgba(255,255,255,0.08)] bg-[#131314] text-[#9E9E9E] hover:border-[rgba(255,255,255,0.2)] hover:text-[#E5E2E3]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="font-serif text-sm italic text-[#9E9E9E]">Loading archival garments...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-[4px] border border-rose-500/30 bg-rose-950/20 p-8 text-center">
          <p className="font-serif text-lg text-rose-300">Catalog Access Interrupted</p>
          <p className="mt-1 mb-4 text-xs text-rose-400/80">{error}</p>
          <button
            onClick={loadProducts}
            className="rounded-[3px] bg-[#D4AF37] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0B0B0C] hover:bg-[#E5C358]"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && filtered.length > 0 && (
        <ProductGrid products={filtered} showAiMatch />
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[#131314]/40">
          <Search className="mb-4 h-8 w-8 text-[#737373]" />
          <h3 className="font-serif text-xl font-normal text-[#E5E2E3]">No garments found</h3>
          <p className="mt-1 text-xs text-[#9E9E9E] max-w-sm">
            Try resetting your filters or consult the AI Concierge for tailored styling advice.
          </p>
        </div>
      )}
    </BuyerLayout>
  );
}
