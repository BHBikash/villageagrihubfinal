import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "../styles/HomePage.css";
import ProductListPage from "./ProductListPage"; // Import the product list

import slider1 from "../assets/slider1.jpg";
import slider2 from "../assets/slider2.jpg";
import slider3 from "../assets/slider3.jpg";
import slider4 from "../assets/slider4.jpg";
import slider5 from "../assets/slider5.jpg";
import slider6 from "../assets/slider6.jpg";

const HomePage = () => {
  const sliderImages = [slider1, slider2, slider3, slider4, slider5, slider6];

  return (
    <div className="home-container">
      {/* Slider Section */}
      <div className="slider-container">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="swiper-container"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Slide ${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <h2>Available Products</h2>
        <ProductListPage />
      </div>
    </div>
  );
};

export default HomePage;
