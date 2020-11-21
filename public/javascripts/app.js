$(document).ready(function() {
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 0) {
            $('#desktop-nav').addClass('styled');
        } else {
            $('#desktop-nav').removeClass('styled');
        }
    });
    if ($(window).scrollTop() > 0) {
        $('#desktop-nav').addClass('styled');
    } else {
        $('#desktop-nav').removeClass('styled');
    }

    //Mega menu
    //desktop drop down menu	
    $(".mm-trigger").hover(function () {
        $('#desktop-nav').addClass('styled');
        $('.mega-menu').addClass('display-on');
        $('.mega-menu').slideDown(500);
        $('.mm-trigger').addClass('triggered');
    });
    $(".mega-menu").mouseleave(function () {
        $('.mega-menu').removeClass('display-on');
        $('.mega-menu').slideUp(500);
        $('.mm-trigger').removeClass('triggered');
        $('#desktop-nav').removeClass('styled');
    });
    $(".nav-link-main").not('.nav-link-main.mm-trigger').hover(function () {
        $('.mega-menu').removeClass('display-on');
        $('.mega-menu').slideUp(500);
        $('.mm-trigger').removeClass('triggered');
        if ($(window).scrollTop() == 0) {
            $('#desktop-nav').removeClass('styled');
        }       
    });


    downArrow = $(".mobile-mainlinks .expand-arrow");
    upArrow = $(".mobile-mainlinks .collapse-arrow");
    $('#hamburger').on("click", function() {
        $(this).toggleClass('active')
        $("#mobiledropdown").fadeToggle("slow");
    });

    $('#services-trigger').on("click", function() {
        $("#services-dropdown").slideToggle(500);
        $("#services-dropdown").toggleClass("active");
        $(downArrow).toggleClass("hide");
        $(upArrow).toggleClass("hide");
    });

    // Card dropdown on booking details page
    function cardDropdown(button) {
        var cardsContainer = '.cards-container';
        var dropdownContent = '.dropdown-content';
        var upIcon = '.fa-caret-up';
        var downIcon = '.fa-caret-down';

        function cardSlideUp(button) {
            $(button).find(downIcon).removeClass('hide');
            $(button).find(upIcon).addClass('hide');
            $(button).next(dropdownContent).slideUp('slow');
            $(button).removeClass('active');
        }

        function cardSlideDown(button) {
            inactiveCards = $(cardsContainer).find('.card-dropdown').not('.card-dropdown.opencard');
            if (inactiveCards.length > 0) {
                inactiveCards.addClass('align-flex-start');
            }

            $(button).next(dropdownContent).slideDown('slow');
            $(button).find(downIcon).addClass('hide');
            $(button).find(upIcon).removeClass('hide');
            $(button).addClass('active');
        }

        $(button).next(dropdownContent).toggleClass('show');
        $(button).closest('.card-dropdown').toggleClass('opencard');
        $(button).closest('.cards-container').toggleClass('open');

        if ($(button).hasClass('active')) {
            cardSlideUp(button)
        } else {
            cardSlideDown(button)
        }
    }

    $('#change-location').on('click', function() {
        $('#change-location-box').toggle();
    });

    $('.home .cards .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 3,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                stagePadding: 25,
            },
            992: {
                items: 3,
                nav: true
            }
        }
    });

    $('.office-space .cards .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 3,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                stagePadding: 25,
            },
            992: {
                items: 3,
                nav: true
            }
        }
    });

    $('.home .intelligent-assistant .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 1
    });

    $('.home .plan .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: true,
        items: 1
    });

    $('.general-template .cards .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 3,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                stagePadding: 25,
            },
            992: {
                items: 3,
                nav: true
            }
        }
    });

    $('.location-home .meet-the-team.mobile .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 1,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            992: {
                items: 1,
                nav: true
            }
        }
    });

    $('.location-home .news .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 2,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            992: {
                items: 2,
                nav: true
            }
        }
    });

    $('.location-home .promotions .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 3,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            992: {
                items: 3,
                nav: true
            }
        }
    });

    $('.virtual-assistant .path-to-freedom-cards .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 3,
        center: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                stagePadding: 25,
            },
            992: {
                items: 3,
                nav: true
            }
        }
    });

    $('.blog-category .owl-carousel').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 1
    });

    $('#phone').each(function() {
        window.intlTelInput($(this)[0], {
            // any initialisation options go here
        });
    });

    $('.dropdown-tab').each(function() {
        $('.dropdown-item', $(this)).on('click', function() {
            $('button', $(this).closest('.dropdown-tab')).text($(this).text());
        });
    });
});



