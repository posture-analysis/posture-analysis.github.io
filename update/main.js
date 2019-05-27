$(document).ready(function(){
	var firebaseRef = firebase.database().ref();

	var a = 0;
	var b = 0;
	var c = 0;

	firebaseRef.child('PitchA').set(a);
	firebaseRef.child('PitchB').set(b);
	firebaseRef.child('PitchC').set(c);

	$(document).on('input', '.acc1 .slider', function() {
		let A = Math.floor($(this).val());
    	$('.acc1 p span').text(A);
	});

	$(document).on('change', '.acc1 .slider', function() {
		a = Math.floor($(this).val());
		firebaseRef.child('PitchA').set(a);
	});

	$(document).on('input', '.acc2 .slider', function() {
		let B = Math.floor($(this).val());
    	$('.acc2 p span').text(B);

    	$('.acc1 .slider').attr('min',B-90);
    	$('.acc1 .slider').attr('max',B+90);
    	$('.acc1 .slider').attr('value',a+B-b);
    	$('.acc1 p span').text(a+B-b);
    	$('.acc1 .min').text(B-90);
    	$('.acc1 .max').text(B+90);

    	$('.acc3 .slider').attr('min',B-90);
    	$('.acc3 .slider').attr('max',B+90);
    	$('.acc3 .slider').attr('value',c+B-b);
    	$('.acc3 p span').text(c+B-b);
    	$('.acc3 .min').text(B-90);
    	$('.acc3 .max').text(B+90);
	});
	$(document).on('change', '.acc2 .slider', function() {
		a = Math.floor($('.acc1 .slider').attr('value'));
		b = Math.floor($('.acc2 .slider').val());
		c = Math.floor($('.acc3 .slider').attr('value'));
		firebaseRef.child('PitchA').set(a);
		firebaseRef.child('PitchB').set(b);
		firebaseRef.child('PitchC').set(c);
	});

	$(document).on('input', '.acc3 .slider', function() {
		let C = Math.floor($(this).val());
    	$('.acc3 p span').text(C);
	});

	$(document).on('change', '.acc3 .slider', function() {
		c = Math.floor($(this).val());
		firebaseRef.child('PitchC').set(c);
	});
	//firebaseRef.child('PitchA').set();
});