import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Toast } from './components/ui/Toast';

// Public
import { LandingPage } from './pages/public/LandingPage';
import {
  HowItWorksPage, AboutPage, PricingPage, ContactPage,
  FAQPage, PrivacyPage, TermsPage, LoginPage, SignupPage,
} from './pages/public/PublicPages';

// Buyer
import { AIBuyerPage } from './pages/buyer/AIBuyerPage';
import { ProductsPage } from './pages/buyer/ProductsPage';
import { ProductDetailPage, ComparePage } from './pages/buyer/ProductDetailPage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { OrdersPage, OrderDetailPage, PreferencesPage } from './pages/buyer/OrdersPage';

// Merchant
import {
  MerchantDashboardPage, MerchantProductsPage, MerchantInventoryPage, MerchantOrdersPage,
} from './pages/merchant/MerchantDashboard';
import {
  AnalyticsPage, AIRevenueAgentPage, RecommendationsPage,
  AIBuyerActivityPage, AuditTrailPage, SettingsPage,
} from './pages/merchant/MerchantPages';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Buyer */}
          <Route path="/buyer" element={<AIBuyerPage />} />
          <Route path="/buyer/preferences" element={<PreferencesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          {/* Merchant */}
          <Route path="/merchant" element={<MerchantDashboardPage />} />
          <Route path="/merchant/products" element={<MerchantProductsPage />} />
          <Route path="/merchant/inventory" element={<MerchantInventoryPage />} />
          <Route path="/merchant/orders" element={<MerchantOrdersPage />} />
          <Route path="/merchant/analytics" element={<AnalyticsPage />} />
          <Route path="/merchant/ai" element={<AIRevenueAgentPage />} />
          <Route path="/merchant/recommendations" element={<RecommendationsPage />} />
          <Route path="/merchant/ai-buyers" element={<AIBuyerActivityPage />} />
          <Route path="/merchant/audit" element={<AuditTrailPage />} />
          <Route path="/merchant/settings" element={<SettingsPage />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
