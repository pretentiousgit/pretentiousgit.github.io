// cube-control.js
'use strict';
(function() {

// button control panel starts here 
    var scale = 1;
    var h_click=0;
    var v_click=0;

// ToDo
// Implement eight-point-per-face controls for spinning.
     $(document).on('click','.edge', function(e){
        var degreeRotate = [90, 180, 270, 360];
        
        var val = $(this).attr('type');
        var cube = $('#cube');

        var prev_transform = cube.css('transform');
        var prev_rotation = prev_transform.match(/rotate3d\(.*?\)/g) || "rotate3d(0,0,0,0)";
        var prev_scale = prev_transform.match(/scale3d\(.*?\)/g) || "scale3d(0,0,0)";
        var prev_matrix = prev_transform.match(/matrix3d\(.*?\)/g) || "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
        var rotation = 0;

        // on each button click
        // figure out which face is forward
        // increment 90deg in appropriate direction
        // add to the button counter
        // figure out if it is for 1 2 3 4
        // set rotation to appropriate angle

        switch(val){
            case 'lc': // left
                h_click++;
                console.log('h_click', h_click);
                rotation = h_click * 90;
                cube.css('-webkit-transform', 'rotateY('+rotation+'deg)');
                break;
            case 'tc': // up
                v_click++;
                console.log('v_click', v_click);
                rotation = v_click * 90;
                cube.css('-webkit-transform', 'rotateX('+rotation+'deg)');
                break;
            case 'rc': // right
                h_click--;
                console.log('h_click', h_click);
                rotation = h_click * 90;
                cube.css('-webkit-transform', 'rotateY('+rotation+'deg)');
                break;
            case 'bc': // down
                v_click--;
                console.log('v_click', v_click);
                rotation = v_click * 90;
                cube.css('-webkit-transform', 'rotateX('+rotation+'deg)');
                break;
        }
        return false;
    });

})();