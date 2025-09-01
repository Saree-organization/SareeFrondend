
import Slide from "../components/Slide";
import "../css/home.css";

// import all data
import { newArrivals, collections, offers, highestSales, testimonials, video } from "../data/homeData";

function Home() {
  return (
    <>
      <Slide />
      <div className="home">

        {/* NEW ARRIVALS */}
        <div className="sec sec-1">
          <h2 className="heading">NEW ARRIVALS - SAREES</h2>
          <div className="images">
            {newArrivals.map((item, i) => (
              <div key={i}>
                <img src={item.img} alt="" />
                <div className="about-img">{item.desc}</div>
              </div>
            ))}
          </div>
          <button className="more-btn">View All...</button>
        </div>




        <div className="sec sec-video">
          <h2 className="heading">VIDEO SHOWCASE</h2>
          <div className="videos">
            {video.map((item, i) => (
              <div key={i} className="video-card">
                <video src={item.video} autoPlay muted loop className="video-player" />
                <div className="about-video">
                  <div>{item.name}</div>
                  <div className="price">
                    <div className="sales-price"> ₹{item.price}</div>
                    <div className="after-discount">{item.priceAfterDiscount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHOP BY COLLECTION */}
        <div className="sec sec-2">
          <h2 className="heading">SHOP BY COLLECTION</h2>
          <div className="images">
            {collections.map((item, i) => (
              <div key={i}>
                <img src={item.img} alt="" />
                <div className="about-img">{item.desc}</div>
              </div>
            ))}
          </div>
          <button className="more-btn">View All...</button>
        </div>

        {/* EXCLUSIVE OFFERS */}
        <div className="sec sec-3">
          <h2 className="heading">EXCLUSIVE OFFERS FOR YOU</h2>
          <div className="images">
            {offers.map((item, i) => (
              <div key={i}>
                <img src={item.img} alt="" />
                <div className="about-img">{item.desc}</div>
              </div>
            ))}
          </div>
          <button className="more-btn">View All...</button>
        </div>

        {/* HIGHEST SALES */}
        <div className="sec sec-4">
          <h2 className="heading">HIGHEST SALES</h2>
          <div className="images">
            {highestSales.map((item, i) => (
              <div key={i}>
                <img src={item.img} alt="" />
                <div className="about-img">{item.desc}</div>
              </div>
            ))}
          </div>
          <button className="more-btn">View All...</button>
        </div>

        {/* TESTIMONIALS */}
        <div className="sec sec-5">
          <h2 className="heading">CUSTOMER TESTIMONIALS</h2>
          <div className="images">
            {testimonials.map((item, i) => (
              <div key={i}>
                <img src={item.img} alt="" />
                <div className="about-img">
                  <p>{item.text}</p>
                  <div className="customer-name">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="more-btn">View All...</button>
        </div>

      </div>
    </>
  );
}

export default Home;
