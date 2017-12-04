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

	function revealButtonSet(e) {
		if (window.imageBlurState === "blurred") {
      window.blurTimer = setTimeout(() => {
        addRevealButton(e.target);
      }, 150);
    }
	}

	function addRevealButton(target) {
		console.dir(target)
		let rButton = document.createElement("button")
		rButton.innerText = "*";
		rButton.style.position = "fixed";
		rButton.style.top = target.x;
		rButton.style.left = target.y;
		document.body.appendChild(rButton);
		console.log(rButton);
	}

	function revealReset(e) {
		if (window.imageBlurState === "blurred") {
			clearTimeout(window.blurTimer);
			blur(e.target);
		}
	}

	function removeBGImages() {
		const everything = document.querySelectorAll("*");
		for (item of everything) {
			if (item.style) {
				item.style.backgroundImage = "none";
			}
		}
	}

	function initialBlurAll() {
		const images = document.querySelectorAll('img');
		for (const image of images) {
			if (image.dataset.imageBlurOnLoadUpdateOccured != "true") {
				blur(image);
				image.addEventListener('mouseover', revealButtonSet);
				image.addEventListener('mouseout', revealReset);
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
	    		image.removeEventListener('mouseover', revealButtonSet);
					image.removeEventListener('mouseout', revealReset);
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