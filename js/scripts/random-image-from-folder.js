// random-image-from-folder.js
'use strict';
(function() {

    // Pull a random image from images/gifs and assign to backside of cube

    $(document).on('load', function(){
        // Here we list the URL for our images, which I like to host on Imgur
        // sometimes we put descriptions in.

        var randImg = ["img1.gif", "img2.gif"];

        function getRandomImage(imgAr) {
            // path = path || 'images/'; // default path here
            var num = Math.floor( Math.random() * imgAr.length );
            var img = imgAr[ num ];
            var imgStr = '<img src="' + path + '" alt = "">';
            return imgStr;
        }

        $('.bottom').innerHtml(getRandomImage(randImg));
    });

})();