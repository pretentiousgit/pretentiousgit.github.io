$(document).ready(function(e){

// code i ripped from here [https://codepen.io/MandyMadeThis/pen/dGQxaN]
// to get project toggle-filtering working

var box = $('.box'),
    boxContainer = $('.boxes'),
    section = $('.sort-section'),
    containerHeight = $('.adjustable-height'),
    boxClassFilter,
    showThese;

$('button').on('click', function(){  
    boxClassFilter = $(this).data('filter');
    showThese = boxContainer.find('.box' + '.' + boxClassFilter);
    var sectionHeight = section.height();

    $('.tag-container').find('button.selected').removeClass();
    $(this).toggleClass('selected');
    
    var tl = new TimelineLite()
    .to(box, 0.5, {scale:0, opacity:0, ease: Power3.easeOut})
    .set(box, {display:'none'})
    .set(showThese, {display:'block'})
    .to(showThese, 0.8, {scale:1, opacity:1, ease: Power3.easeOut}, '+=0.1')
    .fromTo(section, 1, {height:'sectionHeight', ease: Power3.easeOut},  {height:'initial', ease: Power3.easeIn}, '-=1');

    if (boxClassFilter == 'all') {    
        var allTL = new TimelineLite()
            .set(section, {height:sectionHeight})
            .to(box, 0.5, {scale:0, opacity:0, ease: Power3.easeOut})
            .set(box, {display:'none'})
            .set(box, {display:'block'})
            .to(box, 0.8, {scale:1, opacity:1, ease: Power3.easeOut}, '+=0.1')
           .fromTo(section,1 , {height:'sectionHeight', ease: Power3.easeOut},  {height:'initial', ease: Power3.easeIn}, '-=1');
    }
          
});

});
