import React from 'react';
import '../../css/deliveryPolicy.css';
import banner from "../../assets/images/banner.jpg";

function DeliveryPolicy() {
  return (
    <>
    <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
  <div className="banner-overlay"></div>
  <div className="banner-text">
    <h1>Delivery & Policy</h1>
    <p>Know about our delivery timelines, order cancellations, and exchange policies</p>
  </div>
</div>

      <div className="delivery-policy-page">
        <h1>Delivery & Exchange Policy</h1>

        <p>
          At Chanderi Saree Elegant, we strive to ensure that your shopping experience is
          smooth, reliable, and satisfying. Our delivery and exchange policies are designed
          to provide clarity and convenience to all our valued customers. Please read the
          following details carefully before making a purchase.
        </p>

        <section>
          <h2>Delivery Process</h2>
          <p>
            All orders placed on our website are processed within 24-48 hours. Once your order
            is confirmed, our team carefully packages your Chanderi saree to ensure it reaches
            you in perfect condition. We partner with trusted courier services to deliver your
            order safely and on time. The estimated delivery time depends on your location and
            is usually between 3-7 business days within India.
          </p>
          <p>
            You will receive a tracking number via email or SMS once your order is dispatched,
            allowing you to monitor the status of your delivery. Please ensure that the shipping
            address provided is accurate to avoid delays or misdelivery.
          </p>
        </section>

        <section>
          <h2>Order Cancellation</h2>
          <p>
            You can cancel your order any time <strong>before it is dispatched</strong>.
            Once the order is shipped, it cannot be cancelled as it is already in transit.
            To request cancellation, please contact our customer service team with your
            order details. Refunds for cancelled orders will be processed promptly using
            the original mode of payment.
          </p>
        </section>

        <section>
          <h2>Exchange Policy</h2>
          <p>
            We offer an <strong>exchange-only policy</strong> for Chanderi sarees. If the product
            you receive is damaged, defective, or not as described, you may request an exchange
            within 7 days of delivery. To initiate an exchange, please contact our support team
            with your order details and the reason for exchange.
          </p>
          <p>
            Please note that we do not accept returns for refunds. Exchanges are only possible
            for the same product in the same value or for another product of equivalent value.
            Ensure that the saree is unused, in its original packaging, and accompanied by
            the invoice for a smooth exchange process.
          </p>
        </section>

        <section>
          <h2>Important Guidelines</h2>
          <ul>
            <li>Orders can be cancelled only before dispatch.</li>
            <li>All exchanges must be requested within 7 days of delivery.</li>
            <li>The saree must be unused and in original packaging for an exchange.</li>
            <li>No returns are allowed for a refund.</li>
            <li>For any queries, our customer service team is always ready to assist you.</li>
          </ul>
        </section>

        <p>
          We value your trust and aim to make your experience with Chanderi Saree Elegant
          pleasant and hassle-free. By following these policies, we ensure that every
          customer receives authentic, high-quality products while maintaining fair and
          transparent procedures.
        </p>
      </div>
    </>
  );
}

export default DeliveryPolicy;
