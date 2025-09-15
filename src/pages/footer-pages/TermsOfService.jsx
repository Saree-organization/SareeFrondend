import React from 'react';
import '../../css/termsOfService.css';
import banner from "../../assets/images/banner.jpg";

function TermsOfService() {
  return (
    <>
      <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-text">
          <h1>Terms of Service</h1>
          <p>Read the rules, conditions, and guidelines for using our website and services</p>
        </div>
      </div>

      <div className="terms-page">
        <h1>Terms of Service</h1>

        <p>
          Welcome to Chanderi Saree Elegant. By accessing or using our website, you agree to comply with
          and be bound by these Terms of Service. Please read these terms carefully before making any
          purchases or using our services. If you do not agree with any part of these terms, please
          refrain from using our website.
        </p>

        <section>
          <h2>Use of Website</h2>
          <p>
            You may use our website only for lawful purposes and in accordance with these terms. You agree
            not to use the website in any way that could damage, disable, or impair the site, interfere
            with any other party’s use, or violate any applicable laws or regulations.
          </p>
        </section>

        <section>
          <h2>Product Information</h2>
          <p>
            We strive to provide accurate product descriptions, images, and prices. However, we do not
            guarantee that all information is error-free. Product availability and prices may change
            without notice. We are not responsible for typographical or display errors.
          </p>
        </section>

        <section>
          <h2>Ordering & Payment</h2>
          <p>
            By placing an order, you agree to provide accurate billing and shipping information. Payment
            must be completed through the available payment methods. All orders are subject to acceptance
            and availability. We reserve the right to refuse or cancel any order at our discretion.
          </p>
        </section>

        <section>
          <h2>Delivery & Exchange</h2>
          <p>
            Delivery times are estimated and may vary. Our exchange policy allows you to exchange damaged
            or defective products within 7 days of delivery. Please note that we do not offer returns for
            refunds. For more details, refer to our Delivery & Exchange Policy page.
          </p>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, and designs, is the property of
            Chanderi Saree Elegant or its licensors. Unauthorized use of our intellectual property is strictly
            prohibited.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Chanderi Saree Elegant shall not be liable for any
            direct, indirect, incidental, or consequential damages arising from the use or inability to
            use our website or products. This includes issues related to orders, delivery, or product quality.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms of Service at any time. All changes will
            be effective immediately upon posting. Continued use of the website indicates your acceptance
            of the updated terms.
          </p>
        </section>

        <p>
          By using Chanderi Saree Elegant, you acknowledge that you have read, understood, and agree to
          be bound by these Terms of Service. If you have any questions, please contact our customer
          support team for assistance.
        </p>
      </div>
    </>
  );
}

export default TermsOfService;
