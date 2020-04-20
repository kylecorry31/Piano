var context;
var compressor;
var baseOctave = 4;

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
const notes = [
  { note: 'C', octave: baseOctave},
  { note: 'D', octave: baseOctave},
  { note: 'E', octave: baseOctave},
  { note: 'F', octave: baseOctave},
  { note: 'G', octave: baseOctave},
  { note: 'A', octave: baseOctave},
  { note: 'B', octave: baseOctave},
  { note: 'C', octave: baseOctave + 1},
  { note: 'D', octave: baseOctave + 1},
  { note: 'E', octave: baseOctave + 1}
]

const keyBindings = {
    '1': `C${baseOctave}`,
    '2': `D${baseOctave}`,
    '3': `E${baseOctave}`,
    '4': `F${baseOctave}`,
    '5': `G${baseOctave}`,
    '6': `A${baseOctave}`,
    '7': `B${baseOctave}`,
    '8': `C${baseOctave + 1}`,
    '9': `D${baseOctave + 1}`,
    '0': `E${baseOctave + 1}`
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

    notes.forEach(it => keys[it.note + it.octave] = createKey(getFrequency(it.note, it.octave)));
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
    
    document.getElementById(`key-${key}`).classList.add('key-pressed');
});


document.body.addEventListener("keyup", (event) => {
    var key = event.key;

    var note = keyBindings[key];

    if (note == undefined) return;
    
    document.getElementById(`key-${key}`).classList.remove('key-pressed');
});

function getBaseFrequency(note){
  const notes = {
    'C': 16.35,
    'D': 18.35,
    'E': 20.60,
    'F': 21.83,
    'G': 24.50,
    'A': 27.50,
    'B': 30.87
  };

  return notes[note];
}


function getFrequency(note, octave){
  var frequency = getBaseFrequency(note);
  return raiseOctaves(frequency, octave);
}

function raiseOctaves(frequency, octaves){
  return octaves <= 0 ? frequency : raiseOctaves(frequency * 2, octaves - 1);
}
