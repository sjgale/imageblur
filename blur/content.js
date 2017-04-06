(function(){
	function blur(image) {
		image.style.filter = "blur(6px) opacity(1)";
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
		    window.blurTimer = setTimeout(() => {
		        show(e.target);
		    }, 500);
		}
	}

	function unreveal(e) {
		if (window.imageBlurState === "blurred") {
			clearTimeout(window.blurTimer);
			blur(e.target);
		}
	}

	function initialBlurAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true") {
				console.log(image.dataset.imageBlurOnLoadUpdateOccured != true, image.dataset.imageBlurOnLoadUpdateOccured);
				blur(image);
				image.addEventListener('mouseover', reveal);
				image.addEventListener('mouseout', unreveal);
				image.dataset.imageBlurOnLoadUpdateOccured = true;
			}
	  	}
	  	window.imageBlurState = "blurred";
	}

	function initialLoadRevealAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true") {
	    		show(image);
	    		image.addEventListener('mouseover', reveal);
				image.addEventListener('mouseout', unreveal);
	    		image.dataset.imageBlurOnLoadUpdateOccured = true;
	    	}
	  	}
	  	window.imageBlurState = "revealed";
	}

	function onPageLoad(e) {
		chrome.storage.sync.get('blurOnDefault', function(values){
			if (values.blurOnDefault) {
				initialBlurAll();
			} else {
				initialLoadRevealAll();
			}
		});
	}

	document.addEventListener('DOMContentLoaded', function(e) {
		onPageLoad(e);
		document.addEventListener('DOMNodeInserted', onPageLoad);
	});

	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log("Blurring...");
			
			if (request.status === "blur") {
				blurAll();
			} else if (request.status === "unblur") {
				revealAll();
			}

			sendResponse("Complete");
		}
	);
})()