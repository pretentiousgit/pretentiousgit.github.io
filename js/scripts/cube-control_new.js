// cube-control.js
'use strict';
(function() {
    // var $ = require('jquery');
// button control panel starts here 
    var scale = 1;
    var h_click=0;
    var v_click=0;

    var degreeRotate = [90, 180, 270, 360];
        
    var base_rotation = "rotate3d(0,0,0,0)";
    var base_scale = "scale3d(0,0,0)";
    var base_matrix = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";

    var h_rotate = 0;
    var v_rotate = 0;
    var cube  = $('#cube');

// ToDo
// Implement eight-point-per-face controls for spinning.
    // cube.on('click', '.lc', function(e){
    //     console.log('click left', e);
    //     h_click = (h_click < 4) ? h_click++ : 0;
    //     rotation = h_click * 90;
    //     this.css('-webkit-transform', 'rotateY('+rotation+'deg)');
    // });

    $(document).on('click', '.corner', function(e){
        switch($(this).attr('type')){
            case 'tr' :
                console.log('top r');

                break;

            case 'tl' :
                console.log('top l');
                break;

            case 'br' :
                console.log('bottom r');
                break;

            case 'bl' :
                console.log('bottom l');
                break;
        }
        return false;
    });
    
    $(document).on('click', '.edge', function(e){
        // console.log('clicked edge', e.currentTarget);
        switch($(this).attr('type')){
            case 'tc' :
                console.log('top centre');
                
                v_click++;
                v_rotate = v_click * 90;
                cube.css('-webkit-transform', 'rotateX('+v_rotate+'deg)');
                cube.css('transform', 'rotateX('+v_rotate+'deg)');
                console.log(v_rotate);
                break;

            case 'rc' :
                console.log('right centre');
                h_click--;
                h_rotate = h_click * 90;
                cube.css('-webkit-transform', 'rotateY('+h_rotate+'deg)');
                console.log(h_rotate);
                break;

            case 'lc' :
                console.log('left centre');
                h_click++;
                h_rotate = h_click * 90;
                cube.css('-webkit-transform', 'rotateY('+h_rotate+'deg)');
                console.log(h_rotate);
                break;

            case 'bc' :
                console.log('bottom centre');
                v_click--;
                v_rotate = v_click * 90;
                cube.css('-webkit-transform', 'rotateX('+v_rotate+'deg)');
                console.log(v_rotate);
                break;
        }
        return false;
    });
})();