import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getProductById } from '../data/mockData';
import type { CartItem, ChatMessage, BuyerRequirements, Order, UserPreferences } from '../types';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
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
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
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

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('agentcart-theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('agentcart-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [requirements, setRequirements] = useState<BuyerRequirements | null>(null);
  const [recommendedProductIds, setRecommendedProductIds] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('agentcart-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agentcart-cart', JSON.stringify(cart));
  }, [cart]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size && i.color === item.color);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

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

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
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
        setOrders,
        addOrder,
        preferences,
        updatePreferences,
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

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
