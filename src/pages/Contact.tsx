import { useState } from "react";
import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In production with Netlify, the form would be handled by Netlify Forms.
    // For this React SPA, we simulate submission.
    setSubmitted(true);
  };

  return (
    <BlogLayout>
      <SEOHead title="Contact" description="Get in touch." path="/contact" />
      <h1 className="text-3xl font-heading font-bold mb-4">Contact</h1>
      <p className="text-muted-foreground text-sm mb-12">
        Questions, feedback, or collaboration inquiries.
      </p>
      {submitted ? (
        <p className="text-accent text-sm">Message received. Thank you.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8" data-netlify="true" name="contact">
          <div>
            <label htmlFor="name" className="block text-sm text-muted-foreground mb-2">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              className="w-full bg-transparent border-b border-border pb-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={255}
              className="w-full bg-transparent border-b border-border pb-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-muted-foreground mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={1000}
              rows={5}
              className="w-full bg-transparent border-b border-border pb-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            Send
          </button>
        </form>
      )}
    </BlogLayout>
  );
};

export default Contact;
