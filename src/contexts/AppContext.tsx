import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem, ChatMessage, BuyerRequirements, Order, UserPreferences } from '../types';
import { cartService, type BackendCartItem } from '../services/cartService';
import { orderService } from '../services/orderService';
import { preferencesService } from '../services/preferencesService';
import { getUserFriendlyMessage } from '../services/apiClient';

export interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  backendCartItems: BackendCartItem[];
  cartLoaded: boolean;
  cartLoading: boolean;
  cartError: string | null;
  addToCart: (item: CartItem) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  compareList: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  requirements: BuyerRequirements | null;
  setRequirements: (req: BuyerRequirements | null) => void;
  recommendedProductIds: string[];
  setRecommendedProductIds: (ids: string[]) => void;
  isAiProcessing: boolean;
  setIsAiProcessing: (v: boolean) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  orders: Order[];
  ordersLoaded: boolean;
  ordersLoading: boolean;
  ordersError: string | null;
  loadOrders: () => Promise<void>;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  preferences: UserPreferences;
  preferencesLoaded: boolean;
  preferencesLoading: boolean;
  preferencesError: string | null;
  loadPreferences: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<boolean>;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  budgetLimit: 5000,
  preferredSizes: ['M'],
  preferredColors: ['Wine', 'Burgundy'],
  preferredCategories: ['wedding-dresses', 'earrings'],
  autoApproveUnderBudget: true,
  aiPersonalization: true,
  notifications: true,
};

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('agentcart-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [backendCartItems, setBackendCartItems] = useState<BackendCartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const [compareList, setCompareList] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [requirements, setRequirements] = useState<BuyerRequirements | null>(null);
  const [recommendedProductIds, setRecommendedProductIds] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotalVal, setCartTotalVal] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('agentcart-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const cart: CartItem[] = backendCartItems.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
    size: i.size,
    color: i.color,
  }));

  const cartCount = backendCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const refreshCart = useCallback(async () => {
    setCartLoading(true);
    setCartError(null);
    try {
      const c = await cartService.getCart();
      setBackendCartItems(c.items || []);
      setCartSubtotal(Number(c.subtotal ?? 0));
      setCartTotalVal(Number(c.total ?? 0));
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setCartError(msg);
      console.error('[AppContext] refreshCart failed:', err);
    } finally {
      setCartLoading(false);
      setCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const list = await orderService.getAll();
      setOrders(list);
      if (list.length > 0 && !lastOrder) {
        setLastOrder(list[0]);
      }
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setOrdersError(msg);
      console.error('[AppContext] loadOrders failed:', err);
    } finally {
      setOrdersLoading(false);
      setOrdersLoaded(true);
    }
  }, [lastOrder]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const loadPreferences = useCallback(async () => {
    setPreferencesLoading(true);
    setPreferencesError(null);
    try {
      const p = await preferencesService.getPreferences();
      setPreferences(p);
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPreferencesError(msg);
      console.error('[AppContext] loadPreferences failed:', err);
    } finally {
      setPreferencesLoading(false);
      setPreferencesLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const addToCart = useCallback(async (item: CartItem): Promise<boolean> => {
    try {
      const c = await cartService.addItem({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
      setBackendCartItems(c.items || []);
      setCartSubtotal(Number(c.subtotal ?? 0));
      setCartTotalVal(Number(c.total ?? 0));
      setCartError(null);
      return true;
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setCartError(msg);
      showToast(msg, 'error');
      console.error('[AppContext] addToCart failed:', err);
      return false;
    }
  }, []);

  const removeFromCart = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const item = backendCartItems.find((i) => i.productId === productId);
      if (!item?.id) return true;
      const c = await cartService.removeItem(item.id);
      setBackendCartItems(c.items || []);
      setCartSubtotal(Number(c.subtotal ?? 0));
      setCartTotalVal(Number(c.total ?? 0));
      setCartError(null);
      return true;
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setCartError(msg);
      showToast(msg, 'error');
      console.error('[AppContext] removeFromCart failed:', err);
      return false;
    }
  }, [backendCartItems]);

  const updateCartQuantity = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      const item = backendCartItems.find((i) => i.productId === productId);
      if (!item?.id) return false;
      const c = await cartService.updateItem(item.id, { quantity });
      setBackendCartItems(c.items || []);
      setCartSubtotal(Number(c.subtotal ?? 0));
      setCartTotalVal(Number(c.total ?? 0));
      setCartError(null);
      return true;
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setCartError(msg);
      showToast(msg, 'error');
      console.error('[AppContext] updateCartQuantity failed:', err);
      return false;
    }
  }, [backendCartItems, removeFromCart]);

  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      const c = await cartService.clearCart();
      setBackendCartItems(c.items || []);
      setCartSubtotal(Number(c.subtotal ?? 0));
      setCartTotalVal(Number(c.total ?? 0));
      setCartError(null);
      return true;
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setCartError(msg);
      showToast(msg, 'error');
      console.error('[AppContext] clearCart failed:', err);
      return false;
    }
  }, []);

  const addToCompare = useCallback((productId: string) => {
    setCompareList((prev) => (prev.includes(productId) ? prev : prev.length < 4 ? [...prev, productId] : prev));
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const addChatMessage = useCallback((message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setLastOrder(order);
  }, []);

  const updatePreferencesLocal = useCallback(async (prefs: Partial<UserPreferences>): Promise<boolean> => {
    try {
      const updated = await preferencesService.updatePreferences(prefs);
      setPreferences(updated);
      setPreferencesError(null);
      return true;
    } catch (err) {
      const msg = getUserFriendlyMessage(err);
      setPreferencesError(msg);
      showToast(msg, 'error');
      console.error('[AppContext] updatePreferences failed:', err);
      setPreferences((prev) => ({ ...prev, ...prefs }));
      return false;
    }
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        backendCartItems,
        cartLoaded,
        cartLoading,
        cartError,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        refreshCart,
        cartCount,
        cartSubtotal,
        cartTotal: cartTotalVal,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        chatMessages,
        setChatMessages,
        addChatMessage,
        requirements,
        setRequirements,
        recommendedProductIds,
        setRecommendedProductIds,
        isAiProcessing,
        setIsAiProcessing,
        lastOrder,
        setLastOrder,
        orders,
        ordersLoaded,
        ordersLoading,
        ordersError,
        loadOrders,
        setOrders,
        addOrder,
        preferences,
        preferencesLoaded,
        preferencesLoading,
        preferencesError,
        loadPreferences,
        updatePreferences: updatePreferencesLocal,
        toast,
        showToast,
        hideToast,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
