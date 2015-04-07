$(function(){

function button3x(){

	var button = '<button>Click</button>';
	$('button').on('click', function(){
		$('.challenge-1').append(button).append(button).append(button);
	});
}
button3x();

function printNumbers(){

	var counter = 0;

	for(var i = 1; i <= 100; i++) {
		counter += 1;

		if (counter % 3 === 0 && counter % 5 === 0) {
			$('.challenge-2').append('<p>CracklePop</p>');
		} else if (counter % 5 === 0) {
			$('.challenge-2').append('<p>Pop</p>');
		} else if (counter % 3 === 0) {
			$('.challenge-2').append('<p>Crackle</p>');
		} else {
			$('.challenge-2').append('<p>' + counter + '</p>');
		}
	}
}

printNumbers();

});