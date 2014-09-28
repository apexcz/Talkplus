'use strict';

//for text chat

var sendChannel;
var sendButton = document.getElementById("sendButton");
var sendTextarea = document.getElementById("dataChannelSend");
var chatbox = document.getElementById("chatbox");
//var receiveTextarea = document.getElementById("dataChannelReceive");

sendButton.onclick = sendData;

var isChannelReady;
var isInitiator;
var isStarted;
var localStream;
var pc;
var remoteStream;
var turnReady;
var guest=0;
var d=new Date();



var pc_config = webrtcDetectedBrowser === 'firefox' ?
  {'iceServers':[{'url':'stun:23.21.150.121'}]} : // number IP
  {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

var pc_constraints = {
  'optional': [
    {'DtlsSrtpKeyAgreement': true},
    {'RtpDataChannels': true}
  ]};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {'mandatory': {
  'OfferToReceiveAudio':true,
  'OfferToReceiveVideo':true }};

/////////////////////////////////////////////
/* WORKING
var room = window.location.hash.slice(1);
if (room === '') {
//  room = prompt('Enter room name:');
  room = 'Talkplus';
} else {
  //
}

var socket = io.connect();

if (room !== '') {
  console.log('Create or join room', room);
  socket.emit('create or join', room);
}

socket.on('created', function (room){
  console.log('Created room ' + room);
  isInitiator = true;
});

socket.on('full', function (room){
  console.log('Room ' + room + ' is full');
});

socket.on('join', function (room){
  console.log('Another peer made a request to join room ' + room);
  //console.log('This peer is the initiator of room ' + room + '!');
  isChannelReady = true;
});

socket.on('joined', function (room){
  console.log('This peer has joined room ' + room);
  isChannelReady = true;
});

socket.on('log', function (array){
  console.log.apply(console, array);
});
*/
//////////////


var room = window.location.hash.slice(1);
var usry='OTY';
var socket = io.connect();

if (room === '') {
//window.location.href="http://localhost/tp2/front/";
  room = prompt('Enter room name:');
  enter_username();
} 
else {
  //
  enter_username();
}

socket.on('created', function (room){
  console.log('Created room ' + room);
  isInitiator = true;
});

socket.on('full', function (room){
  setStatus("Room "+ room +" is full");
  console.log('Room ' + room + ' is full');
});

socket.on('join', function (room){
  console.log('Another peer made a request to join room ' + room);
  console.log('This peer is the initiator of room ' + room + '!');
  isChannelReady = true;
});

socket.on('joined', function (room){
  $('.friend').append(room.n);
  console.log('This peer ' + room.n +' has joined room ' + room.r);
  setStatus('This peer ' + room.n +' has joined room ' + room.r);
  isChannelReady = true;
});

socket.on('log', function (array){
  console.log.apply(console, array);
});

 

//Modal Prompt to change username
$(".change_username").click(function(e){
  e.preventDefault();
  enter_username();
    

});  

function enter_username(){

  var msg_body='<div class="control-group"><label>Username :</label><input id="usernme" type="text" class="span2"><span class="help-inline hide">Not empty !</span></div>';
    bootbox.dialog({
      message:msg_body,
      title:"Enter Username",
      buttons:{success:{label:"Chat!",className:"btn-success",callback:function(){
           /**
               * if the username is not entered : error
               */
              var username = $("#usernme");
              if(username.val() == ""){
                  username.parent('div').addClass("error");
                  username.siblings('span').removeClass('hide');
              /**
               * else write the nickname in the right of the navbar
               * and the Modal Connection closes when the user click on the "close button"
               */
              } else {
                  usry = username.val();
                  console.log('Create or join room', room );
                  socket.emit('create or join', {rm:room,nick:usry});
                //window.location.href="http://localhost:2014/?room="+rooy+"&user="+username.val();
                  $('.you').text(username.val()); 

                  
              }

    }}}});
}

//Pop up of Peer users
$(".users_list").click(function(e){
  e.preventDefault();

  socket.on('listusers', function(data){
          var html='<table class="table table-striped"><thead><tr><th>#</th><th>Username</th><th>Time Joined</th></tr></thead><tbody><tr>';                      
          
          for(i=0; i<data.length;i++){
            html += '<td>'+i+'</td><td>'+data[i] + '</td><td>Date</td>';
          }
          html +=' </tr></tbody></table>';
          bootbox.alert({
          message:html,
          title:"List of Users",
          });
  });
  
});








////////////////////////////////////////////////


function sendMessage(message){
  console.log('Client sending message: ', message);
   /**if (typeof message === 'object') {
     message = JSON.stringify(message);
   }
  */socket.emit('message', message);
}

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] == '\n') {
    text = text.substring(0, text.length - 1);
  }
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

