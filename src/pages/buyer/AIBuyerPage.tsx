import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, Check, Loader2, AlertCircle, Compass, ArrowRight } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AIBadge, AIStatus } from '../../components/ai/AIComponents';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/useApp';
import { productService } from '../../services/productService';
import { aiBuyerService } from '../../services/aiBuyerService';
import { DEMO_QUERY, formatPrice } from '../../services';
import type { ChatMessage, BuyerRequirements, Product } from '../../types';
import { getUserFriendlyMessage } from '../../services/apiClient';

function RequirementsDisplay({ requirements }: { requirements: BuyerRequirements }) {
  return (
    <div className="relative overflow-hidden rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-gradient-to-br from-[#1C1B1C] to-[#131314] p-4 shadow-[0_0_25px_-5px_rgba(212,175,55,0.15)]">
      <div className="mb-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Concierge Brief Synthesized
          </span>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-400">Validated</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {requirements.occasion && (
          <div className="rounded-[2px] bg-[#0E0E0F]/80 p-2.5 border border-[rgba(255,255,255,0.04)]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Occasion</p>
            <p className="mt-0.5 font-serif text-xs text-[#E5E2E3] truncate">{requirements.occasion}</p>
          </div>
        )}
        {requirements.budget && (
          <div className="rounded-[2px] bg-[#0E0E0F]/80 p-2.5 border border-[rgba(255,255,255,0.04)]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Budget Cap</p>
            <p className="mt-0.5 font-serif text-xs text-[#D4AF37] font-semibold">₹{requirements.budget.toLocaleString('en-IN')}</p>
          </div>
        )}
        {requirements.size && (
          <div className="rounded-[2px] bg-[#0E0E0F]/80 p-2.5 border border-[rgba(255,255,255,0.04)]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Size Standard</p>
            <p className="mt-0.5 font-serif text-xs text-[#E5E2E3] uppercase">{requirements.size}</p>
          </div>
        )}
        {requirements.color && (
          <div className="rounded-[2px] bg-[#0E0E0F]/80 p-2.5 border border-[rgba(255,255,255,0.04)]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#737373]">Color Palette</p>
            <p className="mt-0.5 font-serif text-xs text-[#E5E2E3] capitalize">{requirements.color}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.type === 'requirements' && message.requirements) {
    return (
      <div className="animate-slide-up">
        <RequirementsDisplay requirements={message.requirements} />
      </div>
    );
  }

  if (message.type === 'status') {
    return (
      <div className="flex items-center gap-2.5 py-1 text-xs text-[#D4AF37] animate-pulse-soft">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF37]" />
        <span className="font-sans uppercase tracking-[0.14em] text-[11px]">{message.content}</span>
      </div>
    );
  }

  if (message.type === 'recommendations') {
    return (
      <div className="animate-slide-up my-1 rounded-[4px] border border-[rgba(212,175,55,0.25)] bg-[#17171B]/90 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span className="font-serif text-sm text-[#E5E2E3]">{message.content}</span>
        </div>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div
        className={`max-w-[85%] rounded-[4px] p-4 text-xs sm:text-sm leading-relaxed ${
          isUser
            ? 'border border-[rgba(212,175,55,0.4)] bg-[#1C1B1C] text-[#E5E2E3] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
            : 'border border-[rgba(255,255,255,0.08)] bg-[#131314] text-[#E5E2E3]'
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-1.5 border-b border-[rgba(255,255,255,0.06)] pb-1.5">
            <Sparkles className="h-3 w-3 text-[#D4AF37]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
              Haute Concierge
            </span>
          </div>
        )}
        <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#E5E2E3]/90">{message.content}</p>
      </div>
    </div>
  );
}

interface RecommendedProductState {
  loading: boolean;
  error: string | null;
  product: Product | null;
  aiMatchScore?: number;
  aiReasons?: string[];
}

export function AIBuyerPage() {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [localRequirements, setLocalRequirements] = useState<BuyerRequirements | null>(null);
  const [localProductIds, setLocalProductIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<Map<string, RecommendedProductState>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setRequirements, setRecommendedProductIds } = useApp();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, showRecommendations, recommendations]);

  useEffect(() => {
    if (!showRecommendations || localProductIds.length === 0) return;

    let cancelled = false;

    const loadProducts = async () => {
      const next = new Map<string, RecommendedProductState>();
      for (const id of localProductIds) {
        next.set(id, { loading: true, error: null, product: null });
      }
      setRecommendations(next);

      const matchScores: Record<string, number> = {};
      const reasons: Record<string, string[]> = {};
      if (localRequirements && localProductIds.length) {
        try {
          localProductIds.forEach((pid, idx) => {
            matchScores[pid] = Math.max(70, 95 - idx * 7);
            reasons[pid] = [
              localRequirements.occasion ? `Matches ${localRequirements.occasion} occasion` : 'Highly rated',
              localRequirements.budget ? `Within ₹${localRequirements.budget.toLocaleString('en-IN')} budget` : 'Great value',
            ];
          });
        } catch { /* noop */ }
      }

      for (const id of localProductIds) {
        if (cancelled) return;
        try {
          const product = await productService.getById(id);
          if (cancelled) return;
          setRecommendations((prev) => {
            const copy = new Map(prev);
            copy.set(id, {
              loading: false,
              error: null,
              product: product || null,
              aiMatchScore: matchScores[id],
              aiReasons: reasons[id],
            });
            return copy;
          });
        } catch (err: any) {
          if (cancelled) return;
          setRecommendations((prev) => {
            const copy = new Map(prev);
            copy.set(id, {
              loading: false,
              error: err?.message || 'Unable to load product',
              product: null,
              aiMatchScore: matchScores[id],
            });
            return copy;
          });
        }
      }
    };

    loadProducts();
    return () => { cancelled = true; };
  }, [showRecommendations, localProductIds, localRequirements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || processing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, userMessage]);
    setInput('');
    setProcessing(true);
    setShowRecommendations(false);
    setRecommendations(new Map());

    try {
      // Show status messages
      const statusMessages = ['Understanding your requirements...', 'Searching AgentCart...', 'Ranking matches...'];
      for (const step of statusMessages) {
        const statusMsg: ChatMessage = {
          id: `status-${Date.now()}-${Math.random()}`,
          role: 'assistant',
          content: step,
          timestamp: new Date(),
          type: 'status',
        };
        setLocalMessages((prev) => [...prev, statusMsg]);
        await new Promise((r) => setTimeout(r, 400));
      }

      // Remove status messages
      setLocalMessages((prev) => prev.filter((m) => m.type !== 'status'));

      // Call the real AI Buyer backend service
      const response = await aiBuyerService.chat({
        sessionId: undefined, // Start new session
        message: userMessage.content,
      });

      if (response.status === 'error') {
        throw new Error(response.error || 'AI Buyer encountered an error');
      }

      // Update local state with extracted requirements
      if (response.requirements) {
        setLocalRequirements(response.requirements as BuyerRequirements);
        setRequirements(response.requirements as BuyerRequirements);

        // Add requirements message
        setLocalMessages((prev) => [...prev, {
          id: `req-${Date.now()}`,
          role: 'assistant',
          content: 'Extracted Requirements',
          timestamp: new Date(),
          type: 'requirements',
          requirements: response.requirements as BuyerRequirements,
        }]);
      }

      // Add recommendations message
      setLocalMessages((prev) => [...prev, {
        id: `rec-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        type: 'recommendations',
      }]);

      // Update product IDs and recommendations
      const productIds = response.recommendations.map((r) => r.productId);
      setLocalProductIds(productIds);
      setRecommendedProductIds(productIds);

      // Build product state from recommendations
      const recommendationsMap = new Map<string, RecommendedProductState>();
      for (const rec of response.recommendations) {
        try {
          const product = await productService.getById(rec.productId);
          if (product) {
            recommendationsMap.set(rec.productId, {
              loading: false,
              error: null,
              product,
              aiMatchScore: rec.matchScore,
              aiReasons: rec.reasons,
            });

            // Record view in AI system
            try {
              await aiBuyerService.recordView({
                sessionId: response.sessionId,
                productId: rec.productId,
                productName: rec.name,
                matchScore: rec.matchScore,
              });
            } catch (err) {
              console.error('[AIBuyerPage] Failed to record view:', err);
            }
          }
        } catch (err) {
          recommendationsMap.set(rec.productId, {
            loading: false,
            error: getUserFriendlyMessage(err),
            product: null,
            aiMatchScore: rec.matchScore,
          });
        }
      }

      setRecommendations(recommendationsMap);
      setShowRecommendations(true);
    } catch (err) {
      const message = getUserFriendlyMessage(err);
      console.error('[AIBuyerPage] Error:', err);

      // Add error message
      setLocalMessages((prev) => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an error: ${message}. Please try again.`,
        timestamp: new Date(),
        type: 'text',
      }]);
    } finally {
      setProcessing(false);
    }
  };

  const recommendedList = localProductIds
    .map((id) => ({ id, state: recommendations.get(id) }))
    .filter((entry) => entry.state);

  return (
    <BuyerLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-3 border-b border-[rgba(255,255,255,0.08)] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              TELEPATHIC STYLING SALON
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#E5E2E3]">
            The AI Stylist Concierge
          </h1>
          <p className="mt-1 font-sans text-xs text-[#9E9E9E]">
            Articulate aesthetic preferences, formal dress codes, budget boundaries, or specific capsule silhouettes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="ai">Agent Node 01 · Active</Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left 7 Columns: Dialogue Canvas */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative flex h-[640px] flex-col overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314]/90 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
            {/* Ambient gold glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#D4AF37]/[0.05] blur-[80px]" />

            {/* Message Stream */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {localMessages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[rgba(212,175,55,0.35)] bg-[#1A1A1E] text-[#D4AF37] shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-normal text-[#E5E2E3]">How may the concierge tailor your wardrobe?</h3>
                    <p className="font-sans text-xs text-[#9E9E9E] max-w-sm mx-auto">
                      Inquire with complex criteria. Sizing, seasonal fabrics, color palettes, or target acquisition caps.
                    </p>
                  </div>

                  {/* Refined Prompt Chips */}
                  <div className="pt-2 flex flex-col gap-2 w-full max-w-md">
                    <button
                      onClick={() => setInput(DEMO_QUERY)}
                      className="group flex items-center justify-between rounded-[3px] border border-[rgba(212,175,55,0.3)] bg-[#1A1A1E] px-4 py-2.5 text-left text-xs text-[#E5E2E3] transition-all hover:border-[#D4AF37] hover:bg-[#201F20] cursor-pointer shadow-[0_0_15px_-4px_rgba(212,175,55,0.15)]"
                    >
                      <span className="truncate">"Wine-colored satin dress under ₹5,000, size M"</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      onClick={() => setInput('I need an ivory bridal lace gown under ₹6,000 in size S')}
                      className="group flex items-center justify-between rounded-[3px] border border-[rgba(255,255,255,0.08)] bg-[#141417] px-4 py-2 text-left text-xs text-[#9E9E9E] transition-all hover:border-[rgba(212,175,55,0.3)] hover:text-[#E5E2E3] cursor-pointer"
                    >
                      <span className="truncate">"Ivory bridal lace gown under ₹6,000, size S"</span>
                      <ArrowRight className="h-3 w-3 opacity-40 group-hover:opacity-100" />
                    </button>

                    <button
                      onClick={() => setInput('Show me statement gold jewelry and evening accessories under ₹2,000')}
                      className="group flex items-center justify-between rounded-[3px] border border-[rgba(255,255,255,0.08)] bg-[#141417] px-4 py-2 text-left text-xs text-[#9E9E9E] transition-all hover:border-[rgba(212,175,55,0.3)] hover:text-[#E5E2E3] cursor-pointer"
                    >
                      <span className="truncate">"Gold jewelry and evening accessories under ₹2,000"</span>
                      <ArrowRight className="h-3 w-3 opacity-40 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              )}

              {localMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {processing && <AIStatus status="thinking" label="Concierge evaluating atelier inventory..." />}
              <div ref={messagesEndRef} />
            </div>

            {/* Luxury Prompt Bar */}
            <form onSubmit={handleSubmit} className="border-t border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] p-4">
              <div className="flex gap-2.5">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire with your styling criteria..."
                  className="flex-1 rounded-[3px] border border-[rgba(255,255,255,0.08)] bg-[#141417] px-4 py-3 text-xs tracking-wide text-[#E5E2E3] placeholder-[#737373] transition-colors focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/35"
                  disabled={processing}
                />
                <Button type="submit" variant="primary" disabled={processing || !input.trim()} size="md">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 5 Columns: Concierge Dossier & Curated Garments */}
        <div className="lg:col-span-5 space-y-6">
          {localRequirements && (
            <div>
              <RequirementsDisplay requirements={localRequirements} />
            </div>
          )}

          {showRecommendations && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
                <h3 className="font-serif text-lg font-normal text-[#E5E2E3]">Curated Selections</h3>
                <AIBadge>{localProductIds.length} Couture Matches</AIBadge>
              </div>

              {recommendedList.length === 0 ? (
                <Card>
                  <p className="text-xs text-[#9E9E9E]">No specific garments cataloged for this criteria.</p>
                </Card>
              ) : (
                <div className="space-y-3.5">
                  {recommendedList.map(({ id, state }) => {
                    if (!state) return null;
                    if (state.loading) {
                      return (
                        <div key={id} className="rounded-[4px] border border-[rgba(255,255,255,0.06)] bg-[#131314] p-3 animate-pulse">
                          <div className="flex gap-3">
                            <div className="h-24 w-18 rounded-[2px] bg-[#1C1B1C]" />
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-3.5 w-3/4 rounded bg-[#1C1B1C]" />
                              <div className="h-4 w-1/3 rounded bg-[#1C1B1C]" />
                              <div className="h-3 w-1/2 rounded bg-[#1C1B1C]" />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (state.error || !state.product) {
                      return (
                        <div key={id} className="rounded-[4px] border border-rose-500/30 bg-rose-950/20 p-3 flex items-start gap-2.5">
                          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-rose-300">Garment Unavailable</p>
                            <p className="text-[11px] text-rose-400/80">{state.error || 'Unable to load piece.'}</p>
                          </div>
                        </div>
                      );
                    }
                    const product = state.product;
                    return (
                      <div
                        key={id}
                        className="group relative overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-3.5 transition-all duration-300 hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_8px_25px_-8px_rgba(212,175,55,0.15)]"
                      >
                        <div className="flex gap-4">
                          <Link to={`/product/${product.id}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-[2px] bg-[#0E0E0F]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                              }}
                            />
                          </Link>
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                {state.aiMatchScore ? (
                                  <Badge variant="ai">Match {state.aiMatchScore}%</Badge>
                                ) : (
                                  <span />
                                )}
                                <span className="text-[10px] uppercase tracking-wider text-[#737373]">
                                  {product.category.replace(/-/g, ' ')}
                                </span>
                              </div>

                              <Link to={`/product/${product.id}`}>
                                <h4 className="font-serif text-sm font-medium text-[#E5E2E3] truncate transition-colors group-hover:text-[#D4AF37]">
                                  {product.name}
                                </h4>
                              </Link>

                              <p className="font-sans text-sm font-semibold text-[#E2E2E2] mt-0.5">
                                {formatPrice(product.price)}
                              </p>
                            </div>

                            {state.aiReasons && state.aiReasons.length > 0 && (
                              <ul className="space-y-0.5 pt-1.5 border-t border-[rgba(255,255,255,0.04)]">
                                {state.aiReasons.slice(0, 2).map((r, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5 text-[11px] text-[#9E9E9E]">
                                    <Check className="h-3 w-3 text-[#D4AF37] shrink-0" />
                                    <span className="truncate">{r}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!showRecommendations && !localRequirements && (
            <div className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#131314] p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Compass className="h-4 w-4" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em]">Purchase Policy Guardrails</h3>
              </div>
              <p className="font-sans text-xs leading-relaxed text-[#9E9E9E]">
                The AI Concierge strictly adheres to your configured purchase policies—guaranteeing budget caps, auto-approval thresholds, sizing preferences, and verified merchant authorization rules.
              </p>
              <Link to="/buyer/preferences" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37] hover:underline">
                <span>Configure Policy Preferences</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
