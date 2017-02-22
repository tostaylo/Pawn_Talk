//SOCKET CONNECTION
let socket = io.connect('//' + document.domain + ':' + location.port);

/*var localVideo;
var remoteVideo;
var peerConnection;
var peerConnectionConfig = {
    'iceServers': [{
        'url': 'stun:stun.services.mozilla.com'
    }, {
        'url': 'stun:stun.l.google.com:19302'
    }]
};

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;


//GET USER MEDIA
function pageReady() {
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');



    var constraints = {
        video: true,
        audio: true,
    };

    if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError);
    } else {
        alert('Your browser does not support getUserMedia API');
    }
}

function getUserMediaSuccess(stream) {
    localStream = stream;
    localVideo.src = window.URL.createObjectURL(stream);
}

function getUserMediaError(error) {
    console.log(error);
}

pageReady();

//FUNCTION CALLED ON START BUTTON CLICK
function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.onaddstream = gotRemoteStream;
    peerConnection.addStream(localStream);

    if (isCaller) {
        peerConnection.createOffer(gotDescription, createOfferError);
    }
}


function gotDescription(description) {

    console.log('got description');
    peerConnection.setLocalDescription(description, function () {
        socket.emit('handshake', JSON.stringify({
            'sdp': description
        }));
    }, function () {
        console.log('set description error')
    });
}

function gotIceCandidate(event) {
    if (event.candidate != null) {
        socket.emit('ice', JSON.stringify({
            'ice': event.candidate
        }));
    }
}

function gotRemoteStream(event) {
    console.log('got remote stream');
    remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function createOfferError(error) {
    console.log(error);
}

//ANSWERING THE CliENt


*/
/*
socket.on('handshake', function(message) {

    if (!peerConnection) start(false);
    var signal = JSON.parse(message);
    if (signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function(){
            if (signal.sdp.type == 'offer') {
                  return peerConnection.createAnswer();
              }

        }).then(gotDescription)
        .catch(function(){
            console.log(arguments);
        });
    }
 });



 socket.on('ice', function(message) {
  if (!peerConnection) start(false);
    var signal = JSON.parse(message);
     if (signal.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice)).then(function(){
        console.log(arguments);
        }).catch(function(){
        console.log(arguments);
        });
    }
});
*/





/* socket.on('connect', function() {
     socket.send('user connected');
 });

 socket.on('disconnect', function() {
     socket.send('user disconnected')
 });*/



socket.on('message', function (msg) {
    let username = $('#username_input').val();

    if (msg.username === username) {
        var itemR = $('<li class="buffer">'+ username +'</li><li class="right"><p class ="span_right">' + msg.data + '</p></li>').hide().fadeIn(1000);
        $('#messages').append(itemR);
        $("#messages").scrollTop($('#messages').height())
    } else {
        var itemL = $('<li class="buffer">'+ username + '</li><li class="left"><p class ="span_left">' + msg.data + '</p></li>').hide().fadeIn(1000);
        $('#messages').append(itemL);
        $("#messages").scrollTop($('#messages').height())
    }
});

socket.on('username_message', function (msg) {
    let username = msg.username;
    console.log("the user name is " + username)

});

socket.on('guest_name', function (msg) {
    let guest_name = msg.guest_name;
    $('#guest_name').text(guest_name)
    console.log("the guest user name is " + guest_name)
});



$('#send_button').on('click', function () {
    socket.emit('message', {
        'data': $('#my_message').val()
    });
    $('#my_message').val("")
    console.log($('#my_message').val());
    return false;
});

$('#send_username_button').on('click', function () {
    let username = $('#username_input').val();
    $('#header_username').text(username);
    socket.emit('username_message', {
        'data': $('#username_input').val()
    });
    return false;
});







//COPY URL TO CLIPBOARD
$('#link').text(window.location.href);
var copyBtn = document.querySelector('#copy');

copyBtn.addEventListener('click', function () {
    var link = document.querySelector('#link');

    // create a Range object
    var range = document.createRange();
    // set the Node to select the "range"
    range.selectNode(link);
    // add the Range to the set of window selections
    window.getSelection().addRange(range);

    // execute 'copy', can't 'cut' in this case
    document.execCommand('copy');
}, false);




//Hide Username Overlay On click
$('#send_username_button').on('click', function () {
    $('#username_overlay').css('visibility', 'hidden');
});

document.getElementById("username_input").focus();