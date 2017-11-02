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

	this.onDragEnd = function(dragObject, dropElem) {
		// dragObject.elem.style.display = 'none';
		console.log(JSON.stringify(dragObject))
		


		var box = document.getElementById("canvasBg");
		box.outerHTML;
			console.log(box.clientWidth + " " + box.clientHeight);
		
		
	};

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
