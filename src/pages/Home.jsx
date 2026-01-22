import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Slide from "../components/Slide";
import API from "../api/API";
import "../css/home.css";

/* ---------- Reusable Hover Image ---------- */
function HoverImage({ images = [], alt }) {
  const [hovered, setHovered] = useState(false);

  const imgSrc =
    hovered && images.length > 1
      ? images[1]
      : images[0] || "/fallback.jpg";

  return (
    <img
      src={imgSrc}
      alt={alt}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}

/* ---------- Reusable Image Card ---------- */
function ImageCard({ item, onClick, title }) {
  const images = item?.images || item?.variants?.[0]?.images || [];

  return (
    <div className="img-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <HoverImage images={images} alt={title} />
      <div className="img-text">{title}</div>
    </div>
  );
}

/* ---------- Home Component ---------- */
export default function Home() {
  const navTo = useNavigate();

  const [data, setData] = useState({
    newArrivals: [],
    video: [],
    offers: [],
    highestSales: [],
    color: [],
  });

  /* ---------- Navigation Helpers ---------- */
  const goAllSarees = () => navTo("/all-saree");
  const goSaree = (sareeId) => navTo(`/sarees/${sareeId}`);
  const goVariant = (sareeId, variantId) =>
    navTo(`/sarees/${sareeId}/${variantId}`);

  /* ---------- API Fetch ---------- */
  const fetchData = async () => {
    try {
      const [
        newArrivals,
        video,
        offers,
        highestSales,
        color,
      ] = await Promise.all([
        API.get("/sarees/latestSarees"),
        API.get("/sarees/byVideo"),
        API.get("/sarees/byDiscount"),
        API.get("/sarees/highestSales"),
        API.get("/sarees/byColor"),
      ]);

      setData({
        newArrivals: newArrivals.data,
        video: video.data,
        offers: offers.data,
        highestSales: highestSales.data,
        color: color.data,
      });
    } catch (err) {
      console.error("Home page API error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Slide />

      <div className="home">
        {/* ---------- NEW ARRIVALS ---------- */}
        <section className="sec">
          <h2 className="section-title">✨ New Arrivals</h2>
          <p className="section-subtitle">
            Discover our latest collection of sarees
          </p>

          <div className="grid-images">
            {data.newArrivals.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                title={item.category || item.sareeDesign}
                onClick={() => goSaree(item.id)}
              />
            ))}
          </div>

          <button className="more-btn" onClick={goAllSarees}>
            View All
          </button>
        </section>

        {/* ---------- VIDEO SHOWCASE ---------- */}
        <section className="sec">
          <h2 className="section-title">🎥 Video Showcase</h2>
          <p className="section-subtitle">
            Experience sarees in motion before you shop
          </p>

          <div className="videos">
            {data.video.map((item) => (
              <div
                key={item.id}
                className="video-card"
                onClick={() => goVariant(item.sareeId, item.id)}
              >
                <video
                  src={item.videos}
                  autoPlay
                  muted
                  loop
                  className="video-player"
                />
                <div className="video-text">{item.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- SHOP BY COLOR ---------- */}
        <section className="sec">
          <h2 className="section-title">🎨 Shop By Color</h2>
          <p className="section-subtitle">
            Find sarees in your favorite shades
          </p>

          <div className="grid-images">
            {data.color.map((item) => {
              const colorName = Array.isArray(item.color)
                ? item.color[0]
                : item.color;

              return (
                <ImageCard
                  key={item.id || colorName}
                  item={item}
                  title={`${colorName} Collection`}
                  onClick={() => navTo(`/color/${colorName}`)}
                />
              );
            })}
          </div>

          <button className="more-btn" onClick={goAllSarees}>
            View All
          </button>
        </section>

        {/* ---------- OFFERS ---------- */}
        <section className="sec">
          <h2 className="section-title">🔥 Exclusive Offers</h2>
          <p className="section-subtitle">
            Save big with our handpicked discounts
          </p>

          <div className="grid-images">
            {data.offers.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                title={`Up to ${item.discountPercent}% OFF`}
                onClick={() =>
                  navTo(`/discount/${item.discountPercent}`)
                }
              />
            ))}
          </div>

          <button className="more-btn" onClick={goAllSarees}>
            View All
          </button>
        </section>

        {/* ---------- BEST SELLERS ---------- */}
        <section className="sec">
          <h2 className="section-title">🏆 Best Sellers</h2>
          <p className="section-subtitle">
            Sarees loved most by our customers
          </p>

          <div className="grid-images">
            {data.highestSales.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                title={item.name}
                onClick={() => goVariant(item.sareeId, item.id)}
              />
            ))}
          </div>

          <button className="more-btn" onClick={goAllSarees}>
            View All
          </button>
        </section>
      </div>
    </>
  );
}
