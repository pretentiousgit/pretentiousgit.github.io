// cube-control.js
// 'use strict';
// (function() {
console.log(document.getElementById('traqballStage'));
var options = {   
    stage:              "traqballStage", // id of block element. String, default value: <body>
    axis:               [0.5,1,0.25],    // X,Y,Z values of initial rotation vector. Array, default value: [1,0,0]
    angle:              0.60,            // Initial rotation angle in radian. Float, default value: 0.
    perspective:        700,             // Perspective. Integer, default value 700.
    perspectiveOrigin:  "50% 50%",       // Perspective Origin. String, default value "50% 50%".
    impulse:            true             // Defines if object receives an impulse after relesing mouse/touchend. Default value: true.
    // limitAxxis:         "x" | "y"        //limits the rotation to only one axxis.
    };

var mytraqball = new Traqball(options);

// button control panel starts here 
    // var scale = 1;
    // var h_click=0;
    // var v_click=0;

// ToDo
// Implement eight-point-per-face controls for spinning.
    //  $(document).on('click','.edge', function(e){
    //     var degreeRotate = [90, 180, 270, 360];
        
    //     var val = $(this).attr('type');
    //     var cube = $('#cube');

    //     var prev_transform = cube.css('transform');
    //     var prev_rotation = prev_transform.match(/rotate3d\(.*?\)/g) || "rotate3d(0,0,0,0)";
    //     var prev_scale = prev_transform.match(/scale3d\(.*?\)/g) || "scale3d(0,0,0)";
    //     var prev_matrix = prev_transform.match(/matrix3d\(.*?\)/g) || "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
    //     var rotation = 0;

    //     // on each button click
    //     // figure out which face is forward
    //     // increment 90deg in appropriate direction
    //     // add to the button counter
    //     // figure out if it is for 1 2 3 4
    //     // set rotation to appropriate angle

    //     switch(val){
    //         case 'lc': // left
    //             h_click++;
    //             console.log('lc', h_click);
    //             rotation = h_click * 90;

    //             if(h_click === 5 || h_click === -5){ 
    //                 h_click = 0;
    //                 cube.css('-webkit-transition', 'none');
    //                 cube.css('-moz-transition', 'none');
    //                 cube.css('-o-transition', 'none');
    //                 cube.css('-webkit-transform', 'rotateY(0deg)');
    //             } else {
    //                 cube.css('-webkit-transition', 'all 0.5s linear');
    //                 cube.css('-moz-transition', 'all 0.5s linear');
    //                 cube.css('-o-transition', 'all 0.5s linear');
    //                 cube.css('-webkit-transform', 'rotateY('+rotation+'deg)');
    //             }

    //             rotation = 0;
    //             break;
    //         case 'tc': // up
    //             v_click++;
    //             console.log('tc', v_click);
    //             rotation = v_click * 90;
                
    //             if(v_click === 5 || v_click === -5){ 
    //                 v_click = 0;
    //                 cube.css('-webkit-transition', 'none');
    //                 cube.css('-moz-transition', 'none');
    //                 cube.css('-o-transition', 'none');
    //                 cube.css('-webkit-transform', 'rotateX(0deg)');
    //             } else {
    //                 cube.css('-webkit-transition', 'all 0.5s linear');
    //                 cube.css('-moz-transition', 'all 0.5s linear');
    //                 cube.css('-o-transition', 'all 0.5s linear');
    //                 cube.css('-webkit-transform', 'rotateX('+rotation+'deg)');
    //             }
    //             rotation = 0;
    //             break;
    //         case 'rc': // right
    //             h_click--;
    //             console.log('rc', h_click);
    //             rotation = h_click * 90;

    //             if(h_click === 5 || h_click === -5){ 
    //                 h_click = 0;
    //                 cube.css('-webkit-transition', 'none');
    //                 cube.css('-moz-transition', 'none');
    //                 cube.css('-o-transition', 'none');
    //                 cube.css('-webkit-transform', 'rotateY(0deg)');
    //             } else {
    //                 cube.css('-webkit-transition', 'all 0.5s linear');
    //                 cube.css('-moz-transition', 'all 0.5s linear');
    //                 cube.css('-o-transition', 'all 0.5s linear');
    //                 cube.css('-webkit-transform', 'rotateY('+rotation+'deg)');
    //             }
    //             rotation = 0;
    //             break;
    //         case 'bc': // down
    //             v_click--;
    //             console.log('bc', v_click);
    //             rotation = v_click * 90;
    //              if(v_click === 5 || v_click === -5){ 
    //                 v_click = 0;
    //                 cube.css('-webkit-transition', 'none');
    //                 cube.css('-moz-transition', 'none');
    //                 cube.css('-o-transition', 'none');
    //                 cube.css('-webkit-transform', 'rotateX(0deg)');
    //             } else {
    //                 cube.css('-webkit-transition', 'all 0.5s linear');
    //                 cube.css('-moz-transition', 'all 0.5s linear');
    //                 cube.css('-o-transition', 'all 0.5s linear');
    //                 cube.css('-webkit-transform', 'rotateX('+rotation+'deg)');
    //             }
    //             rotation = 0;
    //             break;
    //     }
    //     return false;
    // });

// })();