$(document).ready(function () {
    (function ($) {
        'use strict';
        let Nav = new hcOffcanvasNav('#main-nav', {
            disableAt: false,
            customToggle: '.menu_icon',
            levelSpacing: 40,
            navTitle: 'All',
            levelTitles: true,
            levelTitleAsBack: true,
            pushContent: '#container',
            labelClose: false
        });
    })(jQuery);
});