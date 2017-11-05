

var DragManager = new function() {
	  /**
	   * {
	   *   elem - елемент на якому була зажата миша
	   *   avatar - аватар
	   *   downX/downY - координати на яких був mousedown
	   *   shiftX/shiftY - кут зсуву
	   * }
	   */
	var dragObject = {};
	var createdParts = [];
	var self = this;

	function onMouseDown(e) {

		if (e.which != 1){
			//права кнопка нажата
			return;
		}
		var elem = e.target.closest('.draggable');
		if (!elem){ 
			return;
		}
		dragObject.elem = elem;
		//запамятати що елемент був нажатий на координатах pageX/pageY
		dragObject.downX = e.pageX;
		dragObject.downY = e.pageY;

		return false;
	}

	function onMouseMove(e) {
		if (!dragObject.elem) return; // елемент не зажатий

		if (!dragObject.avatar) { // якщо перенос не почався
			var moveX = e.pageX - dragObject.downX;
			var moveY = e.pageY - dragObject.downY;
			// якщо зажата миша пересунулося недостатньо далеко
			// if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
			// 	return;
			// }
		// початок переносу
		dragObject.avatar = createAvatar(e); 
		if (!dragObject.avatar) { // відміна переносу, неможливо захопити цю частину елементу
			dragObject = {};
			return;
		}
		// аватар створений успішно
		var coords = getCoords(dragObject.avatar);
		dragObject.shiftX = dragObject.downX - coords.left;
		dragObject.shiftY = dragObject.downY - coords.top;

		startDrag(e); // відображення початку переносу
	}

	// перенос обєкта при кожному русі миші
	dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
	dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

	return false;
	}

	function onMouseUp(e) {
		e.target.classList.add('puzzle')
		var ind = createdParts.indexOf(e.target.src);
		console.log(ind)
		if (ind !== -1) {
			createdParts[ind] = null;
		};
		console.log(createdParts)
		

		if (dragObject.avatar) { // якшо перенос працює
			finishDrag(e);
		}
		// перенос або почався або закінчився
		//очищення стану переносу
		dragObject = {};
	}

	function finishDrag(e) {
		var dropElem = findDroppable(e);

		if (!dropElem) {
			self.onDragCancel(dragObject);
		} else {
			self.onDragEnd(dragObject, dropElem);
		}
	}

	function createAvatar(e) {
		// запамятати старі властивості для повернення до них при відміна
		var avatar = dragObject.elem;
		var old = {
			parent: avatar.parentNode,
			nextSibling: avatar.nextSibling,
			position: avatar.position || '',
			left: avatar.left || '',
			top: avatar.top || '',
			zIndex: avatar.zIndex || ''
		};
		// функция для відмини переносу
		avatar.rollback = function() {
			old.parent.insertBefore(avatar, old.nextSibling);
			avatar.style.position = old.position;
			avatar.style.left = old.left;
			avatar.style.top = old.top;
			avatar.style.zIndex = old.zIndex
		};

		return avatar;
	}

	function startDrag(e) {
		var avatar = dragObject.avatar;
		// ініціалізація початку переносу
		
		document.body.appendChild(avatar);
		avatar.style.zIndex = 9999;
		avatar.style.position = 'absolute';
	}

	function findDroppable(event) {
		// сховати переносимий елемент
		dragObject.avatar.hidden = true;
		// console.log(dragObject);
		var elem = document.elementFromPoint(event.clientX, event.clientY);
		
		dragObject.avatar.hidden = false;

		if (elem == null) {
			// якшо курсор миші за краєм вікна
			return null;
		}
		return elem.closest('.droppable');
	}

	document.onmousemove = onMouseMove;
	document.onmouseup = onMouseUp;
	document.onmousedown = onMouseDown;

	var box = document.getElementById('canvasBg');


	var topCorner = {
		top: box.offsetTop ,
		left : box.offsetLeft 
	}

	this.onDragEnd = function(dragObject, dropElem) {
		// dragObject.elem.style.display = 'none';
		//console.log(JSON.stringify(dragObject));
		
		
		
			
		var elem = dragObject.elem;
		var box = document.getElementsByClassName('wrap')[0];
		var itemCorner = {
			top: elem.offsetTop - box.offsetTop ,
			left : elem.offsetLeft - box.offsetLeft
		}
	

		var left = (itemCorner.left - topCorner.left) % elem.clientWidth  ;
		var top = (itemCorner.top - topCorner.top) % elem.clientHeight;

		left = left > elem.clientWidth / 2  ?  left - elem.clientWidth : left  ;
		top = top > elem.clientHeight / 2 ? top - elem.clientHeight : top ;  

		
		
		if (Math.abs(top) < elem.clientHeight / 2) {
			if (Math.abs(left)< elem.clientWidth / 2) {
				 
				
				 dragObject.elem.style.left =  parseInt(dragObject.elem.style.left) -  left+ 'px';
				 dragObject.elem.style.top = parseInt(dragObject.elem.style.top) -  top  + 'px';
				
				 var i = Math.ceil(  parseInt(dragObject.elem.style.left)/ elem.clientWidth)  -1;
				 var j = Math.ceil(parseInt(dragObject.elem.style.top)  / elem.clientHeight) -1;
				

				 createdParts[i+ j*count - 1] = elem.src;
		
				 check(unsortedParts, createdParts) && clear()
				 
			}
		}

		// var box = document.getElementById("canvasBg");
		// box.outerHTML;
		
		
	};

	function clear() {
		
		var container = document.getElementById("pieces");
		createdParts = [];
		container.innerHTML = "";
	}

	document.getElementById("help").onclick = function bot() {

		var el = document.querySelector('img.puzzle');
		if (el) {
			console.log('tr')
			var ind = unsortedParts.indexOf(el.src);
			
					 moveTo( el, ind);

		}
		

	}

	function moveTo(el, ind) {
		
		var i,j;
		i = ind % count;
		j = (ind - i)/count;

		console.log()
	
		el.style.top = topCorner.top + el.clientHeight*j + 'px' ;
		el.style.left = topCorner.left + el.clientWidth*i + 'px';
		el.classList.remove('puzzle')

		createdParts[ind] = el.src;
		
		
		check(unsortedParts, createdParts) ;

	}

	function check(a,b) {
		
		for (var i=0; i< a.length; i++) {
			if (a[i] !== b[i]) {
				
				return false; 
			}
		}
		return true;
	}
	this.onDragCancel = function(dragObject) {
		// dragObject.avatar.rollback();
		// console.log('rollback')
	};

};


function getCoords(elem) { // непрацює в -IE8-
	var box = elem.getBoundingClientRect();

	return {
	top: box.top + pageYOffset,
	left: box.left + pageXOffset
	};
}
