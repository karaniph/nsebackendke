import { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="newsletter-section">
      <div className="relative z-10">
        <div className="accent-line mb-6" />
        <h2 className="font-heading font-semibold text-lg text-foreground">Stay in the loop</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-8 max-w-md">
          Occasional essays on systems, craft, and engineering culture. No spam, no fluff — just substance.
        </p>
        {submitted ? (
          <div className="flex items-center gap-2 text-sm text-accent">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent">
              <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Thank you. You'll hear from us.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="input-glow flex-1"
            />
            <button
              type="submit"
              className="text-sm font-mono text-foreground hover:text-accent transition-all duration-200 pb-3 whitespace-nowrap"
            >
              Subscribe →
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
