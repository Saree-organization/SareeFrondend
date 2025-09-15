import React from 'react';
import '../../css/privacyPolicy.css';
import banner from "../../assets/images/banner.jpg";
function PrivacyPolicy() {
  return (
    <>
      <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-text">
          <h1>Privacy Policy</h1>
          <p>Learn how we protect your personal information and ensure a secure shopping experience</p>
        </div>
      </div>

      <div className="privacy-policy-page">
        <h1>Privacy Policy</h1>

        <p>
          At Chanderi Saree Elegant, we respect your privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website
          or make a purchase. By using our website, you agree to the practices described below.
        </p>

        <section>
          <h2>Information We Collect</h2>
          <p>
            We collect personal information that you provide to us voluntarily when placing an order, signing up for newsletters,
            or contacting our customer support. This includes your name, email address, phone number, shipping address,
            and payment details. We may also collect non-personal information such as browser type, IP address, and website usage
            data to improve your experience.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>
            Your information is used to process and deliver your orders, provide customer support, communicate updates or promotions,
            and enhance your shopping experience. We do not sell or share your personal information with third-party marketers.
            Payment details are securely handled through trusted payment gateways.
          </p>
        </section>

        <section>
          <h2>Cookies and Tracking</h2>
          <p>
            Our website uses cookies and similar technologies to analyze website traffic, remember your preferences, and improve
            website functionality. Cookies help us provide a better and personalized experience for our users. You can choose
            to disable cookies in your browser, but some features may not function properly.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to safeguard your personal information.
            All data is stored securely and accessible only to authorized personnel. Despite these measures, no
            method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to others. Information may be shared with
            trusted service providers involved in order fulfillment, payment processing, or website maintenance,
            strictly under confidentiality agreements.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or request deletion of your personal information. You can also
            opt-out of marketing communications at any time by following the unsubscribe instructions in emails
            or contacting our support team.
          </p>
        </section>

        <p>
          By using Chanderi Saree Elegant, you consent to this Privacy Policy. We may update this policy from time
          to time to reflect changes in our practices or applicable laws. We encourage you to review this page
          periodically for the latest information on how we protect your privacy.
        </p>
      </div>
    </>
  );
}

export default PrivacyPolicy;
