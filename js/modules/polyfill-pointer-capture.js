(function () {
	'use strict';

	// Need to figure out some way to test if this is needed.
	// https://stackoverflow.com/q/64017560/11240898
	if (
	Element.prototype.setPointerCapture === undefined ||
	Element.prototype.hasPointerCapture === undefined ||
	Element.prototype.releasePointerCapture === undefined)
	{
	  console.log('polyfill-pointer-capture');

	  var _Element$prototype =



	  Element.prototype,set = _Element$prototype.setPointerCapture;_Element$prototype.hasPointerCapture;var release = _Element$prototype.releasePointerCapture;

	  var targets = {};
	  var captures = {};

	  console.log('setPointerCapture', Element.prototype.setPointerCapture === undefined);
	  if (Element.prototype.setPointerCapture === undefined) {
	    Element.prototype.setPointerCapture = function setPointerCapture(pointerId) {
	      if (pointerId in captures) {
	        if (document.contains(this)) {
	          captures[pointerId] = this;
	          return set.call(targets[pointerId], pointerId);
	        } else {
	          throw new TypeError("Element not in valid location");
	        }
	      } else {
	        return set.call(this, pointerId);
	      }
	    };
	  }

	  console.log('hasPointerCapture', Element.prototype.hasPointerCapture === undefined);
	  if (Element.prototype.hasPointerCapture === undefined) {
	    Element.prototype.hasPointerCapture = function hasPointerCapture(pointerId) {
	      if (pointerId in captures) {
	        return captures[pointerId] == this;
	      } else {
	        // return has.call(this, pointerId)
	        return false;
	      }
	    };
	  }

	  console.log('releasePointerCapture', Element.prototype.releasePointerCapture === undefined);
	  if (Element.prototype.releasePointerCapture) {
	    Element.prototype.releasePointerCapture = function releasePointerCapture(pointerId) {
	      if (pointerId in captures) {
	        if (this.hasPointerCapture(pointerId)) {
	          captures[pointerId] = null;
	          return release.call(targets[pointerId], pointerId);
	        }
	      } else {
	        return release.call(this, pointerId);
	      }
	    };
	  }

	  var registerPointer = function registerPointer(event) {
	    if (event.pointerType == "touch" || event.pointerType == "pen") {
	      targets[event.pointerId] = event.target;
	      captures[event.pointerId] = null;
	    }
	  };

	  var redirectPointer = function redirectPointer(event) {
	    if (captures[event.pointerId] != null && captures[event.pointerId] != event.target) {
	      // Stop the original event
	      event.preventDefault();
	      event.stopPropagation();

	      // Redispatch a new, cloned event
	      captures[event.pointerId].dispatchEvent(new PointerEvent(event.type, event));
	    }
	  };

	  var redirectAndUnregisterPointer = function redirectAndUnregisterPointer(event) {
	    redirectPointer(event);
	    delete targets[event.pointerId];
	    delete captures[event.pointerId];
	  };

	  addEventListener("pointerdown", registerPointer, { capture: true, passive: true });
	  addEventListener("pointermove", redirectPointer, { capture: true, passive: false });
	  addEventListener("pointerup", redirectAndUnregisterPointer, { capture: true, passive: false });
	  addEventListener("pointercancel", redirectAndUnregisterPointer, { capture: true, passive: false });
	}

})();
