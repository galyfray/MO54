$(document).ready(function() {
    (function() {
        'use strict';
        // eslint-disable-next-line no-undef
        new hcOffcanvasNav('#main-nav', {
            disableAt       : false,
            customToggle    : '.menu_icon',
            levelSpacing    : 40,
            navTitle        : 'All',
            levelTitles     : true,
            levelTitleAsBack: true,
            pushContent     : '#container',
            labelClose      : false
        });
    })(jQuery);
});