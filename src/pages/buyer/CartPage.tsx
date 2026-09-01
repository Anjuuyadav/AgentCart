import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatPrice, CROSS_SELL_PRODUCT_ID } from '../../services';
import { productService } from '../../services/productService';
import { useApp } from '../../contexts/useApp';
import type { Product } from '../../types';
import { useState, useEffect } from 'react';

export function CartPage() {
  const {
    cart,
    backendCartItems,
    cartLoading,
    cartLoaded,
    cartError,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    addToCart,
    showToast,
    refreshCart,
  } = useApp();

  const [updating, setUpdating] = useState<string | null>(null);
  const [crossSell, setCrossSell] = useState<Product | undefined>(undefined);
  const [crossSellAdding, setCrossSellAdding] = useState(false);

  useEffect(() => {
    async function loadCrossSell() {
      try {
        const p = await productService.getById(CROSS_SELL_PRODUCT_ID);
        setCrossSell(p);
      } catch {
        setCrossSell(undefined);
      }
    }
    loadCrossSell();
  }, []);

  const getItemPrice = (idx: number): number => {
    const bi = backendCartItems[idx];
    if (bi) return Number(bi.unitPrice ?? bi.productPrice ?? 0);
    return 0;
  };

  const getItemName = (idx: number): string => {
    const bi = backendCartItems[idx];
    return bi?.productName || cart[idx]?.productId || '';
  };

  const getItemImage = (idx: number): string => {
    const bi = backendCartItems[idx];
    return bi?.productImage || '';
  };

  if (!cartLoaded && cartLoading) {
    return (
      <BuyerLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-ai" />
          <p className="text-sm text-muted dark:text-muted-light">Loading your cart...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (cartError && cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-error" />
          <h2 className="text-xl font-semibold">Unable to load cart.</h2>
          <p className="mt-2 text-sm text-muted dark:text-muted-light">{cartError}</p>
          <button
            onClick={refreshCart}
            className="mt-4 rounded-lg bg-violet-ai px-4 py-2 text-sm font-medium text-white hover:bg-violet-ai/90"
          >
            Retry
          </button>
        </div>
      </BuyerLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted dark:text-muted-light">
            Start shopping or ask AI Buyer for recommendations
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/buyer">
              <Button variant="ai">Try AI Buyer</Button>
            </Link>
            <Link to="/products">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  const handleQty = async (productId: string, delta: number) => {
    const bi = backendCartItems.find((i) => i.productId === productId);
    if (!bi) return;
    const newQty = bi.quantity + delta;
    setUpdating(productId);
    await updateCartQuantity(productId, newQty);
    setUpdating(null);
  };

  const handleRemove = async (productId: string) => {
    setUpdating(productId);
    await removeFromCart(productId);
    setUpdating(null);
  };

  const handleAddCrossSell = async () => {
    if (!crossSell) return;
    const variant = crossSell.variants[0];
    if (!variant) return;
    setCrossSellAdding(true);
    const ok = await addToCart({
      productId: crossSell.id,
      quantity: 1,
      size: variant.size,
      color: variant.color,
    });
    setCrossSellAdding(false);
    if (ok) showToast('Added to cart', 'success');
  };

  return (
    <BuyerLayout>
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => {
            const bi = backendCartItems[idx];
            const idForUpdate = item.productId;
            const itemUpdating = updating === idForUpdate;
            const price = getItemPrice(idx);
            const name = getItemName(idx);
            const image = getItemImage(idx);
            const lineTotal = price * item.quantity;

            return (
              <Card key={`${item.productId}-${item.size}-${idx}`} padding="sm">
                <div className="flex gap-4">
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={name || item.productId}
                        className="h-28 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-28 w-24 rounded-lg bg-surface dark:bg-surface-dark flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted" />
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col min-w-0">
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-medium hover:text-violet-ai truncate"
                    >
                      {name || item.productId}
                    </Link>
                    <p className="text-sm text-muted dark:text-muted-light">
                      {item.size} · {item.color}
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {price > 0 ? formatPrice(price) : formatPrice(0)}
                      {lineTotal > 0 && item.quantity > 1 && (
                        <span className="ml-2 text-sm font-normal text-muted">
                          ({formatPrice(lineTotal)})
                        </span>
                      )}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQty(item.productId, -1)}
                          disabled={itemUpdating || item.quantity <= 1}
                          className="rounded-lg border p-1 hover:bg-charcoal/5 dark:hover:bg-white/5 disabled:opacity-50"
                        >
                          {itemUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQty(item.productId, +1)}
                          disabled={itemUpdating}
                          className="rounded-lg border p-1 hover:bg-charcoal/5 dark:hover:bg-white/5 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={itemUpdating}
                        className="text-muted hover:text-error disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {crossSell && !backendCartItems.some((i) => i.productId === crossSell.id) && (
            <Card className="border-violet-ai/20 bg-violet-ai-muted/20 dark:bg-violet-ai/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-ai" />
                <span className="text-sm font-semibold text-violet-ai">AI Recommendation</span>
              </div>
              <p className="mb-3 text-sm text-muted dark:text-muted-light">Complete the look with:</p>
              <div className="flex items-center gap-4">
                <img
                  src={crossSell.image}
                  alt={crossSell.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{crossSell.name}</p>
                  <p className="font-semibold">{formatPrice(crossSell.price)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCrossSell}
                  disabled={crossSellAdding}
                >
                  {crossSellAdding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <h3 className="mb-4 font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted dark:text-muted-light">Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted dark:text-muted-light">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-2 dark:border-border-dark">
                <div className="flex justify-between font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
            <Link to="/checkout" className="mt-6 block">
              <Button variant="ai" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
