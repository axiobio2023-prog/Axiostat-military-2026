$(document).ready(function() {

     
});
      


$(document).ready(function() {
/*-----------------------------
     Fixed Navigation
-----------------------------*/

    $(window).on('scroll', function () {

        var scroll = $(window).scrollTop();
        if (scroll < 200) {
            $(".header").removeClass("sticky");
        } else {
            $(".header").addClass("sticky");
        }

    });


/*-----------------------------
      owl
    -----------------------------*/
 
$(".carousel_1").owlCarousel(
{
  animateOut: 'animate__zoomOut',
  animateIn: 'animate__zoomIn',
  nav:true,
  navText: ["<img src='/assets/graphics/icon/carousel_arrow.svg'>","<img src='/assets/graphics/icon/carousel_arrow.svg'>"],
  margin:10,
  items:1,
  loop:true,
  autoplay:true,
  autoplayTimeout: 6000,
  smartSpeed: 1000,
  dots:false
});

$(".carousel_subtitle").owlCarousel(
{
  animateOut: 'animate__slideOutDown',
  animateIn: 'animate__slideInDown',
  nav:false,
  margin:10,
  touchDrag:false,
  mouseDrag:false,
  items:1,
  loop:true,
  autoplay:true,
  autoplayTimeout: 6000,
  smartSpeed: 1000,
  dots:false
});

 
$(".carousel_latest").owlCarousel(
{
  loop:true,
  margin:15,
  dots:false,
  nav:true,
  navText: ["<img src='/assets/graphics/icon/carousel_arrow.svg'>","<img src='/assets/graphics/icon/carousel_arrow.svg'>"],
  autoplay:true,
  autoplayTimeout:5000,
  autoplayHoverPause:true,
  autoplaySpeed:1000,
  responsive:{
      0:{
            items:1,
            stagePadding:15
      },
      769:{
            items:2,
            stagePadding:15
      },
      991:{
            items:3,
            stagePadding:25
      },
      1200:{
            items:3,
            stagePadding:25
      },
      1400:{
            items:3,
            stagePadding:30
      }
  }
});

$(".carousel_events").owlCarousel(
{
  loop:false,
  margin:15,
  dots:false,
  nav:true,
  navText: ["<img src='/assets/graphics/icon/carousel_arrow.svg'>","<img src='/assets/graphics/icon/carousel_arrow.svg'>"],
  autoplay:false,
  autoplayTimeout:5000,
  autoplayHoverPause:true,
  autoplaySpeed:1000,
  responsive:{
      0:{
            items:1,
            stagePadding:15
      },
      769:{
            items:2,
            stagePadding:15
      },
      991:{
            items:3,
            stagePadding:25
      },
      1200:{
            items:3,
            stagePadding:25
      },
      1400:{
            items:3,
            stagePadding:30
      }
  }
});



$(".carousel_video_onfield").owlCarousel(
{
  loop:true,
  rewind:true,
  margin:0,
  dots:false,
  nav:true,
  navText: [
    "<i class=\"fa-solid fa-chevron-left\" aria-hidden=\"true\"></i>",
    "<i class=\"fa-solid fa-chevron-right\" aria-hidden=\"true\"></i>",
  ],
  autoplay:false,
  items:1,
  responsive:{
      0:{ items:1 },
      769:{ items:1 },
      991:{ items:1 }
  }
});


$(".carousel_award").owlCarousel(
{
  loop:true,
  margin:50,
  dots:false,
  nav:false,
  autoplay:true,
  autoplayTimeout:4000,
  autoplayHoverPause:true,
  autoplaySpeed:1200,
  responsive:{
      0:{
            items:2,
            stagePadding:35
      },
      769:{
            items:3,
            stagePadding:35
      },
      991:{
            items:4,
            stagePadding:45
      },
      1200:{
            items:5,
            stagePadding:45
      },
      1400:{
            items:6,
            stagePadding:50
      }
  }
});

$(".carousel_step").owlCarousel(
{
  animateOut: 'fadeOut',
  animateIn: 'fadeIn',
  touchDrag:false,
  mouseDrag:false,
  nav:true,
  navText: ["<img src='/assets/graphics/icon/carousel_arrow.svg'>","<img src='/assets/graphics/icon/carousel_arrow.svg'>"],
  margin:10,
  items:1,
  loop:true,
  autoplay:false,
  
  smartSpeed: 1000,
  dots:false
});






});

 






