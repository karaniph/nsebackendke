import BlogLayout from "@/components/BlogLayout";
import SEOHead from "@/components/SEOHead";

const TermsAndConditions = () => {
  return (
    <BlogLayout>
      <SEOHead
        title="Terms & Conditions"
        description="Terms and Conditions for using NSEinsider."
        path="/terms-and-conditions"
        schemaType="page"
        keywords={["NSEinsider terms", "website terms", "NSE market content disclaimer"]}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms-and-conditions" }
        ]}
      />
      <div className="container py-12 md:py-16 max-w-3xl animate-in-up">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Effective date: March 11, 2026</p>

        <div className="prose-blog">
          <p>
            These Terms & Conditions govern your access to and use of <strong>nseinsider.co.ke</strong>. By using the
            site, you agree to these terms.
          </p>

          <h2>1. Informational Use Only</h2>
          <p>
            All content is provided for informational and educational purposes only. Nothing on this site constitutes
            financial, legal, tax, or investment advice.
          </p>

          <h2>2. No Investment Recommendation</h2>
          <p>
            We do not provide personalized investment recommendations. You are responsible for your own decisions and
            should consult licensed professionals where appropriate.
          </p>

          <h2>3. Accuracy and Availability</h2>
          <p>
            We aim for accuracy, but we do not warrant that all content is complete, current, or error-free.
            Information may change without notice.
          </p>

          <h2>4. User Conduct</h2>
          <ul>
            <li>You agree not to misuse, disrupt, or attempt unauthorized access to the website.</li>
            <li>You agree not to submit unlawful, harmful, or abusive content through forms or communication channels.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <p>
            Site content, branding, and original materials are owned by NSEinsider or licensed to us. You may not
            reproduce or redistribute content for commercial use without written permission.
          </p>

          <h2>6. Third-Party Links and Services</h2>
          <p>
            The site may include links to third-party websites or services. We are not responsible for their content,
            policies, or availability.
          </p>

          <h2>7. Advertising and Sponsored Content</h2>
          <p>
            We may monetize the site through ads, sponsorships, affiliate links, or partnerships. Sponsored content,
            where applicable, will be identified as required by law and platform rules.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, NSEinsider is not liable for losses or damages arising from your
            use of the site or reliance on published content.
          </p>

          <h2>9. Indemnity</h2>
          <p>
            You agree to indemnify and hold NSEinsider harmless from claims arising from your misuse of the website or
            violation of these terms.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the site after updates means you accept the
            revised terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms are governed by applicable laws of Kenya, without prejudice to mandatory consumer protections
            in your jurisdiction.
          </p>

          <h2>12. Contact</h2>
          <p>
            For legal or terms-related enquiries, contact{" "}
            <a href="mailto:nseinsider@protonmail.com">nseinsider@protonmail.com</a>.
          </p>
        </div>
      </div>
    </BlogLayout>
  );
};

export default TermsAndConditions;

