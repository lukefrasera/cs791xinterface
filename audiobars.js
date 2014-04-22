// =============================================================================
// =============================================================================
function AudioHandler (parentDoc) {
	if (! window.AudioContext) {
		if (! window.webkitAudioContext) {
			console.log('no audiocontext found');
		}
		window.AudioContext = window.webkitAudioContext;
	}
	this.context 	 = new AudioContext();
	this.audioTracks = new Array();
	this.file_list 	 = new Array();
	this.sourceNode  = this.context.createBufferSource();
	this.sourceNode.connect(this.context.destination);
	this.document = parentDoc;
	this.document.getElementById("demo").innerHTML="Constructor!!!";
	handler = this;
}

AudioHandler.prototype.loadAudioFile = function(url) {
	this.document.getElementById("demo").innerHTML="Trying to Load audio";
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	var self = this;
	var player = this.loaderCallBack();
	request.onload = function () {
		self.context.decodeAudioData(request.response, player, onError);
	}
	request.send();
	console.log("I sent the request")
};

AudioHandler.prototype.storeDecodedAudioBuffer = function(buffer) {
	this.document.getElementById("demo").innerHTML="trying to play";
	this.playSound(buffer);
	alert("You Made it inside this function");
};

AudioHandler.prototype.playCallBack = function() {
	var self = this;
    function player (buffer) {
	    self.sourceNode.buffer = buffer;
	    self.sourceNode.start(0);
    }
    return player;
};

AudioHandler.prototype.playSound(buffer){
  	this.sourceNode.buffer = buffer;
	this.sourceNBode.start(0);
}

AudioHandler.prototype.loaderCallBack = function() {
	var self = this;
	function callback(buffer) {
		self.audioTracks[self.audioTracks.length] = buffer;
	}
	return callback;
};
// =============================================================================
// =============================================================================
function DisplayWaveform(parentDoc){
	this.audiohandler = new AudioHandler(parentDoc);
	this.audiohandler.loadAudioFile("track.mp3");
	this.analyser  = this.audiohandler.context.createAnalyser();
	this.analyser.smoothingTimeConstant = 0.3;
	this.analyser.fftSize = 1024;
	this.scriptNode = this.audiohandler.context.createScriptProcessor(2048, 1, 1);
	this.scriptNode.onaudioprocess = this.audioprocessCallback();
}

DisplayWaveform.prototype.audioprocessCallback = function() {
	var self = this;
	function callback () {
		// get the average, bincount is fftsize / 2
		var array =  new Uint8Array(self.analyser.frequencyBinCount);
		self.analyser.getByteFrequencyData(array);
		var average = getAverageVolume(array)

		// clear the current state
		ctx.clearRect(0, 0, 60, 130);

		// set the fill style
		ctx.fillStyle=gradient;

		// create the meters
		ctx.fillRect(0,130-average,25,130);
	}
	return callback;
};
// =============================================================================
// =============================================================================

function onError(e) {
    console.log(e);
}

function getAverageVolume(array) {
	var values = 0;
	var average;

	var length = array.length;

	// get all the frequency amplitudes
	for (var i = 0; i < length; i++) {
		values += array[i];
	}

	average = values / length;
	return average;
}
