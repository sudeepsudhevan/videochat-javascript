var peer = new Peer();
var myStream
var peerList = []

// This function will initializing the peer
function init() {
    var userId = document.getElementById('userId').value;
    if (!userId) {
        console.log('Please enter a valid user ID.');
        return;
    } // Replace with your desired user ID

    peer = new Peer(userId)
    peer.on('open', (id) => {
        console.log(id + "Connected");
    })

    listenToCall()
}

// This function will keep listening to call or incoming events
function listenToCall() {
    peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            myStream = stream
            addLocalVideo(stream)
            call.answer(stream)
            call.on('stream', (remoteStream) => {
                if (!peerList.includes(call.peer)) {
                    addRemoteVideo(remoteStream)
                    peerList.push(call.peer)
                }
            })
        }).catch((err) => {
            console.log('unable to connect beacuse ' + err);
        })
    })
}

//This connection will be called when we try to make a call
function makeCall() {
    var receiverId = document.getElementById('receiverId').value;
    if (!receiverId) {
        console.log('Please enter a valid receiver ID.');
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        myStream = stream
        addLocalVideo(stream)
        let call = peer.call(receiverId, stream)
        call.on('stream', (remoteStream) => {
            if (!peerList.includes(call.peer)) {
                addRemoteVideo(remoteStream)
                peerList.push(call.peer)
            }
        })
    }).catch((err) => {
        console.log('unable to connect beacuse ' + err);
    })
}

// this function will add local stream
function addLocalVideo(stream) {
    let video = document.createElement('video')
    video.srcObject = stream
    video.classList.add("video")
    video.muted = true
    video.play()
    document.getElementById('localVideo').append(video)
}

// This function will add remote stream
function addRemoteVideo(stream) {
    let video = document.createElement('video')
    video.srcObject = stream
    video.classList.add("video")
    video.play()
    document.getElementById('remoteVideo').append(video)
}

function toggleVideo(b) {
    if (b) {
        myStream.getVideoTracks()[0].enabled = true
    } else {
        myStream.getVideoTracks()[0].enabled = false
    }
}

function toggleAudio(b) {
    if (b) {
        myStream.getAudioTracks()[0].enabled = true
    } else {
        myStream.getAudioTracks()[0].enabled = false
    }
}