//Phone auto formatter

var zChar = new Array(' ', '(', ')', '-', '.');
var maxphonelength = 13;
var phonevalue1;
var phonevalue2;
var cursorposition;

function ParseForNumber1(object) {
    phonevalue1 = ParseChar(object.value, zChar);
}

function ParseForNumber2(object) {
    phonevalue2 = ParseChar(object.value, zChar);
}

function backspacerUP(object, e) {
    if (e) {
        e = e
    } else {
        e = window.event
    }
    if (e.which) {
        var keycode = e.which
    } else {
        var keycode = e.keyCode
    }

    ParseForNumber1(object)

    if (keycode >= 48) {
        ValidatePhone(object)
    }
}

function backspacerDOWN(object, e) {
    if (e) {
        e = e
    } else {
        e = window.event
    }
    if (e.which) {
        var keycode = e.which
    } else {
        var keycode = e.keyCode
    }
    ParseForNumber2(object)
}

function GetCursorPosition() {

    var t1 = phonevalue1;
    var t2 = phonevalue2;
    var bool = false
    for (i = 0; i < t1.length; i++) {
        if (t1.substring(i, 1) != t2.substring(i, 1)) {
            if (!bool) {
                cursorposition = i
                bool = true
            }
        }
    }
}

function ValidatePhone(object) {

    var p = phonevalue1

    p = p.replace(/[^\d]*/gi, "")

    if (p.length < 3) {
        object.value = p
    } else if (p.length == 3) {
        pp = p;
        d4 = p.indexOf('(')
        d5 = p.indexOf(')')
        if (d4 == -1) {
            pp = "(" + pp;
        }
        if (d5 == -1) {
            pp = pp + ")";
        }
        object.value = pp;
    } else if (p.length > 3 && p.length < 7) {
        p = "(" + p;
        l30 = p.length;
        p30 = p.substring(0, 4);
        p30 = p30 + ")"

        p31 = p.substring(4, l30);
        pp = p30 + p31;

        object.value = pp;

    } else if (p.length >= 7) {
        p = "(" + p;
        l30 = p.length;
        p30 = p.substring(0, 4);
        p30 = p30 + ")"

        p31 = p.substring(4, l30);
        pp = p30 + p31;

        l40 = pp.length;
        p40 = pp.substring(0, 8);
        p40 = p40 + "-"

        p41 = pp.substring(8, l40);
        ppp = p40 + p41;

        object.value = ppp.substring(0, maxphonelength);
    }

    GetCursorPosition()

    if (cursorposition >= 0) {
        if (cursorposition == 0) {
            cursorposition = 2
        } else if (cursorposition <= 2) {
            cursorposition = cursorposition + 1
        } else if (cursorposition <= 5) {
            cursorposition = cursorposition + 2
        } else if (cursorposition == 6) {
            cursorposition = cursorposition + 2
        } else if (cursorposition == 7) {
            cursorposition = cursorposition + 4
            e1 = object.value.indexOf(')')
            e2 = object.value.indexOf('-')
            if (e1 > -1 && e2 > -1) {
                if (e2 - e1 == 4) {
                    cursorposition = cursorposition - 1
                }
            }
        } else if (cursorposition < 11) {
            cursorposition = cursorposition + 3
        } else if (cursorposition == 11) {
            cursorposition = cursorposition + 1
        } else if (cursorposition >= 12) {
            cursorposition = cursorposition
        }

        var txtRange = object.createTextRange();
        txtRange.moveStart("character", cursorposition);
        txtRange.moveEnd("character", cursorposition - object.value.length);
        txtRange.select();
    }

}

