import 'bootstrap/dist/css/bootstrap.min.css';


import Carousel from 'react-bootstrap/Carousel';
import "../css/slide.css"
function Slide() {

    return (
        <div className='slide'>
            <Carousel fade>
                <Carousel.Item>
                    <img src="https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dwe6547122/Ace_Your_Saree_Banner_D.jpg" alt="" />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="https://manyavar.scene7.com/is/image/manyavar/MOHEY_HOME%20PAGE_Desktop_2500x1042-02_17-09-2024-07-11?$WT_HP%2FMLP%2FWLP_Hero_D$" alt="" />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src="https://www.frontierraas.com/the-voice/wp-content/uploads/2023/07/Blog-Banner-1.jpg" alt="" />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Slide
