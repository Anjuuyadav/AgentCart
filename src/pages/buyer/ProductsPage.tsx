import { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, RefreshCw } from 'lucide-react';
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
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

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

      // Map frontend sort values to backend-accepted sort values
      switch (sort) {
        case 'featured':
          // 'featured' maps to createdAt DESC (newest first, default backend behavior)
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
          // Default to featured (createdAt DESC)
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
        <div className="flex gap-2 flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm dark:border-border-dark dark:bg-surface-dark"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : categoryLabels[c]}
              </option>
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
          <button
            onClick={loadProducts}
            disabled={loading}
            className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm hover:border-violet-ai dark:border-border-dark dark:bg-surface-dark"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
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

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-ai" />
          <p className="text-sm text-muted dark:text-muted-light">Loading products...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="mb-2 font-semibold text-red-600 dark:text-red-400">Unable to load products.</p>
          <p className="mb-4 text-sm text-red-500 dark:text-red-300">{error}</p>
          <button
            onClick={loadProducts}
            className="rounded-lg bg-violet-ai px-4 py-2 text-sm font-medium text-white hover:bg-violet-ai/90"
          >
            Please try again.
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-muted" />
          <h3 className="text-lg font-medium">No products found.</h3>
          <p className="mt-1 text-sm text-muted dark:text-muted-light">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && <ProductGrid products={filtered} />}
    </BuyerLayout>
  );
}
