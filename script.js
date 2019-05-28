$(document).ready(function(){

	//Notifications
	if(!Notification){
		alert('Notifications are not available with your browser.');
		return;
	}

	if(Notification.permission !== "granted"){
		Notification.requestPermission();
	}

	function notify(title,message,link,link_flag = 1){
		if (Notification.permission !== "granted")
    		Notification.requestPermission();
  		else {
    		var notification = new Notification(title, {
      			icon: 'http://abhinavthukral.in/lab/Workaholic/img/notification_logo.png',
      			body: message,
    		});

    		notification.onclick = function () {
    			if(link_flag==1)
      				window.open(link);      
    		};
  		}
	}

var firebaseRef = firebase.database().ref();
var plotSize = [350,350];
var space = 20;
var plotStart = '<svg width="'+plotSize[0]+'" height="'+plotSize[1]+'">';
var plotEnd = "</svg>";

var goodCount = 1;
var avgCount = 1;
var badCount = 1;

function findMapping(x1,x2,y1,y2){
	x1 = Math.floor(x1);
	x2 = Math.floor(x2);
	y1 = Math.floor(y1);
	y2 = Math.floor(y2);
	let m;
	if(x2 - x1!=0)
		m = (y2 - y1)/(x2 - x1);
	else{
		console.log('Mapping Warning');
		m = 100;
	}
	let c = y1 - m*x1;
	return [m,c];
}

function map(x, params){
	return Math.floor(x*params[0] + params[1]);
}

function plotMappings(val){
	//generating plotting points
	acc_pos = [0,1,2];
	val = [val[1]-val[0],0,val[2]-val[1]];
	xmapping = findMapping(-90,90,space,plotSize[0]-space);
	ymapping = findMapping(acc_pos[0],acc_pos[2],space,plotSize[1]-space);

	let mark = [];
	for(let i=0;i<val.length;i++){
		mark.push(map(val[i],xmapping));
		mark.push(map(acc_pos[i],ymapping));
	}
	//get plotting values
	let xc = 2*mark[2] - mark[0]/2 - mark[4]/2;
	let yc = 2*mark[3] - mark[1]/2 - mark[5]/2;
	mark.push(xc);
	mark.push(yc);
	return mark;
}

function getStringPath(arr){
	return "M " + arr[0].toString() + " " + arr[1].toString() + " Q " + arr[6].toString() + " " + arr[7].toString() + " " + arr[4].toString() + " " + arr[5].toString();
}

function plot(val){
	let mapped = plotMappings(val);
	let update = getStringPath(mapped);
	path.animate({ d: update }, 500);
	marker1.animate({x: mapped[0]-8, y: mapped[1]-8}, 500);
	marker2.animate({x: mapped[2]-8, y: mapped[3]-8}, 500);
	marker3.animate({x: mapped[4]-8, y: mapped[5]-8}, 500);
	$('#console').css('transform','translate(-50%,0) rotate('+ -1*(val[1]) +'deg)');
}

function classify(pitch){
	let nodeDiffA = Math.abs(pitch[1] - pitch[0]);
	let nodeDiffB = Math.abs(pitch[2] - pitch[1]);
	let check;
	if(pitch[1]>70){
		check = Math.abs(90 - pitch[1]);
	}
	else{
		check = pitch[1];
	}
	if(check>=0 && check<=20){
		if(nodeDiffA<=15&&nodeDiffB<=15)
			return 0;
		else if(nodeDiffA<=30&&nodeDiffB<=30)
			return 1;
		else
			return 2;
	}
	else if(check>20 && check<=40){
		if(nodeDiffA<=5&&nodeDiffB<=5)
			return 1;
		else if(nodeDiffA<=10&&nodeDiffB<=10)
			return 2;
		else
			return 2;
	}
	else if(check>40){
		return 2;
	}

	return 3;
}

var notified = 0;

function updateClass(c){
	if(c==0){
		$('.class span').text('Good');
	}
	else if(c==1){
		$('.class span').text('Average');
	}
	else if(c==2){
		$('.class span').text('Bad');
		// if(notified==0){
		// 	notify("Posture Analysis","Bad Posture Detected.","");
		// 	notified=1;
		// 	setTimeout(function(){
		// 		notified=0;
		// 	},1*60*1000);
		// }
	}
	else{
		$('.class span').text('Unsure');
	}
}

function updateVals(p){
	$('.acc1 .accelerometer').css('transform','rotate('+-1*pitch[0]+'deg)');
	$('.acc1 .pitch span').text(pitch[0]);
	$('.acc2 .accelerometer').css('transform','rotate('+-1*pitch[1]+'deg)');
	$('.acc2 .pitch span').text(pitch[1]);
	$('.acc3 .accelerometer').css('transform','rotate('+-1*pitch[2]+'deg)');
	$('.acc3 .pitch span').text(pitch[2]);
}

var s = Snap('#console');
var initPitch = [0, 0, 0];
var initMap = plotMappings(initPitch);
var path = s.path(getStringPath(initMap));
path.attr({
	fill: "transparent",
	stroke: "rgba(236, 204, 104,1.0)",
	strokeWidth: 5
});
var marker1 = s.rect(initMap[0]-8,initMap[1]-8,16,16,8,8);
marker1.attr({
	fill:"#4a69bd"
});
var marker2 = s.rect(initMap[2]-8,initMap[3]-8,16,16,8,8);
marker2.attr({
	fill:"#eb4d4b"
});
var marker3 = s.rect(initMap[4]-8,initMap[5]-8,16,16,8,8);
marker3.attr({
	fill:"#6ab04c"
});

firebaseRef.on('value', function(data){
	read = data.toJSON();	
	pitch = [read.PitchA,read.PitchB,read.PitchC];
	let pClass = classify(pitch);
	updateClass(pClass);
	plot(pitch);
	updateVals(pitch);
});

});