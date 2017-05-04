$(function() {
    var header = $("#header");
    var responsiveButton = $("#toggleResponsiveMenuButton");
    var responsiveMenuItem = $(".responsive-menu-detail-item");
    var introHeight = $('#intro').innerHeight();

    function getMenuClass() {
        var scroll = $(window).scrollTop();

        if (window.matchMedia('(min-width: 1024px)').matches) {
            if (scroll < 60) {
                header.addClass("initial").removeClass('floatingMenu').removeClass('fixedMenu');
            } else if (scroll >= 60 && scroll <= introHeight) {
                header.removeClass("initial").addClass('floatingMenu').removeClass('fixedMenu');
            } else {
                header.removeClass("initial").removeClass('floatingMenu').addClass('fixedMenu');
            }
        }
    }

    function setCurrentSectionActive () {
        $('section').each(function(){
            if($(this).offset().top < window.pageYOffset + 10
                && $(this).offset().top + $(this).height() > window.pageYOffset + 10) {
                $('a[href="#' + $(this).attr('id') + '"]:not(".isLogo")').addClass('isActive');
            } else {
                $('a[href="#' + $(this).attr('id') + '"]').removeClass('isActive');
            }
        });
    }

    $(window).scroll(function() {
        // Get menu class in function of scroll
        getMenuClass();

        // Set item menu active
        setCurrentSectionActive();
    });

    $().ready(function () {
        // Get menu class in function of scroll
        getMenuClass();

        // Set item menu active
        setCurrentSectionActive();

        if (window.matchMedia('(max-width: 1023px)').matches) {
            header.addClass('isResponsiveMenu');
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
            header.removeClass('isResponsiveMenu');
            $('.responsive-menu-detail').removeClass('isOpen');
            getMenuClass();
        } else {
            header.addClass('isResponsiveMenu');
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
            if (
                $(this).offset().top < window.pageYOffset + 10
                && $(this).offset().top + $(this).height() > window.pageYOffset + 10
            ) {
                var sectionId = $(this).attr('id');
                var txt = '';

                switch (sectionId) {
                    case 'intro' :
                        txt = '';
                        break;

                    case 'about' :
                        txt = 'Qui sommes-nous ?';
                        break;

                    case 'challenges' :
                        txt = 'Vos challenges';
                        break;

                    case 'performance' :
                        txt = 'Nos prestations';
                        break;

                    case 'references' :
                        txt = 'Nos références';
                        break;

                    case 'team' :
                        txt = 'Notre équipe';
                        break;

                    case 'contact' :
                        txt = 'Contact';
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