function ParseChar(sStr, sChar) {
    if (sChar.length == null) {
        zChar = new Array(sChar);
    } else zChar = sChar;

    for (i = 0; i < zChar.length; i++) {
        sNewStr = "";

        var iStart = 0;
        var iEnd = sStr.indexOf(sChar[i]);

        while (iEnd != -1) {
            sNewStr += sStr.substring(iStart, iEnd);
            iStart = iEnd + 1;
            iEnd = sStr.indexOf(sChar[i], iStart);
        }
        sNewStr += sStr.substring(sStr.lastIndexOf(sChar[i]) + 1, sStr.length);

        sStr = sNewStr;
    }

    return sNewStr;
}
//End phone number auto formatting

// Begin credit card auto formatting
var acceptedCreditCards = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
};

$('#cc, #cvv').on('input', function() {
    if (validateCard($('#cc').val()) && validateCVV($('#cc').val(), $('#cvv').val())) {
        $('button[type="submit"]').prop('disabled', false);
    } else {
        $('button[type="submit"]').prop('disabled', true);
    }

    var node = $('#cc')[0]; // vanilla javascript element
    var cursor = node.selectionStart; // store cursor position
    var lastValue = $('#cc').val(); // get value before formatting

    var formattedValue = formatCardNumber(lastValue);
    $('#cc').val(formattedValue); // set value to formatted

    // keep the cursor at the end on addition of spaces
    if (cursor === lastValue.length) {
        cursor = formattedValue.length;
        // decrement cursor when backspacing
        // i.e. "4444 |" => backspace => "4444|"
        if ($('#cc').attr('data-lastvalue') && $('#cc').attr('data-lastvalue').charAt(cursor - 1) == " ") {
            cursor--;
        }
    }

    if (lastValue != formattedValue) {
        // increment cursor when inserting character before a space
        // i.e. "1234| 6" => "5" typed => "1234 5|6"
        if (lastValue.charAt(cursor) == " " && formattedValue.charAt(cursor - 1) == " ") {
            cursor++;
        }
    }

    // set cursor position
    node.selectionStart = cursor;
    node.selectionEnd = cursor;
    // store last value
    $('#cc').attr('data-lastvalue', formattedValue);
});

function formatCardNumber(value) {
    // remove all non digit characters
    var value = value.replace(/\D/g, '');
    var formattedValue;
    var maxLength;
    // american express, 15 digits
    if ((/^3[47]\d{0,13}$/).test(value)) {
        formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        maxLength = 17;
    } else if ((/^3(?:0[0-5]|[68]\d)\d{0,11}$/).test(value)) { // diner's club, 14 digits
        formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ');
        maxLength = 16;
    } else if ((/^\d{0,16}$/).test(value)) { // regular cc number, 16 digits
        formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
        maxLength = 19;
    }

    $('#cc').attr('maxlength', maxLength);
    return formattedValue;
}


function validateCard(value) {
    // remove all non digit characters
    var value = value.replace(/\D/g, '');
    var sum = 0;
    var shouldDouble = false;
    // loop through values starting at the rightmost side
    for (var i = value.length - 1; i >= 0; i--) {
        var digit = parseInt(value.charAt(i));

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    var valid = (sum % 10) == 0;
    var accepted = false;

    // loop through the keys (visa, mastercard, amex, etc.)
    Object.keys(acceptedCreditCards).forEach(function(key) {
        var regex = acceptedCreditCards[key];
        if (regex.test(value)) {
            accepted = true;
        }
    });

    return valid && accepted;
}


function validateCVV(creditCard, cvv) {
    // remove all non digit characters
    var creditCard = creditCard.replace(/\D/g, '');
    var cvv = cvv.replace(/\D/g, '');
    // american express and cvv is 4 digits
    if ((acceptedCreditCards.amex).test(creditCard)) {
        if ((/^\d{4}$/).test(cvv))
            return true;
    } else if ((/^\d{3}$/).test(cvv)) { // other card & cvv is 3 digits
        return true;
    }
    return false;
}

// date formatting
function formatString(e) {
    var inputChar = String.fromCharCode(event.keyCode);
    var code = event.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
        return;
    }

    event.target.value = event.target.value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
    ).replace(
        /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
    ).replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
    ).replace(
        /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
        /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
    ).replace(
        /\/\//g, '/' // Prevent entering more than 1 `/`
    );
}
// End credit card auto formatting

