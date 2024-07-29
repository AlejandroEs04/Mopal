import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import { Pagination, Navigation, Autoplay } from 'swiper/modules'

const images = [
    {
        id: 1,
        url: "hundaiLogo.png"
    },
    {
        id: 2,
      url: "kelloggsLogo.png"
    },
    {
        id: 3,
      url: "kiaLogo.png"
    },
    {
        id: 4,
      url: "vitroLogo.png"
    },
    {
        id: 5,
      url: "hundaiLogo.png"
    },
    {
        id: 6,
      url: "kelloggsLogo.png"
    },
    {
        id: 7,
      url: "kiaLogo.png"
    },
    {
        id: 8,
      url: "vitroLogo.png"
    }
  ]

const CustomerSlider = () => {
  return (
    <div className="my-4">
        <Swiper
            slidesPerView={'auto'}
            spaceBetween={50}
            pagination={{
                clickable: true, 
                dynamicBullets: true,
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            {images.map(image => (
                <SwiperSlide key={image.id} className="pb-5">
                    <img className='image-item' src={`./img/${image.url}`} alt="Logo de CFE" />
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
  )
}

export default CustomerSlider