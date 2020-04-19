var context;
var compressor;

function createKey(src){
    // let oscillator = context.createOscillator();
    // oscillator.frequency.value = frequency;
    // let gain = context.createGain();
    // gain.gain.setValueAtTime(0, context.currentTime);
    // oscillator.connect(gain);
    // gain.connect(compressor);
    // oscillator.start(0);
    // return gain;
    return new Howl({ src: [src] });
}

const keys = {};


const keyBindings = {
    '1': 'C',
    '2': 'D',
    '3': 'E',
    '4': 'F',
    '5': 'G',
    '6': 'A',
    '7': 'B',
    '8': 'C2',
    '9': 'D2',
    '0': 'E2'
}

function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    // compressor = context.createDynamicsCompressor();
    // compressor.threshold.setValueAtTime(-50, context.currentTime);
    // compressor.knee.setValueAtTime(40, context.currentTime);
    // compressor.ratio.setValueAtTime(12, context.currentTime);
    // compressor.attack.setValueAtTime(0, context.currentTime);
    // compressor.release.setValueAtTime(0.25, context.currentTime);
    // compressor.connect(context.destination);

    keys['C'] = createKey('audio/261-C.mp3');
    keys['D'] = createKey('audio/293-D.mp3');
    keys['E'] = createKey('audio/329-E.mp3');
    keys['F'] = createKey('audio/349-F.mp3');
    keys['G'] = createKey('audio/391-G.mp3');
    keys['A'] = createKey('audio/440-A.mp3');
    keys['B'] = createKey('audio/495-B.mp3');
    keys['C2'] = createKey('audio/523-C.mp3');
    keys['D2'] = createKey('audio/587-D.mp3');
    keys['E2'] = createKey('audio/659-E.mp3');

  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}



function play(key){
    var note = keys[key];
    if (note == undefined) return;
    note.stop();
    note.play();
    // note.gain.cancelScheduledValues(context.currentTime);
    // note.gain.setTargetAtTime(1, context.currentTime, 0.01);
    // note.gain.setTargetAtTime(0.0, context.currentTime + 0.03, 0.1);
    // note.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 4);
}


document.body.addEventListener("keydown", (event) => {
    if (context == null){
        init();
    }

    var key = event.key;

    var note = keyBindings[key];

    if (note == undefined) return;

    play(note);
    
    document.getElementById(`key-${note.toLowerCase()}`).classList.add('key-pressed');
});


document.body.addEventListener("keyup", (event) => {
    var key = event.key;

    var note = keyBindings[key];

    if (note == undefined) return;
    
    document.getElementById(`key-${note.toLowerCase()}`).classList.remove('key-pressed');
});

