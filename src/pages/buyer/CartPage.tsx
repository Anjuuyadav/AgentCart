import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
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
        <div className="flex flex-col items-center justify-center py-36">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#D4AF37]" />
          <p className="font-serif text-sm italic text-[#9E9E9E]">Opening your private wardrobe bag...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (cartError && cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-24 text-center rounded-[4px] border border-rose-500/30 bg-rose-950/20">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-rose-400" />
          <h2 className="font-serif text-2xl font-normal text-rose-300">Bag Retrieval Interrupted</h2>
          <p className="mt-2 text-xs text-rose-400/80">{cartError}</p>
          <button
            onClick={refreshCart}
            className="mt-6 rounded-[3px] bg-[#D4AF37] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0B0B0C] hover:bg-[#E5C358] cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </BuyerLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-28 text-center rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[#131314]/50">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[4px] border border-[rgba(212,175,55,0.3)] bg-[#1A1A1E] text-[#D4AF37]">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#E5E2E3]">Your Shopping Bag is Empty</h2>
          <p className="mt-2 max-w-sm mx-auto text-xs text-[#9E9E9E]">
            No creations currently held. Consult the AI Concierge for tailored recommendations or explore our archival drops.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/buyer">
              <Button variant="primary" size="md">Consult AI Concierge</Button>
            </Link>
            <Link to="/products">
              <Button variant="secondary" size="md">Browse Collection</Button>
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
    if (ok) showToast('Accessory added to look', 'success');
  };

  return (
    <BuyerLayout>
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-2 border-b border-[rgba(255,255,255,0.08)] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
            RESERVED SELECTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#E5E2E3]">
            Shopping Bag
          </h1>
        </div>
        <span className="text-xs text-[#737373]">
          {cart.length} distinct {cart.length === 1 ? 'creation' : 'creations'} reserved
        </span>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Left 8 Cols: Garments List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => {
            const idForUpdate = item.productId;
            const itemUpdating = updating === idForUpdate;
            const price = getItemPrice(idx);
            const name = getItemName(idx);
            const image = getItemImage(idx);
            const lineTotal = price * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.size}-${idx}`}
                className="group relative flex gap-5 rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-4 transition-all hover:border-[rgba(212,175,55,0.35)]"
              >
                {/* 3:4 Thumbnail */}
                <Link to={`/product/${item.productId}`} className="relative aspect-[3/4] h-32 shrink-0 overflow-hidden rounded-[2px] bg-[#0E0E0F]">
                  {image ? (
                    <img
                      src={image}
                      alt={name || item.productId}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#17171B]">
                      <ShoppingBag className="h-6 w-6 text-[#737373]" />
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-serif text-base font-normal text-[#E5E2E3] hover:text-[#D4AF37] transition-colors truncate"
                      >
                        {name || item.productId}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={itemUpdating}
                        className="text-[#737373] hover:text-rose-400 transition-colors p-1 cursor-pointer disabled:opacity-40"
                        title="Remove piece"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="mt-1 font-sans text-xs text-[#9E9E9E]">
                      Size: <span className="text-[#E5E2E3] uppercase">{item.size}</span> · Palette: <span className="text-[#E5E2E3] capitalize">{item.color}</span>
                    </p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-sans text-base font-semibold text-[#E2E2E2]">
                        {price > 0 ? formatPrice(price) : formatPrice(0)}
                      </span>
                      {lineTotal > 0 && item.quantity > 1 && (
                        <span className="text-xs text-[#737373]">
                          ({formatPrice(lineTotal)} total)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Minimalist Control */}
                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center rounded-[3px] border border-[rgba(255,255,255,0.12)] bg-[#17171B]">
                      <button
                        onClick={() => handleQty(item.productId, -1)}
                        disabled={itemUpdating || item.quantity <= 1}
                        className="p-1.5 text-[#9E9E9E] hover:text-[#D4AF37] transition-colors cursor-pointer disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        {itemUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Minus className="h-3.5 w-3.5" />}
                      </button>
                      <span className="w-8 text-center font-sans text-xs font-semibold text-[#E5E2E3]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQty(item.productId, +1)}
                        disabled={itemUpdating}
                        className="p-1.5 text-[#9E9E9E] hover:text-[#D4AF37] transition-colors cursor-pointer disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                      In Atelier Hold
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* COMPLETE THE LOOK — Real AI Cross-Sell */}
          {crossSell && !backendCartItems.some((i) => i.productId === crossSell.id) && (
            <div className="relative overflow-hidden rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-gradient-to-r from-[#1A1A1E] via-[#141417] to-[#0E0E0F] p-5 shadow-[0_0_30px_-10px_rgba(212,175,55,0.15)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    Complete The Look · Stylist Recommendation
                  </span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#9E9E9E]">Stylist Curated</span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={crossSell.image}
                  alt={crossSell.name}
                  className="h-18 w-14 rounded-[2px] object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-medium text-white truncate">{crossSell.name}</h4>
                  <p className="font-sans text-xs font-semibold text-[#D4AF37] mt-0.5">{formatPrice(crossSell.price)}</p>
                  <p className="text-[10px] text-[#9E9E9E] mt-0.5">High affinity accessory curated for your dress selection</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddCrossSell}
                  disabled={crossSellAdding}
                >
                  {crossSellAdding ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    'Add Piece'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] space-y-6">
            <h3 className="font-serif text-xl font-normal text-[#E5E2E3] border-b border-[rgba(255,255,255,0.08)] pb-4">
              Acquisition Summary
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-[#9E9E9E]">
                <span>Garments Subtotal</span>
                <span className="text-[#E5E2E3] font-medium">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#9E9E9E]">
                <span>White Glove Courier</span>
                <span className="text-[#D4AF37] uppercase tracking-wider font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-[#9E9E9E]">
                <span>Policy Evaluation</span>
                <span className="text-emerald-400">Approved</span>
              </div>

              <div className="border-t border-[rgba(255,255,255,0.08)] pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#E5E2E3]">
                    Estimated Total
                  </span>
                  <span className="font-sans text-2xl font-semibold text-[#D4AF37]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="block pt-2">
              <Button variant="primary" size="lg" className="w-full gap-2">
                <span>Proceed to Authorization</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="pt-2 text-center text-[10px] text-[#737373] tracking-wide">
              <span>Razorpay encrypted test transaction rail</span>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
