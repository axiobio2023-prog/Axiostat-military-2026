$(document).ready(function () {})
$(document).ready(function () {
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop()
    if (scroll < 200) {
      $('.header').removeClass('sticky')
    } else {
      $('.header').addClass('sticky')
    }
  })
  $('.carousel_1').owlCarousel({
    animateOut: 'animate__zoomOut',
    animateIn: 'animate__zoomIn',
    nav: !0,
    navText: [
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>",
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>"
    ],
    margin: 10,
    items: 1,
    loop: !0,
    autoplay: !0,
    autoplayTimeout: 6000,
    smartSpeed: 1000,
    dots: !1
  })
  $('.carousel_subtitle').owlCarousel({
    animateOut: 'animate__slideOutDown',
    animateIn: 'animate__slideInDown',
    nav: !1,
    margin: 10,
    touchDrag: !1,
    mouseDrag: !1,
    items: 1,
    loop: !0,
    autoplay: !0,
    autoplayTimeout: 6000,
    smartSpeed: 1000,
    dots: !1
  })
  $('.carousel_latest').owlCarousel({
    loop: !0,
    margin: 15,
    dots: !1,
    nav: !0,
    navText: [
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>",
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>"
    ],
    autoplay: !0,
    autoplayTimeout: 5000,
    autoplayHoverPause: !0,
    autoplaySpeed: 1000,
    responsive: {
      0: { items: 1, stagePadding: 15 },
      769: { items: 2, stagePadding: 15 },
      991: { items: 3, stagePadding: 25 },
      1200: { items: 3, stagePadding: 25 },
      1400: { items: 3, stagePadding: 30 }
    }
  })
  $('.carousel_events').owlCarousel({
    loop: !1,
    margin: 15,
    dots: !1,
    nav: !0,
    navText: [
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>",
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>"
    ],
    autoplay: !1,
    autoplayTimeout: 5000,
    autoplayHoverPause: !0,
    autoplaySpeed: 1000,
    responsive: {
      0: { items: 1, stagePadding: 15 },
      769: { items: 2, stagePadding: 15 },
      991: { items: 3, stagePadding: 25 },
      1200: { items: 3, stagePadding: 25 },
      1400: { items: 3, stagePadding: 30 }
    }
  })
  $('.carousel_award').owlCarousel({
    loop: !0,
    margin: 50,
    dots: !1,
    nav: !1,
    autoplay: !0,
    autoplayTimeout: 4000,
    autoplayHoverPause: !0,
    autoplaySpeed: 1200,
    responsive: {
      0: { items: 2, stagePadding: 35 },
      769: { items: 3, stagePadding: 35 },
      991: { items: 4, stagePadding: 45 },
      1200: { items: 5, stagePadding: 45 },
      1400: { items: 6, stagePadding: 50 }
    }
  })
  $('.carousel_step').owlCarousel({
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    touchDrag: !1,
    mouseDrag: !1,
    nav: !0,
    navText: [
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>",
      "<img src='/assets/graphics/icon/carousel_arrow.svg'>"
    ],
    margin: 10,
    items: 1,
    loop: !0,
    autoplay: !1,
    smartSpeed: 1000,
    dots: !1
  })
})
