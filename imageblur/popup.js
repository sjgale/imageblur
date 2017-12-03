// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   });
// });

function blur(e){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {'status': e.target.id}, function(response) {
      console.dir(response);
    });
  });
}

function saveChanges(e) {
  // Get the checkbox value
  var blurOnDefault = e.target.checked;
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'blurOnDefault': blurOnDefault}, function() {
    // Notify that we saved.
    message('Settings saved');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  defaultBlur = document.getElementById('defaultBlur');

  document.getElementById('blur').addEventListener('click', blur, false);
  document.getElementById('unblur').addEventListener('click', blur, false);
  defaultBlur.addEventListener('click', saveChanges, false);

  chrome.storage.sync.get('blurOnDefault', function(values){
    defaultBlur.checked = values.blurOnDefault;
  });
});