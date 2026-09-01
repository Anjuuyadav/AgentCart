import { Link } from 'react-router-dom';
import { Heart, GitCompare, Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../data/mockData';
import { AIBadge, AIMatchScore } from '../ai/AIComponents';
import { Badge } from '../ui/Badge';
import { useApp } from '../../contexts/AppContext';

interface ProductCardProps {
  product: Product;
  showAiMatch?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({ product, showAiMatch = false }: ProductCardProps) {
  const { addToCompare, compareList } = useApp();
  const inCompare = compareList.includes(product.id);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="group animate-fade-in overflow-hidden rounded-xl border border-border bg-surface transition-shadow duration-200 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark">
      <Link to={`/product/${product.id}`} className="relative block aspect-[3/4] overflow-hidden">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        {showAiMatch && product.aiMatchScore && (
          <div className="absolute left-3 top-3">
            <AIBadge>AI Match {product.aiMatchScore}%</AIBadge>
          </div>
        )}
        {totalStock <= 5 && totalStock > 0 && (
          <div className="absolute right-3 top-3">
            <Badge variant="warning">Only {totalStock} left</Badge>
          </div>
        )}
      </Link>
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-charcoal line-clamp-2 dark:text-white">{product.name}</h3>
          </Link>
          <button
            onClick={() => addToCompare(product.id)}
            className={`shrink-0 rounded-lg p-1.5 transition-colors ${inCompare ? 'text-violet-ai' : 'text-muted hover:text-violet-ai'}`}
            aria-label="Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm text-muted dark:text-muted-light">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-charcoal dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-muted line-through dark:text-muted-light">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {showAiMatch && product.aiMatchScore && (
            <AIMatchScore score={product.aiMatchScore} />
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, showAiMatch = false }: { products: Product[]; showAiMatch?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="mb-4 h-12 w-12 text-muted" />
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="mt-1 text-sm text-muted dark:text-muted-light">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showAiMatch={showAiMatch} />
      ))}
    </div>
  );
}
