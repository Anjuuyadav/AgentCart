import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, Sparkles, Check, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="rounded-xl border border-violet-ai/20 bg-violet-ai-muted/30 p-4 dark:bg-violet-ai/10">
      <div className="mb-3 flex items-center gap-2">
        <Check className="h-4 w-4 text-success" />
        <span className="text-sm font-semibold text-success">Requirement understood</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {requirements.occasion && (
          <div>
            <p className="text-xs text-muted dark:text-muted-light">Occasion</p>
            <p className="font-medium">{requirements.occasion}</p>
          </div>
        )}
        {requirements.budget && (
          <div>
            <p className="text-xs text-muted dark:text-muted-light">Budget</p>
            <p className="font-medium">₹{requirements.budget.toLocaleString('en-IN')}</p>
          </div>
        )}
        {requirements.size && (
          <div>
            <p className="text-xs text-muted dark:text-muted-light">Size</p>
            <p className="font-medium">{requirements.size}</p>
          </div>
        )}
        {requirements.color && (
          <div>
            <p className="text-xs text-muted dark:text-muted-light">Color</p>
            <p className="font-medium">{requirements.color}</p>
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
      <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-light animate-pulse-soft">
        <Loader2 className="h-4 w-4 animate-spin text-violet-ai" />
        {message.content}
      </div>
    );
  }

  if (message.type === 'recommendations') {
    return (
      <div className="animate-slide-up">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-ai" />
          <span className="font-medium text-violet-ai">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal' : 'border border-border bg-surface dark:border-border-dark dark:bg-surface-dark'}`}>
        {message.role === 'assistant' && (
          <div className="mb-1 flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-violet-ai" />
            <span className="text-xs font-medium text-violet-ai">AI Buyer</span>
          </div>
        )}
        <p className="text-sm">{message.content}</p>
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
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-ai/10">
            <Bot className="h-5 w-5 text-violet-ai" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Buyer</h1>
            <p className="text-sm text-muted dark:text-muted-light">Describe what you're looking for in natural language</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card padding="none" className="flex h-[600px] flex-col overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {localMessages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Sparkles className="mb-4 h-10 w-10 text-violet-ai/50" />
                  <p className="mb-2 font-medium">How can I help you shop today?</p>
                  <p className="mb-6 max-w-sm text-sm text-muted dark:text-muted-light">
                    Try: "I need a wine-colored wedding dress under ₹5,000, size M."
                  </p>
                  <button
                    onClick={() => setInput(DEMO_QUERY)}
                    className="rounded-lg border border-violet-ai/30 px-4 py-2 text-sm text-violet-ai hover:bg-violet-ai/5"
                  >
                    Use demo query
                  </button>
                </div>
              )}
              {localMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {processing && <AIStatus status="thinking" label="AI Buyer is analyzing your request..." />}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border p-4 dark:border-border-dark">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you're looking for..."
                  className="flex-1 rounded-xl border border-border bg-ivory px-4 py-3 text-sm focus:border-violet-ai focus:outline-none focus:ring-2 focus:ring-violet-ai/20 dark:border-border-dark dark:bg-charcoal"
                  disabled={processing}
                />
                <Button type="submit" variant="ai" disabled={processing || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {localRequirements && (
            <Card className="mb-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted dark:text-muted-light">Extracted Requirements</h3>
              <RequirementsDisplay requirements={localRequirements} />
            </Card>
          )}

          {showRecommendations && (
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Recommendations</h3>
                <AIBadge>{localProductIds.length} matches</AIBadge>
              </div>
              {recommendedList.length === 0 ? (
                <Card>
                  <p className="text-sm text-muted">No recommendations yet.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recommendedList.map(({ id, state }) => {
                    if (!state) return null;
                    if (state.loading) {
                      return (
                        <Card key={id} padding="sm" className="overflow-hidden">
                          <div className="flex gap-4 animate-pulse">
                            <div className="h-24 w-20 rounded-lg bg-border/50 dark:bg-border-dark/50" />
                            <div className="flex-1 space-y-2 py-1">
                              <div className="h-4 w-3/4 rounded bg-border/60 dark:bg-border-dark/60" />
                              <div className="h-5 w-1/3 rounded bg-border/60 dark:bg-border-dark/60" />
                              <div className="h-3 w-1/2 rounded bg-border/40 dark:bg-border-dark/40" />
                            </div>
                          </div>
                        </Card>
                      );
                    }
                    if (state.error || !state.product) {
                      return (
                        <Card key={id} padding="sm" className="overflow-hidden">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-4 w-4 text-muted shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Product unavailable</p>
                              <p className="text-xs text-muted">
                                {state.error || 'This recommendation could not be loaded.'}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                    const product = state.product;
                    return (
                      <Card key={id} hover padding="sm" className="overflow-hidden">
                        <div className="flex gap-4">
                          <Link to={`/product/${product.id}`} className="shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-24 w-20 rounded-lg object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                              }}
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                              {state.aiMatchScore && <Badge variant="ai">{state.aiMatchScore}% match</Badge>}
                            </div>
                            <Link to={`/product/${product.id}`}>
                              <h4 className="font-medium hover:text-violet-ai truncate">{product.name}</h4>
                            </Link>
                            <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
                            {state.aiReasons && state.aiReasons.length > 0 && (
                              <ul className="mt-2 space-y-0.5">
                                {state.aiReasons.slice(0, 2).map((r, idx) => (
                                  <li key={idx} className="flex items-center gap-1 text-xs text-muted dark:text-muted-light">
                                    <Check className="h-3 w-3 text-success shrink-0" />
                                    <span className="truncate">{r}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!showRecommendations && !localRequirements && (
            <Card>
              <h3 className="mb-2 font-semibold">Purchase Policy</h3>
              <p className="text-sm text-muted dark:text-muted-light">
                Your AI Buyer follows your purchase policies including budget limits, size preferences, and authorization rules.
              </p>
              <Link to="/buyer/preferences" className="mt-3 inline-block text-sm font-medium text-violet-ai hover:underline">
                Configure preferences →
              </Link>
            </Card>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
