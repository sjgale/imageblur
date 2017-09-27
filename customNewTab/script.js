const countDownDate = new Date("June 22, 2017 10:10:00").getTime();

const interval = setInterval(function() {

  var now = new Date().getTime();
  var distance = countDownDate - now;

  const timeLeft = {}; 
  timeLeft['days'] = Math.floor(distance / (1000 * 60 * 60 * 24));
  timeLeft['hours'] = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  timeLeft['minutes'] = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  timeLeft['seconds'] = Math.floor((distance % (1000 * 60)) / 1000);

  const countdown = document.getElementById("countdown");
  if (countdown.hasChildNodes()) {
  	var children = countdown.childNodes;
  	for (child of children) {
  		if (timeLeft.hasOwnProperty(child.id)) {
        child.innerHTML = timeLeft[child.id];
      }
  	}
  }

  if (distance < 0) {
    clearInterval(interval);
    document.getElementById("demo").innerHTML = "We're Going! (or gone)";
  }

}, 1000);

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('apps').addEventListener('click', function() {
    chrome.tabs.update({ url: 'chrome://apps' });
  });
  document.getElementById('bookmarks').addEventListener('click', function() {
    chrome.tabs.update({ url: 'chrome://bookmarks' });
  });
  document.getElementById('history').addEventListener('click', function() {
    chrome.tabs.update({ url: 'chrome://history' });
  });
});