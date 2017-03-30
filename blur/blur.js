(function(){
	console.log("blurring!");
  // Select all image tags and put them in an array
  var images = Array.prototype.slice.call(document.querySelectorAll('img'));

  // Loop through array, blurring all images
  var i = 0;
  for (i = 0; i < images.length; i++) {
    images[i].style.filter = "blur(7px)";
  }
})();