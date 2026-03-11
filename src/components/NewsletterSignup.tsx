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
    <section className="border-t border-border pt-12 mt-20">
      <h2 className="font-heading font-semibold text-lg">Newsletter</h2>
      <p className="text-sm text-muted-foreground mt-2 mb-6">
        Occasional essays on systems, craft, and engineering culture. No spam.
      </p>
      {submitted ? (
        <p className="text-sm text-accent">Thank you. You'll hear from us.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-transparent border-b border-border pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-accent transition-colors pb-2"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
};

export default NewsletterSignup;
