function hex() {
	var d = new Date(),
		h = d.getHours(),
		m = d.getMinutes(),
		s = d.getSeconds();
	
	//add zero to the left of the numbers if they are single digits
	if(h <= 9) h = '0'+h;
	if(m <= 9) m = '0'+m;
	if(s <= 9) s = '0'+s;
	
	var color = "#" + h + m + s;

	var elem = document.getElementById("hex");
	elem.style.background = color;
	elem.innerHTML = color;
	
	setTimeout( hex , 1000);
}

hex();


