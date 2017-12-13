(function(){
	chrome.storage.sync.get(['blurOnDefault', 'blurAmount'], function(values){
		window.imageBlurOpacityAmount = values.blurAmount || 6;
	});

	function blur(image) {
		image.style.filter = `blur(${window.imageBlurOpacityAmount}px) opacity(1)`;
	}

	function show(image) {
		image.style.filter = "opacity(1)";
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
		        show(e.target);
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
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true") {
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
			if (item.style) {
				item.style.backgroundImage = "none";
			}
		}
	}

	function initialLoadRevealAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true") {
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

	document.addEventListener('DOMContentLoaded', function(e) {
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