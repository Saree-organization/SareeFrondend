import React from 'react';
import '../../css/aboutUs.css';
import banner from "../../assets/images/banner.jpg";

function AboutUs() {
  return (
    <div className="about-us-page">
      {/* Banner Section */}
      <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="banner-overlay"></div>
        <div className="banner-text">
          <h1>Chanderi Saree Elegant</h1>
          <p>Embrace the timeless beauty of Indian tradition</p>
        </div>
      </div>

      {/* About Content */}
      <div className="about-content">
        <section>
          <h2>Our Heritage</h2>
          <p>
            <span className="highlight">Chanderi sarees</span> are a timeless symbol of elegance 
            and tradition in India. Originating from the town of Chanderi in Madhya Pradesh, 
            these sarees are known for their <span className="highlight">lightweight texture</span>, 
            fine weaving, and rich cultural heritage.
          </p>
        </section>

        <section>
          <h2>Artisan Craftsmanship</h2>
          <p>
            Each saree is handcrafted by skilled artisans using techniques passed down 
            through generations. The intricate borders, floral and geometric patterns, 
            and luxurious fabrics reflect India’s rich textile heritage.
          </p>
        </section>

        <section>
          <h2>Versatile Elegance</h2>
          <p>
            Perfect for weddings, festivals, or formal gatherings, Chanderi sarees drape beautifully, 
            combining <span className="highlight">comfort</span> and <span className="highlight">style</span>. 
            Modern designs meet traditional charm, making them loved by women of all ages.
          </p>
        </section>

        <section>
          <h2>Our Commitment</h2>
          <p>
            By choosing our Chanderi sarees, you support skilled artisans and embrace a 
            rich heritage. Our curated collection offers a variety of colors, patterns, 
            and fabrics, giving you the perfect saree for every occasion.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
