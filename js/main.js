'use strict';

var deviceList = [];
var counter = 0;
var mainVideoStream; // Menyimpan stream untuk latar belakang video

window.onload = function() {
  getSources_();
};

function getSources_() {
  navigator.mediaDevices.enumerateDevices().then(function(devices) {
    var mainCameraFound = false;
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].kind === 'videoinput') {
        deviceList.push(devices[i]);
        if (!mainCameraFound) {
          requestVideo_(devices[i].deviceId, 'backgroundVideo');
          mainCameraFound = true;
        } else {
          requestVideo_(devices[i].deviceId, 'smallVideoContainer');
        }
      }
    }
  });
}

function requestVideo_(id, containerId) {
  navigator.mediaDevices.getUserMedia({
    video: {deviceId: {exact: id}},
    audio: false
  }).then(
    function(stream) {
      if (containerId === 'backgroundVideo') {
        mainVideoStream = stream;
      }
      getUserMediaOkCallback_(stream, containerId);
    },
    getUserMediaFailedCallback_
  );
}

function getUserMediaFailedCallback_(error) {
  alert('User media request denied with error: ' + error.name);
}

function getUserMediaOkCallback_(stream, containerId) {
  var container = document.getElementById(containerId);
  var video = document.createElement('video');
  video.setAttribute('id', 'view' + counter);
  video.width = 320;
  video.height = 240;
  video.autoplay = true;
  video.srcObject = stream;
  container.appendChild(video);

  if (containerId === 'smallVideoContainer') {
    var deviceLabel = document.createElement('p');
    deviceLabel.innerHTML = stream.getVideoTracks()[0].label;
    container.appendChild(deviceLabel);
  }

  stream.getVideoTracks()[0].addEventListener('ended', errorMessage_);
  counter++;
}


var errorMessage_ = function(event) {
  var message = 'getUserMedia successful but ' + event.type + ' event fired ' +
                'from camera. Most likely too many cameras on the same USB ' +
                'bus/hub. Verify this by disconnecting one of the cameras ' +
                'and try again.';
  document.getElementById('messages').innerHTML += event.target.label + ': ' +
                                                   message + '<br><br>';
};
