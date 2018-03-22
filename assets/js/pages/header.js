$(function() {
    
    $('.sidebar-mobile-main-toggle').on('click', function (e) {
        e.preventDefault()
        $('body').toggleClass('sidebar-mobile-main').removeClass('sidebar-mobile-secondary sidebar-mobile-opposite')
    });

})