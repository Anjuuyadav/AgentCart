import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Zap, GitCompare, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-ai" />
          <p className="text-sm text-muted dark:text-muted-light">Loading product...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (notFound || (!loading && !product)) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-error" />
          <h2 className="text-xl font-semibold">Product not found</h2>
          <p className="mt-2 text-sm text-muted dark:text-muted-light">
            The product you are looking for may have been removed or the link is invalid.
          </p>
          <Link to="/products" className="mt-4 inline-block text-violet-ai hover:underline">
            Back to products
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  if (error) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-error" />
          <h2 className="text-xl font-semibold">Unable to load product.</h2>
          <p className="mt-2 text-sm text-muted dark:text-muted-light">{error}</p>
          <Link to="/products" className="mt-4 inline-block text-violet-ai hover:underline">
            Back to products
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
    if (ok) showToast('Added to cart', 'success');
  };

  const handleBuyNow = async () => {
    if (!available) return;
    setBuyingNow(true);
    const ok = await addToCart({ productId: product.id, quantity: 1, size: selectedSize, color: selectedColor });
    setBuyingNow(false);
    if (ok) {
      showToast('Added to cart', 'success');
      navigate('/checkout');
    }
  };

  return (
    <BuyerLayout>
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-violet-ai dark:text-muted-light">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-surface dark:bg-surface-dark">
            <img
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 ${selectedImage === i ? 'border-violet-ai' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.aiMatchScore && <AIBadge>AI Recommended</AIBadge>}
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <p className="mt-4 text-muted dark:text-muted-light">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const sizeHasStock = product.variants.some((v) => v.size === size && v.stock > 0);
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      const firstColor = product.variants.find((v) => v.size === size);
                      if (firstColor) setSelectedColor(firstColor.color);
                    }}
                    disabled={!sizeHasStock}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${selectedSize === size ? 'border-violet-ai bg-violet-ai/10 text-violet-ai' : sizeHasStock ? 'border-border hover:border-violet-ai dark:border-border-dark' : 'border-border/50 text-muted line-through opacity-50 cursor-not-allowed dark:border-border-dark/50'}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${selectedColor === color ? 'border-violet-ai bg-violet-ai/10 text-violet-ai' : 'border-border hover:border-violet-ai dark:border-border-dark'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            {selectedVariant && selectedVariant.stock > 0 ? (
              <Badge variant="success">In Stock ({selectedVariant.stock} available)</Badge>
            ) : (
              <Badge variant="error">Out of Stock — Please select a different size/color</Badge>
            )}
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Button variant="primary" onClick={handleAddToCart} disabled={disabled}>
              {adding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </>
              )}
            </Button>
            <Button variant="ai" onClick={handleBuyNow} disabled={disabled}>
              {buyingNow ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Moving to Checkout...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Buy Now
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => addToCompare(product.id)}>
              <GitCompare className="h-4 w-4" />
            </Button>
          </div>

          {product.aiMatchScore && (
            <Card className="mt-8">
              <div className="flex items-start gap-6">
                <AIMatchScore score={product.aiMatchScore} />
                <div>
                  <h3 className="mb-2 font-semibold">Recommended because this product:</h3>
                  <ul className="space-y-1">
                    {product.aiReasons?.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}

          <div className="mt-8">
            <h3 className="mb-3 font-semibold">Specifications</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key}>
                  <dt className="text-muted dark:text-muted-light">{key}</dt>
                  <dd className="font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
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
        <div className="py-16 text-center">
          <GitCompare className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="text-xl font-semibold">No products to compare</h2>
          <p className="mt-2 text-muted dark:text-muted-light">Add products using the compare button</p>
          <Link to="/products">
            <Button variant="ai" className="mt-4">Browse Products</Button>
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compare Products</h1>
        <Button variant="ghost" size="sm" onClick={clearCompare}>Clear All</Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-ai" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left text-sm font-medium text-muted">Attribute</th>
              {validProducts.map((p) => p && (
                <th key={p.id} className={`p-4 text-left ${p.id === bestMatch?.id ? 'bg-violet-ai/5' : ''}`}>
                  <button onClick={() => removeFromCompare(p.id)} className="float-right text-muted hover:text-error">×</button>
                  <img src={p.image} alt={p.name} className="mb-2 h-32 w-24 rounded-lg object-cover" />
                  <p className="font-medium">{p.name}</p>
                  {p.id === bestMatch?.id && <Badge variant="ai" className="mt-1">Best Match</Badge>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Price', get: (p: Product) => formatPrice(p.price) },
              { label: 'AI Match', get: (p: Product) => (p.aiMatchScore ? `${p.aiMatchScore}%` : '—') },
              { label: 'Rating', get: (p: Product) => `${p.rating} ★` },
              { label: 'Category', get: (p: Product) => p.category },
              { label: 'Stock', get: (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0) },
            ].map((row) => (
              <tr key={row.label} className="border-t border-border dark:border-border-dark">
                <td className="p-4 text-sm font-medium text-muted">{row.label}</td>
                {validProducts.map((p) => p && (
                  <td key={p.id} className={`p-4 text-sm ${p.id === bestMatch?.id ? 'bg-violet-ai/5 font-medium' : ''}`}>
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
