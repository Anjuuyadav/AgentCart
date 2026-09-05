import { Link } from 'react-router-dom';
import { GitCompare, Star, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../services';
import { AIBadge, AIMatchScore } from '../ai/AIComponents';
import { Badge } from '../ui/Badge';
import { useApp } from '../../contexts/useApp';

interface ProductCardProps {
  product: Product;
  showAiMatch?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({
  product,
  showAiMatch = false,
  onAddToCart,
}: ProductCardProps) {
  const { addToCompare, compareList } = useApp();

  const inCompare = compareList.includes(product.id);

  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.stock,
    0
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] transition-all duration-500 hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.9),0_0_25px_-5px_rgba(212,175,55,0.15)]">
      
      {/* Image container - 3:4 aspect ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0E0E0F]">
        
        {/* Main Image Link */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 z-0 block"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Ambient Dark Gradient on Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/20 opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
        </Link>

        {/* Badges Top Left */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {showAiMatch && product.aiMatchScore && (
            <AIBadge>
              Match {product.aiMatchScore}%
            </AIBadge>
          )}

          {product.tags && product.tags.includes('formal') && (
            <Badge variant="default">
              Couture
            </Badge>
          )}
        </div>

        {/* Low Stock Badge */}
        {totalStock <= 5 && totalStock > 0 && (
          <div className="absolute right-3 top-3 z-10">
            <Badge variant="warning">
              Atelier Limit ({totalStock})
            </Badge>
          </div>
        )}

        {/* Hover Quick Action Overlay Bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/90 to-transparent p-3 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          
          {/* View Piece */}
          <Link
            to={`/product/${product.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[3px] bg-[#D4AF37] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0B0B0C] transition-colors hover:bg-[#E5C358]"
          >
            <Eye className="h-3 w-3" />
            <span>View Piece</span>
          </Link>

          {/* Add to Bag */}
          {onAddToCart && (
            <button
              type="button"
              onClick={onAddToCart}
              className="rounded-[3px] border border-[rgba(255,255,255,0.2)] bg-[#1A1A1E] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Bag
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col bg-[#131314] p-4">
        
        {/* Category + Compare */}
        <div className="mb-1 flex items-center justify-between">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9E9E9E]">
            {product.category.replace(/-/g, ' ')}
          </span>

          <button
            type="button"
            onClick={() => addToCompare(product.id)}
            className={`rounded-[3px] p-1 text-[11px] transition-colors ${
              inCompare
                ? 'text-[#D4AF37]'
                : 'text-[#737373] hover:text-[#E5E2E3]'
            }`}
            title="Compare Piece"
            aria-label="Compare"
          >
            <GitCompare className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Product Name */}
        <Link
          to={`/product/${product.id}`}
          className="group/title"
        >
          <h3 className="line-clamp-1 font-serif text-sm font-medium tracking-wide text-[#E5E2E3] transition-colors group-hover/title:text-[#D4AF37]">
            {product.name}
          </h3>
        </Link>

        {/* Price + Rating / AI Match */}
        <div className="mt-2 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-2">
          
          {/* Price */}
          <div>
            <span className="font-sans text-sm font-semibold tracking-wide text-[#E2E2E2]">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice && (
              <span className="ml-2 font-sans text-xs text-[#737373] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* AI Match / Rating */}
          {showAiMatch && product.aiMatchScore ? (
            <AIMatchScore score={product.aiMatchScore} />
          ) : (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />

              <span className="text-[11px] text-[#9E9E9E]">
                {product.rating}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  showAiMatch = false,
  onAddToCart,
}: {
  products: Product[];
  showAiMatch?: boolean;
  onAddToCart?: (p: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[#131314]/50 py-20 text-center">
        <span className="mb-2 font-serif text-2xl italic text-[#9E9E9E]">
          No selections found
        </span>

        <p className="text-xs uppercase tracking-[0.16em] text-[#737373]">
          Adjust filters or ask the AI Concierge for tailored pieces
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showAiMatch={showAiMatch}
          onAddToCart={
            onAddToCart
              ? () => onAddToCart(product)
              : undefined
          }
        />
      ))}
    </div>
  );
}