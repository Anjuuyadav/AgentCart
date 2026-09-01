import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getProductById, formatPrice, CROSS_SELL_PRODUCT_ID } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, addToCart, showToast } = useApp();
  const crossSell = getProductById(CROSS_SELL_PRODUCT_ID);

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-16 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted dark:text-muted-light">Start shopping or ask AI Buyer for recommendations</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/buyer"><Button variant="ai">Try AI Buyer</Button></Link>
            <Link to="/products"><Button variant="outline">Browse Products</Button></Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <Card key={`${item.productId}-${item.size}`} padding="sm">
                <div className="flex gap-4">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className="h-28 w-24 rounded-lg object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link to={`/product/${product.id}`} className="font-medium hover:text-violet-ai">{product.name}</Link>
                    <p className="text-sm text-muted dark:text-muted-light">{item.size} · {item.color}</p>
                    <p className="mt-1 text-lg font-semibold">{formatPrice(product.price)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="rounded-lg border p-1 hover:bg-charcoal/5 dark:hover:bg-white/5">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="rounded-lg border p-1 hover:bg-charcoal/5 dark:hover:bg-white/5">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-muted hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {crossSell && (
            <Card className="border-violet-ai/20 bg-violet-ai-muted/20 dark:bg-violet-ai/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-violet-ai" />
                <span className="text-sm font-semibold text-violet-ai">AI Recommendation</span>
              </div>
              <p className="mb-3 text-sm text-muted dark:text-muted-light">Complete the look with:</p>
              <div className="flex items-center gap-4">
                <img src={crossSell.image} alt={crossSell.name} className="h-16 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{crossSell.name}</p>
                  <p className="font-semibold">{formatPrice(crossSell.price)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { addToCart({ productId: crossSell.id, quantity: 1, size: 'One Size', color: 'Gold' }); showToast('Added to cart'); }}>
                  Add to Cart
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
                <span>{formatPrice(cartTotal)}</span>
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
              <Button variant="ai" className="w-full">Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
