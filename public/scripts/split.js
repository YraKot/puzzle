var unsortedParts;
var count = 2;
document.getElementById("play").onclick = function (){
	clear();
	var imageLoader = document.getElementById('imageLoader');
		imageLoader.addEventListener('change', handleImage, false);
	var canvas = document.createElement("canvas");
	// var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var parts = [], count = 2;
	
	var img = new Image();
	img.addEventListener('load', splitImg, false);
	img.src = "./images/default.jpg";

	/// set default background img
	var el = document.getElementById("canvasBg");
		el.style.backgroundImage = "url(" + img.src + ")";
		
	// var css = {
	// 		opacity: "0.5",
	// 		backgroundRepeat: "no-repeat",
	// 		// backgroundPosition: "50% 0",
	// 		// backgroundSize: "cover"
	// 	}
	// for(i in css){
	// 	el.style[i] = css[i];
	// }

	function handleImage(e){
		var reader = new FileReader();
		reader.onload = function(event){
		
		/// iimage onload and set to drop
			img = new Image();
			
			img.onload = splitImg;
				
			img.src = event.target.result;

			var el = document.getElementById("canvasBg");
			el.style.backgroundImage = "url(" + img.src + ")";
		}
		var file = document.querySelector('input[type=file]').files[0];
		reader.readAsDataURL(file);     
	}

	function clear() {
		var container = document.getElementById("pieces");
		container.innerHTML = "";
	}

	

	function splitImg() {
		// alert(this.width + " " + this.height);
		parts = [];
		// var width = Math.floor(img.width / count);
		// var height = Math.floor(img.height / count);
		
		
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

				// console.log("xPos: " + xPos + "  yPos: " + yPos);
				// console.log("canvas w " + canvas.width + " canvas h " + canvas.height );
				// console.log("drW: " + drW + " drH " + drH);
				// console.log("------------");

				ctx.drawImage(img, xPos, yPos, drW, drH);
				
				parts.push( canvas.toDataURL() ); 

				// console.log(canvas.toDataURL())
				// console.log(parts);
			}
		}
       unsortedParts = parts.slice();
		
		shuffle(parts);
		draw();
		
		
	} 
///////////////////////
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
	  
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
	  
		  // Pick a remaining element...
		  randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex -= 1;
	  
		  // And swap it with the current element.
		  temporaryValue = array[currentIndex];
		  array[currentIndex] = array[randomIndex];
		  array[randomIndex] = temporaryValue;
		}
	  
		return array;
	}
	///
	function draw() {
		clear();
		var cont = document.getElementById('canvasBg')
		for(var i = 0; i < count * count; i++ ){
			var slicedImage = document.createElement("img");
				slicedImage.setAttribute('class', 'draggable puzzle');
			
			slicedImage.src = parts[i];
			
			slicedImage.style.width = parseInt(cont.clientWidth)/count + 'px';
			slicedImage.style.height = parseInt(cont.clientHeight)/count +'px';
			var div = document.getElementById("pieces");
			div.appendChild( slicedImage );
		}
		var elems = document.getElementsByClassName("draggable");
		for(i=0; i<elems.length; i++){
			elems[i].style.zIndex = "2";
			elems[i].style.position = "absolute";
			if(i % 2){
			  elems[i].style.top = i * 40 + 'px';
			  elems[i].style.left = i * 20 + 'px'; 
			} else {
			  elems[i].style.top = i * 40 + 'px' ;
			  elems[i].style.left = (i+1) * 10 + 'px';
			}
		}
	  

	}
	
}

