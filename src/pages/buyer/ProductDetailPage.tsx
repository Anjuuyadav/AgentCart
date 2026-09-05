import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Zap, GitCompare, Check, ArrowLeft, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AIBadge, AIMatchScore } from '../../components/ai/AIComponents';
import { ProductGrid } from '../../components/product/ProductCard';
import { formatPrice } from '../../services';
import { productService } from '../../services/productService';
import { useApp } from '../../contexts/useApp';
import type { Product } from '../../types';
import { getUserFriendlyMessage } from '../../services/apiClient';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToCompare, showToast } = useApp();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const p = await productService.getById(id);
        if (cancelled) return;
        if (!p) {
          setNotFound(true);
        } else {
          setProduct(p);
          setSelectedSize(p.variants[0]?.size || '');
          setSelectedColor(p.variants[0]?.color || '');
          try {
            const rel = await productService.getAll({ category: p.category, limit: 5 });
            const filtered = rel.products.filter((rp) => rp.id !== p.id).slice(0, 4);
            setRelated(filtered);
          } catch {
            setRelated([]);
          }
        }
      } catch (err) {
        if (cancelled) return;
        const msg = getUserFriendlyMessage(err);
        setError(msg);
        console.error('[ProductDetailPage] load failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <BuyerLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="font-serif text-sm italic text-[#9E9E9E]">Retrieving archival piece details...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (notFound || (!loading && !product)) {
    return (
      <BuyerLayout>
        <div className="py-24 text-center rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[#131314]">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-[#D4AF37]" />
          <h2 className="font-serif text-2xl font-normal text-[#E5E2E3]">Archival Piece Not Found</h2>
          <p className="mt-2 text-xs text-[#9E9E9E]">
            The requested creation may have been archived or is temporarily unavailable.
          </p>
          <Link to="/products" className="mt-6 inline-block">
            <Button variant="primary" size="sm">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  if (error) {
    return (
      <BuyerLayout>
        <div className="py-20 text-center rounded-[4px] border border-rose-500/30 bg-rose-950/20">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="font-serif text-xl font-normal text-rose-300">Catalog Access Error</h2>
          <p className="mt-2 text-xs text-rose-400/80">{error}</p>
          <Link to="/products" className="mt-6 inline-block">
            <Button variant="outline" size="sm">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  if (!product) return null;

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.filter((v) => v.size === selectedSize).map((v) => v.color))];
  const selectedVariant = product.variants.find((v) => v.size === selectedSize && v.color === selectedColor);
  const available = selectedVariant && selectedVariant.stock > 0;
  const disabled = !available || adding || buyingNow;

  const handleAddToCart = async () => {
    if (!available) return;
    setAdding(true);
    const ok = await addToCart({ productId: product.id, quantity: 1, size: selectedSize, color: selectedColor });
    setAdding(false);
    if (ok) showToast('Piece added to shopping bag', 'success');
  };

  const handleBuyNow = async () => {
    if (!available) return;
    setBuyingNow(true);
    const ok = await addToCart({ productId: product.id, quantity: 1, size: selectedSize, color: selectedColor });
    setBuyingNow(false);
    if (ok) {
      showToast('Piece prepared for checkout', 'success');
      navigate('/checkout');
    }
  };

  return (
    <BuyerLayout>
      {/* Back Link */}
      <Link
        to="/products"
        className="group mb-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#9E9E9E] transition-colors hover:text-[#D4AF37]"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Return to Catalog</span>
      </Link>

      {/* Main Product Editorial Grid */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: Gallery Rail (3:4 ratio) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <img
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/40 via-transparent to-black/20 pointer-events-none" />

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
              {product.aiMatchScore && (
                <AIBadge>Match {product.aiMatchScore}%</AIBadge>
              )}
              <Badge variant="default">{product.category.replace(/-/g, ' ')}</Badge>
            </div>
          </div>

          {/* Thumbnail Rail */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-24 w-18 overflow-hidden rounded-[3px] border transition-all duration-200 cursor-pointer ${
                    selectedImage === i
                      ? 'border-[#D4AF37] shadow-[0_0_15px_-3px_rgba(212,175,55,0.35)]'
                      : 'border-[rgba(255,255,255,0.08)] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Dossier & Ordering */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              ATELIER PIECE #{product.id.slice(-4).toUpperCase()}
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#E5E2E3] leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="text-xs font-semibold text-[#E2E2E2]">{product.rating}</span>
              </div>
              <span className="text-xs text-[#737373]">·</span>
              <span className="text-xs text-[#9E9E9E]">{product.reviewCount} verified client impressions</span>
            </div>

            <div className="mt-5 flex items-baseline gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
              <span className="font-sans text-3xl font-semibold text-[#E5E2E3]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-sm text-[#737373] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#9E9E9E]">
            {product.description}
          </p>

          {/* Size Swatches */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#E5E2E3]">
                Select Size
              </label>
              <span className="text-[11px] text-[#737373]">Couture Standard</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const sizeHasStock = product.variants.some((v) => v.size === size && v.stock > 0);
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      const firstColor = product.variants.find((v) => v.size === size);
                      if (firstColor) setSelectedColor(firstColor.color);
                    }}
                    disabled={!sizeHasStock}
                    className={`min-w-12 rounded-[3px] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-[#D4AF37] bg-[#D4AF37] text-[#0B0B0C] shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]'
                        : sizeHasStock
                        ? 'border border-[rgba(255,255,255,0.1)] bg-[#141417] text-[#E2E2E2] hover:border-[rgba(212,175,55,0.4)]'
                        : 'border border-[rgba(255,255,255,0.04)] bg-transparent text-[#555] line-through cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2">
            <label className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#E5E2E3]">
              Atelier Palette
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-[3px] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-[#D4AF37] bg-[#1C1B1C] text-[#D4AF37] shadow-[0_0_12px_-2px_rgba(212,175,55,0.25)]'
                        : 'border border-[rgba(255,255,255,0.08)] bg-[#141417] text-[#9E9E9E] hover:border-[rgba(255,255,255,0.2)] hover:text-[#E5E2E3]'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Indicator */}
          <div>
            {selectedVariant && selectedVariant.stock > 0 ? (
              <Badge variant="success">Available · {selectedVariant.stock} Pieces Allocated</Badge>
            ) : (
              <Badge variant="error">Depleted in Selected Variant</Badge>
            )}
          </div>

          {/* Actions CTA */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={disabled}
              className="flex-1"
            >
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Shopping Bag
                </>
              )}
            </Button>

            <Button
              variant="ai"
              size="lg"
              onClick={handleBuyNow}
              disabled={disabled}
              className="flex-1"
            >
              {buyingNow ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-[#D4AF37]" /> Instant Acquisition
                </>
              )}
            </Button>

            <button
              onClick={() => addToCompare(product.id)}
              className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-[#141417] text-[#9E9E9E] hover:border-[rgba(212,175,55,0.4)] hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0"
              title="Compare Piece"
            >
              <GitCompare className="h-4 w-4" />
            </button>
          </div>

          {/* AI Stylist Concierge Appraisal Card */}
          {product.aiMatchScore && (
            <div className="relative overflow-hidden rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[#1C1B1C] via-[#141417] to-[#0E0E0F] p-5 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    Concierge Styling Appraisal
                  </span>
                </div>
                <AIMatchScore score={product.aiMatchScore} />
              </div>
              <ul className="space-y-1.5 pt-1 border-t border-[rgba(255,255,255,0.06)]">
                {product.aiReasons?.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#E5E2E3]/90">
                    <Check className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications Table */}
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
            <h3 className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E5E2E3]">
              Garment Specifications
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="rounded-[3px] border border-[rgba(255,255,255,0.06)] bg-[#131314] p-2.5">
                  <dt className="text-[10px] uppercase tracking-wider text-[#737373]">{k}</dt>
                  <dd className="mt-0.5 font-medium text-[#E2E2E2]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related Pieces */}
      {related.length > 0 && (
        <div className="mt-24 border-t border-[rgba(255,255,255,0.08)] pt-16">
          <div className="mb-8">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              COMPLEMENTARY SILHOUETTES
            </span>
            <h2 className="font-serif text-2xl font-normal text-[#E5E2E3] sm:text-3xl">
              Related Haute Pieces
            </h2>
          </div>
          <ProductGrid products={related} />
        </div>
      )}
    </BuyerLayout>
  );
}

export function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const [products, setProducts] = useState<Array<Product | undefined>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result: Array<Product | undefined> = [];
      for (const id of compareList) {
        try {
          const p = await productService.getById(id);
          result.push(p);
        } catch {
          result.push(undefined);
        }
      }
      setProducts(result.filter(Boolean) as Product[]);
      setLoading(false);
    }
    load();
  }, [compareList]);

  const validProducts = products.filter(Boolean) as Product[];

  if (!loading && validProducts.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-24 text-center rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[#131314]">
          <GitCompare className="mx-auto mb-4 h-8 w-8 text-[#737373]" />
          <h2 className="font-serif text-2xl font-normal text-[#E5E2E3]">Comparison Archive Empty</h2>
          <p className="mt-2 text-xs text-[#9E9E9E]">Add pieces from the collection to evaluate silhouettes side-by-side.</p>
          <Link to="/products" className="mt-6 inline-block">
            <Button variant="primary" size="sm">Browse Collection</Button>
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  const bestMatch = validProducts.reduce(
    (best: Product | null, p) => (p.aiMatchScore ?? 0) > (best?.aiMatchScore ?? 0) ? p : best,
    validProducts[0] || null,
  );

  return (
    <BuyerLayout>
      <div className="mb-10 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-6">
        <div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            SIDE-BY-SIDE EVALUATION
          </span>
          <h1 className="font-serif text-3xl font-normal text-[#E5E2E3]">Compare Archival Pieces</h1>
        </div>
        <Button variant="outline" size="sm" onClick={clearCompare}>Clear Comparison</Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      )}

      <div className="overflow-x-auto rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314]">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#0E0E0F]">
              <th className="p-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373] w-48">Piece Attribute</th>
              {validProducts.map((p) => p && (
                <th key={p.id} className={`p-5 ${p.id === bestMatch?.id ? 'bg-[#D4AF37]/5 border-x border-[#D4AF37]/20' : ''}`}>
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="float-right text-xs text-[#737373] hover:text-rose-400 cursor-pointer"
                  >
                    Remove ×
                  </button>
                  <img src={p.image} alt={p.name} className="mb-3 h-36 w-28 rounded-[2px] object-cover" />
                  <p className="font-serif text-sm font-medium text-white">{p.name}</p>
                  {p.id === bestMatch?.id && (
                    <div className="mt-2">
                      <Badge variant="gold">Best Match</Badge>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.06)] text-xs">
            {[
              { label: 'Price', get: (p: Product) => formatPrice(p.price) },
              { label: 'AI Style Match', get: (p: Product) => (p.aiMatchScore ? `${p.aiMatchScore}%` : '—') },
              { label: 'Client Rating', get: (p: Product) => `${p.rating} ★ (${p.reviewCount})` },
              { label: 'Category', get: (p: Product) => p.category.replace(/-/g, ' ') },
              { label: 'Available Stock', get: (p: Product) => `${p.variants.reduce((s, v) => s + v.stock, 0)} units` },
            ].map((row) => (
              <tr key={row.label}>
                <td className="p-4 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#737373] bg-[#0E0E0F]/60">
                  {row.label}
                </td>
                {validProducts.map((p) => p && (
                  <td key={p.id} className={`p-4 font-sans text-[#E2E2E2] ${p.id === bestMatch?.id ? 'bg-[#D4AF37]/5 border-x border-[#D4AF37]/20 font-semibold' : ''}`}>
                    {String(row.get(p))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BuyerLayout>
  );
}
