$(function () {
    var currentSlideNumber = 0;
    var slides = $('.slideshow .slideshow-slide');
    var nextButton = $('#slideshowControllers .goNext');
    var prevButton = $('#slideshowControllers .goPrev');
    var text0 = $('#slideShowText0');
    var text1 = $('#slideShowText1');
    var text2 = $('#slideShowText2');

    // Init slideshow
    prevButton.prop('disabled', true);
    slides.addClass('isHidden');
    slides.eq(currentSlideNumber).addClass('isCurrent').removeClass('isHidden');
    $('.slideshow .slideshowSlide-part').addClass('partHide');
    slides.eq(currentSlideNumber).children('.slideshowSlide-part').addClass('isShowing').removeClass('partHide');

    function updateText () {
        text0.fadeOut(200);
        text1.fadeOut(200);
        text2.fadeOut(200);

        setTimeout(function () {
            if(currentSlideNumber == 0) {
                text1.text('souhaitez');
                text2.text('garantir');
            } else if (currentSlideNumber == 1) {
                text1.text('tenez à');
                text2.text('maîtriser');
            }

            text0.fadeIn(200);
            text1.fadeIn(200);
            text2.fadeIn(200);
        }, 200);
    }

    nextButton.click(function () {
        event.preventDefault();

        if (currentSlideNumber < 1) {
            for (var i = 0; i < 4; i++) {
                (function(index) {
                    setTimeout(function() {
                        slides.eq(currentSlideNumber).children('.slideshowSlide-part').eq(index).addClass('isHidding').removeClass('isShowing');
                    }, i * 150);
                    setTimeout(function() {
                        slides.eq(currentSlideNumber).children('.slideshowSlide-part').eq(index).addClass('partHide').removeClass('isHidding');
                    }, i * 200);
                })(i);
            }


            setTimeout(function() {
                currentSlideNumber = currentSlideNumber + 1;
                updateText();
            }, 800);

            setTimeout(function() {
                slides.removeClass('isCurrent').addClass('isHidden');
                slides.eq(currentSlideNumber).addClass('isCurrent');

                for (var i = 0; i < 4; i++) {
                    (function(index) {
                        setTimeout(function() {
                            slides.eq(currentSlideNumber).children('.slideshowSlide-part').eq(index).removeClass('partHide').addClass('isShowing');
                        }, i * 150);
                    })(i);
                }
            }, 800);
        }

        $('.slideshow-controller-page').toggleClass('isActive');
        prevButton.prop('disabled', false);
        nextButton.prop('disabled', true);
    });

    prevButton.click(function () {
        event.preventDefault();

        if (currentSlideNumber > 0) {
            for (var i = 0; i < 4; i++) {
                (function(index) {
                    setTimeout(function() {
                        slides.eq(currentSlideNumber).children('.slideshowSlide-part').eq(index).addClass('isHidding').removeClass('isShowing');
                    }, i * 150);
                    setTimeout(function() {
                        slides.eq(currentSlideNumber).children('.slideshowSlide-part').eq(index).addClass('partHide').removeClass('isHidding');
                    }, i * 200);
                })(i);
            }


            setTimeout(function() {
                currentSlideNumber = currentSlideNumber - 1;
                updateText();
            }, 800);

            setTimeout(function() {
                slides.removeClass('isCurrent').addClass('isHidden');
                slides.eq(currentSlideNumber).addClass('isCurrent');

                for (var i = 0; i < 4; i++) {
                    (function(index) {
                        setTimeout(function() {
                            slides.eq(currentSlideNumber).children('.slideshowSlide-part').eq(index).removeClass('partHide').addClass('isShowing');
                        }, i * 150);
                    })(i);
                }
            }, 800);
        }

        $('.slideshow-controller-page').toggleClass('isActive');
        prevButton.prop('disabled', true);
        nextButton.prop('disabled', false);
    });
});