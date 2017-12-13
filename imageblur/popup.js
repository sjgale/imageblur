// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function blur(e){
  sendMessage(e.target.id);
}

function removeBGImages(e) {
  sendMessage('removeBGImages');
}

function saveChanges(e) {
  let blurOnDefault = document.getElementById('defaultBlur').checked;
  let blurAmount = document.getElementById('blurAmount').value;

  // Update UI
  document.getElementById('blurAmountText').innerText = blurAmount;

  // Save settings
  chrome.storage.sync.set({'blurOnDefault': blurOnDefault, 'blurAmount': blurAmount}, function() {
    message('Settings saved');
  });
}

function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { status: message }, response => {});
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let defaultBlur = document.getElementById('defaultBlur');
  let blurAmount = document.getElementById('blurAmount');
  let blurAmountText = document.getElementById('blurAmountText');

  defaultBlur.addEventListener("click", saveChanges, false);
  blurAmount.addEventListener("input", saveChanges, false)
  document.getElementById('blur').addEventListener('click', blur, false);
  document.getElementById('unblur').addEventListener('click', blur, false);
  document.getElementById('removeBGImages').addEventListener('click', removeBGImages, false);

  chrome.storage.sync.get(['blurOnDefault', 'blurAmount'], function(values){
    defaultBlur.checked = values.blurOnDefault;
    blurAmount.value = values.blurAmount || 6;
    blurAmountText.innerText = values.blurAmount || '6';
  });
});