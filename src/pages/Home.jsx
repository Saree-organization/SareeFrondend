import { useNavigate } from "react-router-dom";
import Slide from "../components/Slide";
import "../css/home.css";
import API from "../api/API";
import { useEffect, useState } from "react";

// Reusable ImageCard component for hover effect
function ImageCard({ item, navTo, isVariant = true }) {
  const [hovered, setHovered] = useState(false);
  const variant = isVariant ? item.variants[0] : item;
  const images = variant.images;

  return (
    <div
      className="img-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        isVariant
          ? navTo(`/sarees/${item.id}`)
          : navTo(`/sarees/${item.sareeId}/${item.id}`)
      }
      style={{ cursor: "pointer" }}
    >
      <img src={hovered && images[1] ? images[1] : images[0]} alt={item.description || item.name} />
      <div className="img-text">
        {item.category || item.name || item.sareeDesign  || ""}
      </div>
    </div>
  );
}

export default function Home() {
  const navTo = useNavigate();
  const [data, setData] = useState({
    newArrivals: [],
    video: [],
    offers: [],
    highestSales: [],
    color: []
  });

  const allSareeNav = () => navTo("all-saree");
  const sareeVariantNav = (sareeId, variantId) => navTo(`sarees/${sareeId}/${variantId}`);

  const fetchData = () => {
    API.get("/sarees/latestSarees").then(res =>
      setData(p => ({ ...p, newArrivals: res.data }))
    );
    API.get("/sarees/byVideo").then(res =>
      setData(p => ({ ...p, video: res.data }))
    );
    API.get("/sarees/byDescount").then(res =>
      setData(p => ({ ...p, offers: res.data }))
    );
    API.get("/sarees/highestSales").then(res =>
      setData(p => ({ ...p, highestSales: res.data }))
    );
    API.get("/sarees/byColor").then(res =>
      setData(p => ({ ...p, color: res.data }))
    );
  };

  useEffect(fetchData, []);

  return (
    <>
      <Slide />
      <div className="home">
        {/* NEW ARRIVALS */}
        <section className="sec">
          <h2 className="heading">New Arrivals - Sarees</h2>
          <div className="grid-images">
            {data.newArrivals.map((item) => (
              <ImageCard key={item.id} item={item} navTo={navTo} />
            ))}
          </div>
          <button className="more-btn" onClick={allSareeNav}>
            View All...
          </button>
        </section>

        {/* VIDEO */}
        <section className="sec">
          <h2 className="heading">Video Showcase</h2>
          <div className="videos">
            {data.video.map((item) => (
              <div key={item.id} className="video-card">
                <video
                  src={item.videos}
                  autoPlay
                  muted
                  loop
                  className="video-player"
                  onClick={() => sareeVariantNav(item.sareeId, item.id)}

                />
                <div
                  className="video-text"

                >
                  <div className="video-name">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* SHOP BY COLOR */}
        <section className="sec">
          <h2 className="heading">Shop By Color</h2>
          <div className="grid-images">
            {data.color.map((item, i) => {
              const colorName = Array.isArray(item.color) ? item.color[0] : item.color;

              return (
                <div
                  className="img-card"
                  key={i}
                  onClick={() => navTo(`/color/${colorName}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={item.images[0]}
                    alt={colorName}
                    onMouseEnter={(e) => { if (item.images[1]) e.currentTarget.src = item.images[1]; }}
                    onMouseLeave={(e) => { e.currentTarget.src = item.images[0]; }}
                  />
                  <div
                    className="img-text"

                  >
                    {Array.isArray(item.color) ? item.color.join(", ") : item.color} collection
                  </div>
                </div>
              );
            })}
          </div>
          <button className="more-btn" onClick={allSareeNav}>
            View All...
          </button>
        </section>



        {/* OFFERS */}
        <section className="sec">
          <h2 className="heading">Exclusive Offers For You</h2>
          <div className="grid-images">
            {data.offers.map((item) => (
              <div
                className="img-card"
                key={item.id}
                onClick={() => navTo(`/discount/${item.discountPercent}`)}

              >
                <img
                  src={item.images[0]}
                  alt=""
                  onMouseEnter={(e) => {if (item.images[1]) e.currentTarget.src = item.images[1];}}
                  onMouseLeave={(e) => {e.currentTarget.src = item.images[0];}}
                />
                <div className="img-text">
                  {item.discount} – {item.discountPercent}% OFF
                </div>
              </div>
            ))}
          </div>
          <button className="more-btn" onClick={allSareeNav}>
            View All...
          </button>
        </section>


        {/* HIGHEST SALES */}
        <section className="sec">
          <h2 className="heading">Highest Sales</h2>
          <div className="grid-images">
            {data.highestSales.map((item) => (
              <ImageCard key={item.id} item={item} navTo={navTo} isVariant={false} />
            ))}
          </div>
          <button className="more-btn" onClick={allSareeNav}>
            View All...
          </button>
        </section>
      </div>
    </>
  );
}
