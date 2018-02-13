"use strict";


(function(){
	chrome.storage.sync.get(['blurOnDefault', 'blurAmount'], function(values){
		window.imageBlurOpacityAmount = values.blurAmount || 6;
	});

	function blur(image) {
		if (image.id != window.cloneImageId) {
		  image.style.filter = `blur(${window.imageBlurOpacityAmount}px) opacity(1)`;
	  }
	}

	function show(image) {
		if (image.id != window.cloneImageId) {
		  image.style.filter = "opacity(1)";
	  }
	}

	function blurAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			  blur(image);
	  }
	  window.imageBlurState = "blurred";
	}

	function revealAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
	    	show(image);
	  }
	  window.imageBlurState = "revealed";
	}

	function reveal(e) {
		if (window.imageBlurState === "blurred") {
		    if (e.shiftKey && e.altKey) {
				e.preventDefault();
				e.stopPropagation();
		        show(e.target);

				} else if (e.altKey) {
					e.preventDefault();
					e.stopPropagation();
					revealSome(e);
				}
		}
	}

	function unreveal(e) {
		if (window.imageBlurState === "blurred") {
			blur(e.target);
		}
	}

	function initialBlurAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true"
		     && image.id != window.cloneImageId) {
				blur(image);
				image.addEventListener('click', reveal);
				image.addEventListener('mouseout', unreveal);
				image.dataset.imageBlurOnLoadUpdateOccured = true;
			}
	  	}
	  	window.imageBlurState = "blurred";
	}

	function removeBGImages() {
		const everything = document.querySelectorAll("*");
		for (item of everything) {
			if (item.style && image.id != window.cloneImageId) {
				item.style.backgroundImage = "none";
			}
		}
	}

	function initialLoadRevealAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true"
		      && image.id != window.cloneImageId) {
	    		show(image);
	    		image.addEventListener('click', reveal);
				image.addEventListener('mouseout', unreveal);
	    		image.dataset.imageBlurOnLoadUpdateOccured = true;
	    	}
	  	}
	  	window.imageBlurState = "revealed";
	}

	function onPageLoad(e) {
		chrome.storage.sync.get(['blurOnDefault', 'blurAmount'], function(values){
			if (values.blurOnDefault) {
				initialBlurAll();
			} else {
				initialLoadRevealAll();
			}
			window.imageBlurOpacityAmount = values.blurAmount || 6;
		});
	}

	function repositionMask(e) {
		const img = e.target;
    const ir = img.getBoundingClientRect();
		 img.style["webkitMaskPosition"] = (e.clientX - ir.left) + "px " +
		   (e.clientY - ir.top) + "px";
	}

	function revealSome(e) {
		const img = e.target;
		const div = document.getElementById(window.maskDivId);
		window.cloneImageId = "imageBlur-copy";
		const masked = document.getElementById(window.cloneImageId);
		if (masked) {
			masked.remove();
		}
		const ir = img.getBoundingClientRect();
		div.style.left =   (ir.left + window.pageXOffset) + "px";
		div.style.top = 	(ir.top + window.pageYOffset) + "px";
		div.style.display = "inline-block";
		div.style["zIndex"] = "100";

		const clone = img.cloneNode(true);
    clone.id = window.cloneImageId; // avoid duplicate id in clone
		clone.style.cursor = "crosshair";
		clone.style.webkitMaskRepeat = "no-repeat";
		const maskUrl = chrome.extension.getURL("assets/mask.png")
		clone.style.webkitMaskImage = "url('" + maskUrl + "')";
		clone.style.filter = "none";
		clone.addEventListener("mousemove", repositionMask);
		clone.addEventListener("click", stopRevealingSome);
		div.appendChild(clone);
		repositionMask(e);
	}

	function stopRevealingSome(img) {
		const div = document.getElementById(window.maskDivId);
		div.style.display = "none";
		if (img.id == window.cloneImageId) {
			img.style.display = "none";
		  img.remove();
	  }
	}

	function addMaskDivToPage(){
		window.maskDivId = "imageBlur-mask-div";
		const maskDiv = document.createElement("div");
		maskDiv.style = "position:absolute;";
		maskDiv.id = window.maskDivId;
		document.body.appendChild(maskDiv);
	}

	document.addEventListener('DOMContentLoaded', function(e) {
		addMaskDivToPage();
		onPageLoad(e);
		document.addEventListener('DOMNodeInserted', onPageLoad);
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		for (key in changes) {
			if (key === "blurAmount") {
				window.imageBlurOpacityAmount = changes[key].newValue;
			}
		}
	});

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request) {
				switch (request.status) {
					case 'blur':
						blurAll();
						break;
					case 'unblur':
						revealAll();
						break;
					case 'removeBGImages':
						removeBGImages();
						break;
				}
			}
		}
	);
})()
