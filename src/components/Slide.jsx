
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
            src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762832924/safeimagekit-WhatsApp_Image_2025-11-10_at_22.22.48_822c339e_kjpgum.jpg"
            alt="Beautiful Sarees"
          />

        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 slide-img"
            src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762832986/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.15_9cef56ca_lqkrbp.jpg"
            alt="Elegant Sarees"
          />

        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 slide-img"
            src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833014/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.13_e1af3440_swyoie.jpg"
            alt="Grace in Every Drape"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833041/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.13_04d1fbf0_mv3hmv.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833103/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.12_3781883f_qxacqc.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833132/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.11_b42bbd7d_apo3h9.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833590/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.16_1f68fd70_bxs2gm.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833613/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.17_4db0a5de_mzxzoq.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833623/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.17_5e98c475_ujokdz.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833836/safeimagekit-WhatsApp_Image_2025-11-10_at_15.55.16_7c913791_qujgcv.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 slide-img" src="https://res.cloudinary.com/dmqa8d6yq/image/upload/v1762833652/safeimagekit-WhatsApp_Image_2025-11-10_at_22.38.01_43220314_p1cngo.jpg" alt="Grace in Every Drape" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default Slide;