socket.on('message', function (message){
  console.log('Client received message:', message);
  if (message === 'got user media') {
    maybeStart();
  } else if (message.type === 'offer') {
    if (!isInitiator && !isStarted) {
      maybeStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
  } else if (message.type === 'answer' && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
    pc.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});

////////////////////////////////////////////////////

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var startButton = document.getElementById("start");
startButton.disabled = false;
startButton.onclick = startq;

//////Display the status in the status bar ////////

function setStatus(state) {
    $('#status').html(state);
}

/**
 * Allow to reset the status in the status bar
 * @return {void}
 */
function resetStatus() {

    /**
     * if you aren't the guest it provides you a link to invite someone in the footer
     */
    if (!guest) {
        setStatus("Waiting for guests to join");
    } else {
        setStatus("Initializing...");
    }
}

resetStatus();


var link =window.location.href;
$('.roomlink').html(link);
$('.rnm').html(room);

//////////////



function handleUserMedia(stream) {
  localStream = stream;
  attachMediaStream(localVideo, stream);
  console.log('Adding local stream.');
  sendMessage('got user media');
  if (isInitiator) {
    maybeStart();
  }
}

function handleUserMediaError(error){
  console.log('getUserMedia error: ', error);
}

var constraints = {video: true, audio:true};

function startq() {
      //sendMessage('Requesting local stream');
      startButton.value = "Stop";
      console.log('Getting user media with constraints', constraints);
      //navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);
      getUserMedia(constraints, handleUserMedia, handleUserMediaError);

      console.log('Getting user media with constraints', JSON.stringify(constraints));

        /**if (localStream.getVideoTracks().length > 0) {
        sendMessage('Using video device: ' + localStream.getVideoTracks()[0].label);
      }
        if (localStream.getAudioTracks().length > 0) {
          sendMessage('Using audio device: ' + localStream.getAudioTracks()[0].label);
        }
        */
        
        
}


if (location.hostname != "localhost") {
  requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
}


function maybeStart() {
  if (!isStarted && localStream && isChannelReady) {
    createPeerConnection();
    pc.addStream(localStream);
    isStarted = true;
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      doCall();
    }
  }
}

window.onbeforeunload = function(e){
  sendMessage('bye');
}

/////////////////////// Establish Peer Connection//////////////////////////////////

function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(pc_config, pc_constraints);
    pc.onicecandidate = handleIceCandidate;
    console.log('Created RTCPeerConnnection with:\n' +
      '  config: \'' + JSON.stringify(pc_config) + '\';\n' +
      '  constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    alert('Cannot create RTCPeerConnection object.');
      return;
  }
  pc.onaddstream = handleRemoteStreamAdded;
  pc.onremovestream = handleRemoteStreamRemoved;

  if (isInitiator) {
    try {
      // Reliable Data Channels not yet supported in Chrome
      sendChannel = pc.createDataChannel("sendDataChannel",
        {reliable: false});
      sendChannel.onmessage = handleMessage;
      trace('Created send data channel');
    } catch (e) {
      alert('Failed to create data channel. ' +
            'You need Chrome M25 or later with RtpDataChannel enabled');
      trace('createDataChannel() failed with exception: ' + e.message);
    }
    sendChannel.onopen = handleSendChannelStateChange;
    sendChannel.onclose = handleSendChannelStateChange;
  } else {
    pc.ondatachannel = gotReceiveChannel;
  }
}

function sendData() {
  var data = sendTextarea.value;
  sendChannel.send(data);
  trace('Sent data: ' + data);

 $('#chatbox').append('<li class="media"><div class="pull-right media-body chat-pop mod"><h4 class="media-heading">room<span class="pull-left"><abbr class="timeago" title="Oct 9, 2013">8 hours</abbr><i class="fa fa-clock-o"></i> </span></h4><p>'+data+'</p></div></li>');
 $('#sendTextarea').val(' ');
}

/** function closeDataChannels() {
   trace('Closing data channels');
   sendChannel.close();
   trace('Closed data channel with label: ' + sendChannel.label);
   receiveChannel.close();
   trace('Closed data channel with label: ' + receiveChannel.label);
   localPeerConnection.close();
   remotePeerConnection.close();
   localPeerConnection = null;
   remotePeerConnection = null;
   trace('Closed peer connections');
   startButton.disabled = false;
   sendButton.disabled = true;
   closeButton.disabled = true;
   dataChannelSend.value = "";
   dataChannelReceive.value = "";
   dataChannelSend.disabled = true;
   dataChannelSend.placeholder = "Press Start, enter some text, then press Send.";
 }
 */

 function gotReceiveChannel(event) {
  trace('Receive Channel Callback');
  sendChannel = event.channel;
  sendChannel.onmessage = handleMessage;
  sendChannel.onopen = handleReceiveChannelStateChange;
  sendChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage(event) {
  trace('Received message: ' + event.data);
  //receiveTextarea.value = event.data;
  $('#chatbox').append($('<li class="media"><div class="media-body chat-pop"><h4 class="media-heading">'+ event.data +'<span class="pull-right"><i class="fa fa-clock-o"></i> <abbr class="timeago" title="Oct 9, 2013">'+d.getHours()+'hours</abbr> </span></h4><p>'+event.data+'</p></div></li>'));

}

function handleSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  enableMessageInterface(readyState == "open");
}

function handleReceiveChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Receive channel state is: ' + readyState);
  enableMessageInterface(readyState == "open");
}

function enableMessageInterface(shouldEnable) {
    if (shouldEnable) {
    sendTextarea.disabled = false;
    sendTextarea.focus();
    sendTextarea.placeholder = "Enter text chat";
    sendButton.disabled = false;
  } else {
    sendTextarea.disabled = true;
    sendButton.disabled = true;
  }
}

function handleIceCandidate(event) {
  console.log('handleIceCandidate event: ', event);
  if (event.candidate) {
    sendMessage({
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate});
  } else {
    console.log('End of candidates.');
  }
}

function doCall() {
  var constraints = {'optional': [], 'mandatory': {'MozDontOfferDataChannel': true}};
  // temporary measure to remove Moz* constraints in Chrome
  if (webrtcDetectedBrowser === 'chrome') {
    for (var prop in constraints.mandatory) {
      if (prop.indexOf('Moz') !== -1) {
        delete constraints.mandatory[prop];
      }
     }
   }
  constraints = mergeConstraints(constraints, sdpConstraints);
  console.log('Sending offer to peer, with constraints: \n' +
    '  \'' + JSON.stringify(constraints) + '\'.');
  pc.createOffer(setLocalAndSendMessage, null, constraints);
}

function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
}

function mergeConstraints(cons1, cons2) {
  var merged = cons1;
  for (var name in cons2.mandatory) {
    merged.mandatory[name] = cons2.mandatory[name];
  }
  merged.optional.concat(cons2.optional);
  return merged;
}

function setLocalAndSendMessage(sessionDescription) {
  // Set Opus as the preferred codec in SDP if Opus is present.
  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
  pc.setLocalDescription(sessionDescription);
  console.log('setLocalAndSendMessage sending message' , sessionDescription);
  sendMessage(sessionDescription);
}


//////////
/**

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  remoteVideo.src = window.URL.createObjectURL(event.stream);
  remoteStream = event.stream;
}

function handleCreateOfferError(event){
  console.log('createOffer() error: ', e);
}

function doCall() {
  console.log('Sending offer to peer');
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}


*/

function requestTurn(turn_url) {
  var turnExists = false;
  for (var i in pc_config.iceServers) {
    if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
      turnExists = true;
      turnReady = true;
      break;
    }
  }
  if (!turnExists) {
    console.log('Getting TURN server from ', turn_url);
    // No TURN server. Get one from computeengineondemand.appspot.com:
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4 && xhr.status === 200) {
        var turnServer = JSON.parse(xhr.responseText);
        console.log('Got TURN server: ', turnServer);
        pc_config.iceServers.push({
          'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
          'credential': turnServer.password
        });
        turnReady = true;
      }
    };
    xhr.open('GET', turn_url, true);
    xhr.send();
  }
}

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
 // reattachMediaStream(miniVideo, localVideo);
  attachMediaStream(remoteVideo, event.stream);
  remoteStream = event.stream;
//  waitForRemoteVideo();
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}


function hangup() {
  console.log('Hanging up.');
  stop();
  sendMessage('bye');
  setStatus("You just left the room");
}

function handleRemoteHangup() {
  console.log('Session terminated.');
   stop();
   isInitiator = false;
  setStatus("User id just left the room");
}

function stop() {
  isStarted = false;
  // isAudioMuted = false;
  // isVideoMuted = false;
  pc.close();
  pc = null;
}

///////////////////////////////////////////

// Set Opus as the default audio codec if it's present.
function preferOpus(sdp) {
  var sdpLines = sdp.split('\r\n');
  var mLineIndex;
  // Search for m line.
  for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        mLineIndex = i;
        break;
      }
  }
  if (mLineIndex === null) {
    return sdp;
  }

  // If Opus is available, set it as the default in m line.
  for (i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search('opus/48000') !== -1) {
      var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
      if (opusPayload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
      }
      break;
    }
  }

  // Remove CN in m line and sdp.
  sdpLines = removeCN(sdpLines, mLineIndex);

  sdp = sdpLines.join('\r\n');
  return sdp;
}

function extractSdp(sdpLine, pattern) {
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
}

// Set the selected codec to the first in m line.
function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');
  var newLine = [];
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) { // Format of media starts from the fourth.
      newLine[index++] = payload; // Put target payload to the first.
    }
    if (elements[i] !== payload) {
      newLine[index++] = elements[i];
    }
  }
  return newLine.join(' ');
}

// Strip CN from sdp before CN constraints is ready.
function removeCN(sdpLines, mLineIndex) {
  var mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (var i = sdpLines.length-1; i >= 0; i--) {
    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      var cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}


