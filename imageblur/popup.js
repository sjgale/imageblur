function blur(e){
  sendMessage(e.target.id);
}

function removeBGImages(e) {
  sendMessage('removeBGImages');
}

function saveChanges(e) {
  // Get the checkbox value
  var blurOnDefault = e.target.checked;
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'blurOnDefault': blurOnDefault}, () => {
    // Notify that we saved.
    message('Settings saved');
  });
}

function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { status: message }, response => {
      // console.dir(response);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  defaultBlur = document.getElementById('defaultBlur');

  defaultBlur.addEventListener("click", saveChanges, false);
  document.getElementById('blur').addEventListener('click', blur, false);
  document.getElementById('unblur').addEventListener('click', blur, false);
  document.getElementById('removeBGImages').addEventListener('click', removeBGImages, false);

  chrome.storage.sync.get('blurOnDefault', function(values){
    defaultBlur.checked = values.blurOnDefault;
  });
});