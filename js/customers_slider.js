$(function() {
    // Set the customer logo path location
    var customerPicturePath = 'images/customers/slider/';
    
    // Customers object to define customers to show on slider.
    var customers = [
        {
            name : 'Cinatis',
            pictureName : 'cinatis.png'
        },
        {
            name : 'SODETREL',
            pictureName : 'sodetrel.png'
        },
        {
            name : 'Naxos/C21',
            pictureName : 'naxos_c21.png'
        },
        {
            name : 'Infoport',
            pictureName : 'infoport.png'
        },
        {
            name : 'Wilmar',
            pictureName : 'wilmar.png'
        },
        {
            name : 'CIN',
            pictureName : 'cin.png'
        },
        {
            name : 'Sud Ouest',
            pictureName : 'sud_ouest.png'
        },
        {
            name : 'Dam\'s Pro',
            pictureName : 'dams.png'
        },
        {
            name : 'BP2R',
            pictureName : 'bp2r.png'
        },
        {
            name : 'KeenTurtle',
            pictureName : 'keen_turtle.png'
        },
        {
            name : 'ARKHE',
            pictureName : 'arkhe.png'
        }
    ];

    // Init require settings.
    var itemPerPage = 0;
    var numberOfPage = 0;
    var currentPage = 1;
    var numberOfRow = 0;
    
    // Set some require settings variables in function of the screen size.
    // itemPerPage [int] => All items visible on one page. This will be separate on `numberOfRow` row(s)
    // numberOfRow [int] => Number of row tou want.
    // currentPage [int] => Set current page to one for prevent empty pages on resize
    function setBasicSettings() {
        if(window.matchMedia('(max-width: 600px)').matches) {
            itemPerPage = 2;
            numberOfRow = 1;
            currentPage = 1;
        } else if (window.matchMedia('(min-width: 601px) and (max-width: 850px)').matches) {
            itemPerPage = 6;
            numberOfRow = 2;
            currentPage = 1;
        } else {
            itemPerPage = 8;
            numberOfRow = 2;
            currentPage = 1;
        }
    }

    // Set the number of page in function of the number of items and the number of items per page.
    function setNumberOfPage() {
        if(Math.floor( customers.length / itemPerPage ) && customers.length % itemPerPage != 0) {
            numberOfPage = Math.floor( customers.length / itemPerPage ) + 1;
        } else {
            numberOfPage = Math.floor( customers.length / itemPerPage );
        }
    }

    // Get the current customers to display
    // currentCustomer [Array] => Array with customers to display
    function getCurrentCustomers() {
        var currentCustomer = $.grep(customers, function (n, i) {
            return (i + 1 >= (currentPage * itemPerPage - itemPerPage) + 1 && i + 1 <= currentPage * itemPerPage);
        });

        var tmpCurrentCustomerLength = currentCustomer.length;

        // Add empty customer if the page isn't filled.
        if(currentCustomer.length < itemPerPage) {
            for (i = 0; i < itemPerPage - tmpCurrentCustomerLength; i++) {
                currentCustomer.push({name:'empty', pictureName:'blank.png'});
            }
        }

        return currentCustomer;
    }

    // Generate customer slider
    function generateCustomers() {
        var currentCustomer = getCurrentCustomers();

        $.each(currentCustomer, function (index, value) {
            if(index < itemPerPage / numberOfRow) {
                $('#customersSlideRow1').append(
                    '<div class="customers-col">' +
                    '<img src="'+ customerPicturePath + value.pictureName +'" alt="'+ (value.name != 'empty'?value.name:'') +'"> ' +
                    '</div>'
                );
            } else if (index >= itemPerPage / numberOfRow) {
                $('#customersSlideRow2').append(
                    '<div class="customers-col">' +
                    '<img src="'+ customerPicturePath + value.pictureName +'" alt="'+ (value.name != 'empty'?value.name:'') +'"> ' +
                    '</div>'
                );
            }
        });

        generatePagination();
    }

    // Update customer sliders
    function updateCustomers() {
        $('#customersSlideRow1 .customers-col').detach();
        $('#customersSlideRow2 .customers-col').detach();

        generateCustomers();

        $('#customersSlidePages .slideshow-controller-page').removeClass('isActive');
        $('#customersSlidePages .slideshow-controller-page:nth-child('+ currentPage  +')').addClass('isActive');
    }

    // Generate pagination
    function generatePagination() {
        setNumberOfPage();

        var pagesIndicator = new Array(numberOfPage);

        $('#customersSlidePages .slideshow-controller-page').detach();

        $.each(pagesIndicator, function() {
            $('#customersSlidePages').append('<div class="slideshow-controller-page"><svg version="1.1" id="Calque_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 101 99.5" style="enable-background:new 0 0 101 99.5;" xml:space="preserve"><path class="fill" d="M43.5,93.8l-37-37c-3.9-3.9-3.9-10.1,0-14l37-37c3.9-3.9,10.1-3.9,14,0l37,37c3.9,3.9,3.9,10.1,0,14l-37,37C53.6,97.6,47.4,97.6,43.5,93.8z"/></svg></div>')
        });

        $('#customersSlidePages .slideshow-controller-page:first-child').addClass('isActive');
    }

    
    // First init and generation when page is loading.
    setBasicSettings();
    generateCustomers();

    
    // Add resize handler on window to allow responsive generation of the slider.
    $( window ).resize(function() {
        setBasicSettings();
        updateCustomers();
    });
    
    // Prev page action
    $('#goPrevPage').click(function() {
        if(currentPage > 1) {
            currentPage = currentPage - 1;
            updateCustomers();
        }
    });

    // Next page action
    $('#goNextPage').click(function() {
        if(currentPage < numberOfPage) {
            currentPage = currentPage + 1;
            updateCustomers();
        }
    });
});