/*
  * @package Azurex
  * @subpackage Azurex HTML
  * 
  * Template Scripts
  * Created by Tripples
  
   1. Fixed header
   2. Main slideshow
   3. Owl Carousel
   4. Video popup
   5. Counter
   6. Back to top
  
*/


jQuery(function($) {
  "use strict";


   /* ----------------------------------------------------------- */
   /*  Fixed header
   /* ----------------------------------------------------------- */

   $(window).on('scroll', function(){
      if ( $(window).scrollTop() > 70 ) {
         $('.site-navigation, .header-white').addClass('navbar-fixed');
      } else {
         $('.site-navigation, .header-white').removeClass('navbar-fixed');
      }
   });


   /* ----------------------------------------------------------- */
   /*  Main slideshow
   /* ----------------------------------------------------------- */

      $('#main-slide').carousel({
         pause: true,
         interval: 100000,
      });



  /* ----------------------------------------------------------- */
  /*  Owl Carousel
  /* ----------------------------------------------------------- */


      //Project slide

      $("#project-slide").owlCarousel({

         loop:true,
         animateOut: 'fadeOut',
         nav:true,
         margin:15,
         dots:false,
         mouseDrag:true,
         touchDrag:true,
         slideSpeed:800,
         navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
         items : 4,
         responsive:{
           0:{
               items:1
           },
           600:{
               items:4
           }
         }

      });


      //Testimonial slide

      $("#testimonial-slide").owlCarousel({

         loop:false,
         margin:20,
         nav:false,
         dots:true,
         items : 3,
         responsive:{
           0:{
               items:1
           },

           600:{
               items:3
           }
         }

      });



      //Partners slide

      $("#partners-carousel").owlCarousel({

         loop:true,
         margin:20,
         nav:false,
         dots:false,
         mouseDrag:true,
         touchDrag:true,
         items : 5,
         responsive:{
           0:{
               items:2
           },
           600:{
               items:5
           }
         }

      });

       //Page slide

      $(".page-slider").owlCarousel({

         loop:true,
         animateOut: 'fadeOut',
         nav:true,
         margin:0,
         dots:false,
         mouseDrag:true,
         touchDrag:true,
         slideSpeed:400,
         navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
         items : 1,
         responsive:{
           0:{
               items:1
           },
           600:{
               items:1
           }
         }

      });


       //Team slide

       $("#team-slide").owlCarousel({

         loop:false,
         animateOut: 'fadeOut',
         nav:false,
         margin:20,
         dots:true,
         mouseDrag:true,
         touchDrag:true,
         slideSpeed:800,
         items : 4,
         responsive:{
           0:{
               items:1
           },
           600:{
               items:4
           }
         }

      });


   /* ----------------------------------------------------------- */
   /*  Video popup
   /* ----------------------------------------------------------- */
     $(document).ready(function(){

         $(".gallery-popup").colorbox({rel:'gallery-popup', transition:"fade", innerHeight:"500"});
         $(".popup").colorbox({iframe:true, innerWidth:600, innerHeight:400});

     });



   /* ----------------------------------------------------------- */
   /*  Counter
   /* ----------------------------------------------------------- */

      $('.counterUp').counterUp({
       delay: 10,
       time: 1000
      });


   
   /* ----------------------------------------------------------- */
   /*  Contact form
   /* ----------------------------------------------------------- */

   $('#contact-form').submit(function(){

      var $form = $(this),
         $error = $form.find('.error-container'),
         action  = $form.attr('action');

      $error.slideUp(750, function() {
         $error.hide();

         var $name = $form.find('.form-control-name'),
            $email = $form.find('.form-control-email'),
            $subject = $form.find('.form-control-subject'),
            $message = $form.find('.form-control-message');

         $.post(action, {
               name: $name.val(),
               email: $email.val(),
               subject: $subject.val(),
               message: $message.val()
            },
            function(data){
               $error.html(data);
               $error.slideDown('slow');

               if (data.match('success') != null) {
                  $name.val('');
                  $email.val('');
                  $subject.val('');
                  $message.val('');
               }
            }
         );

      });

      return false;

   });


   /* ----------------------------------------------------------- */
   /*  Back to top
   /* ----------------------------------------------------------- */

       $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
      // scroll body to 0px on click
      $('#back-to-top').click(function () {
          $('#back-to-top').tooltip('hide');
          $('body,html').animate({
              scrollTop: 0
          }, 800);
          return false;
      });
      
      $('#back-to-top').tooltip('hide');

});








