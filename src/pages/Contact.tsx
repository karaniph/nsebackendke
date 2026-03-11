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
      <SEOHead title="Contact" description="Get in touch with NSEinsider." path="/contact" />
      <div className="container py-12 md:py-16 max-w-2xl animate-in-up">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Get in Touch</h1>
        <p className="text-muted-foreground mb-10">
          Have feedback, a partnership enquiry, or a stock you'd like us to cover? We'd love to hear from you.
        </p>
        {submitted ? (
          <div className="content-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-heading font-semibold text-foreground">Message sent</h2>
            <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" data-netlify="true" name="contact">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input id="name" name="name" type="text" required maxLength={100} className="input-brand" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input id="email" name="email" type="email" required maxLength={255} className="input-brand" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <input id="subject" name="subject" type="text" maxLength={200} className="input-brand" placeholder="What's this about?" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea id="message" name="message" required maxLength={2000} rows={5} className="input-brand resize-none" placeholder="Your message..." />
            </div>
            <button type="submit" className="btn-brand">Send Message →</button>
          </form>
        )}
      </div>
    </BlogLayout>
  );
};

export default Contact;
