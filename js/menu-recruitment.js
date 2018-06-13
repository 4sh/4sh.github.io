

$(function() {
    var menu = $("#menu");

    var anchorOffsetShift = menu.height() + 10;
    var responsiveButton = $("#toggleResponsiveMenuButton");
    var responsiveMenuItem = $(".responsive-menu-detail-item");

    function isSectionCurrentlyDisplayed(sectionElement) {
        var sectionTopOffset = $(sectionElement).offset().top;
        var sectionBottomOffset = sectionTopOffset + $(sectionElement).height();
        return sectionTopOffset - anchorOffsetShift < window.pageYOffset
            && sectionBottomOffset - anchorOffsetShift > window.pageYOffset;

    }

    function setCurrentSectionActive () {
        $('section').each(function(){
            if(isSectionCurrentlyDisplayed($(this)[0])) {
                $('a[href="#' + $(this).attr('id') + '"]:not(".isLogo")').addClass('isActive');
            } else {
                $('a[href="#' + $(this).attr('id') + '"]').removeClass('isActive');
            }
        });
    }

    function addClickHandlersOnAnchors () {
        $(".standardMenu a, .responsive-menu a").click(function(event){
            var locationHash = $(event.target).attr('href');
            window.location.hash = locationHash; //set hash
            // scroll to anchor  offset - header menu height
            $('html, body').animate({scrollTop: $(locationHash).offset().top - anchorOffsetShift}, 'slow');
            return false; //disables browser anchor jump behavior (by charlietfl)
        });
    }

    $(window).scroll(function() {
        // Get menu class in function of scroll
        // getMenuClass();

        // Set item menu active
        setCurrentSectionActive();
    });

    $().ready(function () {
        // Get menu class in function of scroll
        // getMenuClass();

        // Set item menu active
        setCurrentSectionActive();

        // Add click handlers to main menu
        addClickHandlersOnAnchors();

        if (window.matchMedia('(max-width: 1023px)').matches) {
            menu.addClass('isResponsiveMenu');
        }
    });

    responsiveButton.click(function(){
        $('.responsive-menu-detail').toggleClass('isOpen');
    });

    responsiveMenuItem.click(function(){
        $('.responsive-menu-detail').toggleClass('isOpen');
    });

    $(window).resize(function(){
        if (window.matchMedia('(min-width: 1024px)').matches) {
            menu.removeClass('isResponsiveMenu');
            $('.responsive-menu-detail').removeClass('isOpen');
        } else {
            menu.addClass('isResponsiveMenu');
        }
    });

    // Set menu cursor left position on menu item hover.
    $('.menu-item').hover(
        function(){
            $('.menu-cursor').css('left', $(this).position().left + $(this).innerWidth() / 2);
        });


    // Set title in header in responsive mode
    $(document).bind('scroll', function (e) {
        $('section').each(function () {

            if (isSectionCurrentlyDisplayed($(this)[0])) {
                var sectionId = $(this).attr('id');
                var txt = '';

                switch (sectionId) {
                    case 'recruitmentPourquoi4sh' :
                        txt = 'Pourquoi rejoindre 4SH ?';
                        break;

                    case 'recruitmentVie4sh' :
                        txt = 'La vie à 4SH';
                        break;

                    case 'recruitmentAvis' :
                        txt = 'Ce qu’ils en pensent …';
                        break;

                    case 'recruitmentOffres' :
                        txt = '4SH recherche...';
                        break;

                    default :
                        txt = '';
                        break;
                }


                if (window.matchMedia('(max-width: 1023px)').matches && txt != '') {
                    $('#pageTitle').show();
                    $('#pageTitle').text(txt);
                } else {
                    $('#pageTitle').hide();
                }
            }
        });
    });


});