// Accordions
if ($(".accordion")[0]) {
    $('.collapse').collapse();
}
// Phone input functions
if ($("#phone")[0]) {
    var input = document.querySelector("#phone");
    window.intlTelInput(input, {
        // any initialisation options go here
    });
}

// Service Boxes Mobile
if ($('.services-mobile')[0]) {

    function serviceMobilePopup(element) {
        var id = $(element).attr('id');
        var name = $(element).data('name');

        $('#servicebox-mobile > .service-text').removeClass('d-flex');
        $('#servicebox-mobile > .service-text').addClass('d-none');

        if ($('#servicebox-mobile').hasClass(id)) {
            $('#servicebox-mobile').fadeOut(function() {
                $('#servicebox-mobile').removeClass();
            });
            return;
        }
        if ($('#servicebox-mobile').hasClass('open')) {
            console.log('here');
            $('#servicebox-mobile').attr('class', 'open');
            $('#servicebox-mobile').addClass(id);
            $('#servicebox-mobile').find('#' + name).addClass('d-flex');
            return;
        }
        $('#servicebox-mobile').addClass('open');
        $('#servicebox-mobile').addClass(id);
        $('#servicebox-mobile').find('#' + name).addClass('d-flex');
        $('#servicebox-mobile').fadeIn();

    }

    $(document).mouseup(function(e) {
        var serviceContainer = $('.services-mobile');

        if (!serviceContainer.is(e.target) && serviceContainer.has(e.target).length === 0) {
            $('#servicebox-mobile').fadeOut(function() {
                $('#servicebox-mobile').removeClass();
            });
        }
    });
}

if ($('.meet-the-team')[0]) {
    var teamDetails = $('#team-details');
    var teamList = $('ul.team-list');

    function showMemberDetails(element) {
        var memberId = $(element).data('details');
        var memberDetails = $(teamDetails).find('#' + memberId);

        if ($('#team-details #default').hasClass('hide') == false) {
            $('#team-details #default').addClass('hide');
        }

        $(teamDetails).find('.details').hide();
        $('.side-pointer').hide();
        $(memberDetails).show();
        $(element).find('.side-pointer').show();

        var hasVScroll = $(memberDetails)[0].scrollHeight > $(memberDetails)[0].clientHeight;
        if (hasVScroll) {
            $('#more-details').show()
            $(memberDetails).on('scroll', function() {
                if ($(memberDetails).scrollTop() > 0) {
                    $('#more-details').fadeOut();
                } else {
                    $('#more-details').fadeIn();
                }
            });
        } else {
            $('#more-details').hide()
        }
    }

    $(document).mouseup(function(e) {
        if ((!teamDetails.is(e.target) && teamDetails.has(e.target).length === 0) &&
            (!teamList.is(e.target) && teamList.has(e.target).length === 0)) {
            if ($('#team-details #default').hasClass('hide')) {
                $('#team-details #default').removeClass('hide');
                $(teamDetails).find('.details').hide();
            }
        }
    });

    $(teamList).on('scroll', function() {
        if ($(teamList).scrollTop() > 0) {
            $('#more-down').fadeOut();
        } else {
            $('#more-down').fadeIn();
        }
    });
}

if ($('body.locations > section.mobile.main')[0]) {    
    $('.nav-item').on('click', function() {
        $('.nav-item').toggleClass('active');
    });
}
