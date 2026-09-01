import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, Sparkles, Check, Loader2 } from 'lucide-react';
import { BuyerLayout } from '../../components/layout/BuyerLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AIBadge, AIStatus } from '../../components/ai/AIComponents';
import { Badge } from '../../components/ui/Badge';
import { useApp } from '../../contexts/AppContext';
import { aiBuyerService } from '../../services/productService';
import { getProductById, DEMO_QUERY } from '../../data/mockData';
import type { ChatMessage, BuyerRequirements } from '../../types';

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

export function AIBuyerPage() {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [localRequirements, setLocalRequirements] = useState<BuyerRequirements | null>(null);
  const [localProductIds, setLocalProductIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setRequirements, setRecommendedProductIds } = useApp();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, showRecommendations]);

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

    try {
      for (const step of ['Understanding your requirements...', 'Searching AgentCart...']) {
        setLocalMessages((prev) => [...prev, {
          id: `status-${Date.now()}-${step}`,
          role: 'assistant',
          content: step,
          timestamp: new Date(),
          type: 'status',
        }]);
        await new Promise((r) => setTimeout(r, 600));
        setLocalMessages((prev) => prev.filter((m) => m.type !== 'status' || m.content !== step));
      }

      const result = await aiBuyerService.processQuery(userMessage.content);

      for (const msg of result.messages) {
        if (msg.type === 'status') continue;
        setLocalMessages((prev) => [...prev, msg]);
        if (msg.type === 'requirements' && msg.requirements) {
          setLocalRequirements(msg.requirements);
          setRequirements(msg.requirements);
        }
        await new Promise((r) => setTimeout(r, 400));
      }

      setLocalProductIds(result.productIds);
      setRecommendedProductIds(result.productIds);
      setShowRecommendations(true);
    } finally {
      setProcessing(false);
    }
  };

  const recommendedProducts = localProductIds.map((id) => getProductById(id)).filter(Boolean);

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

          {showRecommendations && recommendedProducts.length > 0 && (
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Recommendations</h3>
                <AIBadge>{recommendedProducts.length} matches</AIBadge>
              </div>
              <div className="space-y-4">
                {recommendedProducts.map((product) => product && (
                  <Card key={product.id} hover padding="sm" className="overflow-hidden">
                    <div className="flex gap-4">
                      <Link to={`/product/${product.id}`} className="shrink-0">
                        <img src={product.image} alt={product.name} className="h-24 w-20 rounded-lg object-cover" />
                      </Link>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          {product.aiMatchScore && <Badge variant="ai">{product.aiMatchScore}% match</Badge>}
                        </div>
                        <Link to={`/product/${product.id}`}>
                          <h4 className="font-medium hover:text-violet-ai">{product.name}</h4>
                        </Link>
                        <p className="text-lg font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                        {product.aiReasons && (
                          <ul className="mt-2 space-y-0.5">
                            {product.aiReasons.slice(0, 2).map((r) => (
                              <li key={r} className="flex items-center gap-1 text-xs text-muted dark:text-muted-light">
                                <Check className="h-3 w-3 text-success" /> {r}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
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
