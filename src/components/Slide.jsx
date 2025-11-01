import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';
import "../css/slide.css";

function Slide() {
  return (
    <div className="slide">
      <Carousel fade interval={3000} pause={false}>
        <Carousel.Item>
          <img
            className="d-block w-100 slide-img"
            src="https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dwe6547122/Ace_Your_Saree_Banner_D.jpg"
            alt="Beautiful Sarees"
          />
          <Carousel.Caption className="caption">
            <h3>Beautiful Sarees</h3>
            <p>Shop the latest traditional collections.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 slide-img"
            src="https://manyavar.scene7.com/is/image/manyavar/MOHEY_HOME%20PAGE_Desktop_2500x1042-02_17-09-2024-07-11?$WT_HP%2FMLP%2FWLP_Hero_D$"
            alt="Elegant Sarees"
          />
          <Carousel.Caption className="caption">
            <h3>Elegant Sarees</h3>
            <p>Find perfect designs for every celebration.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 slide-img"
            src="https://www.frontierraas.com/the-voice/wp-content/uploads/2023/07/Blog-Banner-1.jpg"
            alt="Grace in Every Drape"
          />
          <Carousel.Caption className="caption">
            <h3>Grace in Every Drape</h3>
            <p>Discover handpicked sarees for every occasion.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Slide;
