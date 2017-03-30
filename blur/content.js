function blur() {
	const images = document.querySelectorAll('img');
	for (const image of images) {
    	image.style.filter = "brightness(250%) blur(7px) contrast(50%) opacity(1)";
    	image.addEventListener('mouseover', reveal);
    	image.addEventListener('mouseout', unreveal);
  	}
}

function unblur() {
	const images = document.querySelectorAll('img');
	for (const image of images) {
    	image.style.filter = "opacity(1)";
  	}
}

function onLoad(e) {
	chrome.storage.sync.get('blurOnDefault', function(values){
		if (values.blurOnDefault) {
			blur();
		} else {
			unblur();
		}
	});
}

function reveal(e) {
    window.blurTimer = setTimeout(() => {
        this.style.filter = "opacity(1)";
    }, 1200);
}

function unreveal(e) {
	clearTimeout(window.blurTimer);
	this.style.filter = "brightness(250%) blur(7px) contrast(50%) opacity(1)";
}

document.addEventListener('DOMContentLoaded', onLoad);
document.addEventListener('DOMSubtreeModified', onLoad);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("Blurring...");
		
		if (request.status === "blur") {
			blur();
		} else if (request.status === "unblur") {
			unblur();
		}

		sendResponse("Complete");
	}
);