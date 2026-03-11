import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <BlogLayout>
      <SEOHead title="Contact" description="Get in touch." path="/contact" />
      <div className="pt-12 animate-in-up">
        <div className="accent-line mb-8" />
        <h1 className="text-3xl font-heading font-bold mb-4 text-foreground">Contact</h1>
        <p className="text-muted-foreground text-sm mb-12 max-w-md">
          Questions, feedback, or collaboration inquiries. I'll get back to you.
        </p>
        {submitted ? (
          <div className="newsletter-section">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-accent">
                <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-foreground">Message received. Thank you.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10" data-netlify="true" name="contact">
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Name</label>
              <input id="name" name="name" type="text" required maxLength={100} className="input-glow w-full" />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Email</label>
              <input id="email" name="email" type="email" required maxLength={255} className="input-glow w-full" />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Message</label>
              <textarea id="message" name="message" required maxLength={1000} rows={5} className="input-glow w-full resize-none" />
            </div>
            <button type="submit" className="text-sm font-mono text-foreground hover:text-accent transition-all duration-200">
              Send message →
            </button>
          </form>
        )}
      </div>
    </BlogLayout>
  );
};

export default Contact;
