var context;
var compressor;

function createKey(frequency){
    let oscillator = context.createOscillator();
    oscillator.frequency.value = frequency;
    let gain = context.createGain();
    gain.gain.setValueAtTime(0, context.currentTime);
    oscillator.connect(gain);
    gain.connect(compressor);
    oscillator.start(0);
    return gain;
}

const keys = {};
const audio = {};
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
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
    compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);
    compressor.connect(context.destination);

    keys['C'] = createKey(261.63);
    keys['D'] = createKey(293.66);
    keys['E'] = createKey(329.63);
    keys['F'] = createKey(349.23);
    keys['G'] = createKey(392.00);
    keys['A'] = createKey(440.00);
    keys['B'] = createKey(493.88);
    keys['C2'] = createKey(523.25);
    keys['D2'] = createKey(587.33);
    keys['E2'] = createKey(659.25);
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}



function play(key){
    var note = keys[key];
    if (note == undefined) return;
    note.gain.cancelScheduledValues(context.currentTime);
    note.gain.setTargetAtTime(1, context.currentTime, 0.01);
    note.gain.setTargetAtTime(0.0, context.currentTime + 0.03, 0.1);
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

