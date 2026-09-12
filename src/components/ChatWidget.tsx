import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_BASE = import.meta.env.VITE_CHAT_API_BASE || "https://nse-bot-backend.karanidevops.workers.dev";

interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

interface SubscriptionStatus {
  active: boolean;
  email?: string;
  subscription?: {
    id: number;
    status: string;
    currentPeriodEnd: string;
    messagesUsed: number;
    messagesRemaining: number;
    messageCap: number;
  };
  message?: string;
}

interface ChatProfile {
  risk_level: "low" | "moderate" | "high" | null;
  horizon_months: number | null;
  last_budget_kes: number | null;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [chatToken, setChatToken] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("nse_chat_token");
    if (stored) {
      setChatToken(stored);
    }
  }, []);

  // Check subscription status when token changes
  const checkSubscription = useCallback(async () => {
    if (!chatToken) return;

    try {
      // Use Pesapal status endpoint (same DB, same subscription check)
      const res = await fetch(`${API_BASE}/payments/pesapal/status?chat_token=${encodeURIComponent(chatToken)}`);
      const data = await res.json();
      setSubscription(data);
      setShowPaywall(!data.active);
    } catch (error) {
      console.error("Failed to check subscription", error);
      setShowPaywall(true);
    }
  }, [chatToken]);

  // Load chat history
  const loadHistory = useCallback(async () => {
    if (!chatToken || !subscription?.active) return;

    try {
      const res = await fetch(`${API_BASE}/chat/history?chat_token=${encodeURIComponent(chatToken)}&limit=50`);
      const data = await res.json();
      if (data.ok) {
        setMessages(data.messages || []);
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    }
  }, [chatToken, subscription?.active]);

  useEffect(() => {
    if (isOpen && chatToken) {
      checkSubscription();
    }
  }, [isOpen, chatToken, checkSubscription]);

  useEffect(() => {
    if (isOpen && subscription?.active) {
      loadHistory();
    }
  }, [isOpen, subscription?.active, loadHistory]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !showPaywall && subscription?.active) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, showPaywall, subscription?.active]);

  // Handle payment initialization
  const handlePayment = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const res = await fetch(`${API_BASE}/payments/pesapal/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        checkout_url?: string;
        chat_token?: string;
        error?: string;
      };

      if (res.ok && data.ok && data.checkout_url) {
        // Store token for later use
        if (data.chat_token) {
          localStorage.setItem("nse_chat_token", data.chat_token);
          setChatToken(data.chat_token);
        }
        // Redirect to Pesapal checkout
        window.location.href = data.checkout_url;
      } else {
        const message = data.error || `Payment service returned ${res.status}. Please try again.`;
        console.error("Payment init failed", { status: res.status, data });
        setPaymentError(message);
      }
    } catch (error) {
      console.error("Payment error", error);
      setPaymentError("Could not connect to the payment service. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isLoading || !chatToken) return;

    setInput("");
    setIsLoading(true);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_token: chatToken, message }),
      });

      const data = await res.json();

      if (data.ok) {
        // Replace temp message with real response
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: Date.now(), role: "user", content: message, created_at: new Date().toISOString() },
          { id: Date.now() + 1, role: "assistant", content: data.response, created_at: new Date().toISOString() },
        ]);
        setProfile(data.profile);
        if (subscription?.subscription) {
          setSubscription({
            ...subscription,
            subscription: {
              ...subscription.subscription,
              messagesRemaining: data.messages_remaining,
              messagesUsed: subscription.subscription.messagesUsed + 1,
            },
          });
        }
      } else if (data.code === "PAYMENT_REQUIRED") {
        setShowPaywall(true);
        setSubscription({ active: false, message: data.error });
      } else {
        console.error("Chat error", data);
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: "assistant", content: `Error: ${data.error || "Something went wrong"}`, created_at: new Date().toISOString() },
        ]);
      }
    } catch (error) {
      console.error("Send error", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "assistant", content: "Failed to send message. Please try again.", created_at: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Paywall UI
  if (showPaywall || !subscription?.active) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-md">
          <div className="border-b bg-gradient-to-br from-primary/15 via-primary/5 to-background px-6 pb-6 pt-8">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          <SheetHeader className="space-y-2 text-left">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              NSEinsider Chat Pro
            </SheetTitle>
            <SheetDescription>
              Research Kenyan shares, filings, risk and portfolio decisions with a focused AI advisor.
            </SheetDescription>
          </SheetHeader>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Advisor access</p>
                  <p className="mt-1 text-xs text-muted-foreground">One payment unlocks 30 days.</p>
                </div>
                <Badge className="rounded-full px-3 py-1">KES 500</Badge>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Up to 100 messages, use them anytime over 30 days
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Personalized portfolio suggestions
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Risk profile & time horizon tracking
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Powered by real NSE filing data
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold">
                Email for your advisor access
              </label>
              <p className="text-xs leading-5 text-muted-foreground">We use this to link your payment and chat access.</p>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (paymentError) setPaymentError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePayment()}
              />
            </div>

            <Button
              className="h-12 w-full rounded-xl text-sm font-semibold shadow-sm"
              onClick={handlePayment}
              disabled={!email.trim() || paymentLoading}
            >
              {paymentLoading ? "Preparing secure checkout…" : "Continue to secure payment →"}
            </Button>

            {paymentError && (
              <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-semibold">We couldn’t start checkout</p>
                <p className="mt-1 text-xs leading-5">{paymentError}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 rounded-xl bg-muted/60 px-3 py-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Secure payment</span>
              <span className="rounded bg-background px-2 py-1 font-semibold shadow-sm">M-Pesa</span>
              <span className="rounded bg-background px-2 py-1 font-semibold shadow-sm">Card</span>
            </div>

            <Separator />

            <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Disclaimer:</strong> This tool provides educational information only, not licensed financial advice. 
                Always consult a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Chat UI
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg">
        <SheetHeader className="px-4 pt-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Investment Advisor
            </SheetTitle>
            {subscription?.subscription && (
              <Badge variant="outline" className="text-xs">
                {subscription.subscription.messagesRemaining} msgs left
              </Badge>
            )}
          </div>
          {subscription?.subscription?.currentPeriodEnd && (
            <p className="text-xs text-muted-foreground mt-1">
              Messages roll over — use them any time before your access renews on{" "}
              {new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
              .
            </p>
          )}
          {profile && (profile.risk_level || profile.horizon_months) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {profile.risk_level && <span>Risk: {profile.risk_level}</span>}
              {profile.horizon_months && <span>• Horizon: {profile.horizon_months}mo</span>}
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-4">
            {messages.length === 0 && (
              <div className="py-8 text-center">
                <div className="rounded-2xl border bg-muted/40 px-5 py-6 text-muted-foreground">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-60">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p className="text-sm font-semibold text-foreground">What would you like to research?</p>
                  <p className="mt-1 text-xs leading-5">Try: “Compare Equity and KCB for a three-year investment horizon.”</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-75">●</span>
                    <span className="animate-bounce delay-150">●</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t px-4 py-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about NSE investments..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Educational only — not financial advice.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Floating chat button component
export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Check for payment return on mount
  useEffect(() => {
    const openAdvisor = () => setIsOpen(true);
    window.addEventListener("nseinsider:open-advisor", openAdvisor);
    return () => window.removeEventListener("nseinsider:open-advisor", openAdvisor);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentOutcome = url.searchParams.get("payment");
    // success: the Worker already confirmed and activated the subscription
    //   before redirecting here, so the paywall's own status check (in
    //   ChatWidget) will find it active and open the chat.
    // pending: M-Pesa/card confirmation was still in flight when the
    //   customer was redirected back. Opening the widget lets it re-check
    //   status; Pesapal's webhook, if delivered, activates it shortly after.
    // failed: opening the widget re-shows the paywall so the customer can
    //   retry immediately instead of wondering what happened.
    if (paymentOutcome === "success" || paymentOutcome === "pending" || paymentOutcome === "failed") {
      // Clean up URL
      url.searchParams.delete("payment");
      url.searchParams.delete("reference");
      window.history.replaceState({}, "", url.toString());
      // Open chat/paywall
      setTimeout(() => setIsOpen(true), 500);
    }
  }, []);

  return (
    <>
      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg ring-1 ring-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl"
          aria-label="Open NSEinsider AI Investment Advisor"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Ask the NSE Advisor</span>
        </button>
        <span className="rounded-full bg-background/95 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm ring-1 ring-border">
          AI guidance for Kenya's market · KES 500/month
        </span>
      </div>

      <ChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default ChatButton;
