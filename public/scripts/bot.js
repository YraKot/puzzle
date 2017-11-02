function Help() {

	getNextMove(parts, img, count);
	draw();

}




// //bot
function getNextMove(parts, img) {
	var sortedParts= [];
	splitImg(img);

	for(var i=0; i< parts.length; i++) {
		if (parts[i] !== sortedParts[i]) {
			var j = sortedParts.indexOf(parts[i]);
			temp = parts[i];
			parts[i] = parts[j];
			parts[j]= temp;
			return parts;
		}
	}

	return sortedParts;
}

var sortedParts=[];

function splitImg(img) {

	var w = img.width / count;
	var h = img.height / count;

	var drW = w * count;
	var drH = h * count;


	for(var x=0; x < count; x++){
		for(var y = 0; y < count; y++){

			var xPos = -y * w;
			var	yPos= -x * h;

			canvas.width = w;
			canvas.height = h;

			ctx.drawImage(img, xPos, yPos, drW, drH);
			sortedParts.push( canvas.toDataURL('image/jpeg') );     // ("image/jpeg") for jpeg

		}
	}
}
