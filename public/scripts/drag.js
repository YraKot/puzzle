

var els = document.getElementsByClassName('draggable');
  
function startDrag(evt) {
	

	var diffX = evt.clientX - this.offsetLeft,
		diffY = evt.clientY - this.offsetTop,
		that = this; 
	

	function moveAlong(evt) {
		that.style.left = (evt.clientX - diffX) + 'px';
		that.style.top = (evt.clientY - diffY) + 'px';
	}
	
	function stopDrag() {
		document.removeEventListener('mousemove', moveAlong);
		document.removeEventListener('mouseup', stopDrag);
	}
	
	document.addEventListener('mouseup', stopDrag);
	document.addEventListener('mousemove', moveAlong);
}

for (var i = 0; i < els.length; i++) {
	els[i].addEventListener('mousedown', startDrag);
}
