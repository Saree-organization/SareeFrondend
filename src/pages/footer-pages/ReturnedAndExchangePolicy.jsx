import React from 'react';
import '../../css/returnedAndExchangePolicy.css';
import banner from "../../assets/images/banner.jpg";
function ReturnedAndExchangePolicy() {
  return (
    <>
    <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
  <div className="banner-overlay"></div>
  <div className="banner-text">
    <h1>Return & Exchange Policy</h1>
    <p>Understand our exchange process, order cancellations, and eligibility criteria for products</p>
  </div>
</div>

    <div className="exchange-policy-page">
      <h1>Return & Exchange Policy</h1>

      <p>
        At Chanderi Saree Elegant, we aim to provide you with the finest quality sarees and 
        a seamless shopping experience. To ensure clarity and fairness, we have established 
        the following exchange policy. Please read it carefully before making a purchase.
      </p>

      <section>
        <h2>Exchange Only Policy</h2>
        <p>
          We offer an <strong>exchange-only policy</strong> for all Chanderi sarees. Returns for a refund 
          are not accepted. If your saree arrives damaged, defective, or does not meet the product description, 
          you may request an exchange. Our team will guide you through the process to replace the product 
          efficiently.
        </p>
      </section>

      <section>
        <h2>Eligibility for Exchange</h2>
        <p>
          Exchanges are accepted within 7 days of receiving your order. To be eligible, the saree must be unused, 
          in its original packaging, and accompanied by the original invoice. Any product that has been washed, 
          altered, or shows signs of wear cannot be exchanged. Please ensure that you inspect the saree immediately 
          upon delivery.
        </p>
      </section>

      <section>
        <h2>Order Cancellation</h2>
        <p>
          You can cancel your order <strong>before it has been dispatched</strong>. Once the saree is shipped, 
          cancellation is not possible. To cancel, contact our customer service with your order details as soon 
          as possible. Refunds for cancelled orders will be processed promptly using the original payment method.
        </p>
      </section>

      <section>
        <h2>How to Request an Exchange</h2>
        <p>
          To initiate an exchange, please contact our customer service team within 7 days of delivery. Provide 
          your order number, details of the issue, and preference for the replacement saree. We will verify 
          the request and provide instructions for returning the original product. Once we receive the saree, 
          the exchange process will be completed promptly.
        </p>
      </section>

      <section>
        <h2>Important Guidelines</h2>
        <ul>
          <li>Exchanges are allowed only for products damaged, defective, or incorrect.</li>
          <li>The saree must be unused and in original packaging.</li>
          <li>No cash refunds or returns are available.</li>
          <li>Orders can be cancelled only before dispatch.</li>
          <li>Contact our customer support for any queries regarding exchanges or cancellations.</li>
        </ul>
      </section>

      <p>
        We value your trust and satisfaction. Our exchange policy ensures that you receive authentic, high-quality 
        Chanderi sarees while maintaining fairness and transparency. By shopping with us, you agree to adhere to 
        these policies.
      </p>
    </div>
    </>
  );
}

export default ReturnedAndExchangePolicy;
