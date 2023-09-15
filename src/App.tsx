import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css'
import { playNote } from './piano'

function App() {
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];
  const keyBindings = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const [pressed, setPressed] = useState<{ [index: number]: boolean }>({});
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [song, setSong] = useState('');
  const [songToPlay, setSongToPlay] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Load the last song from local storage
  useEffect(() => {
    const lastSong = localStorage.getItem('lastSong');
    if (lastSong) {
      setSong(lastSong);
    }
  }, []);

  // Focus on load so we can use keyboard shortcuts
  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  // Use this to play or stop a note
  const setPianoKeyPressed = useCallback((index: number, value: boolean, wasAutoplayed: boolean = false) => {
    if (!wasAutoplayed && shouldAutoPlay) {
      stopAutoplay();
    }
    if (value) {
      playNote(notes[index]);
    }
    setPressed((prev) => {
      return {
        ...prev,
        [index]: value
      }
    });
  }, [notes, shouldAutoPlay]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isTyping) {
      return;
    }
    const key = event.key;
    const index = keyBindings.indexOf(key);
    if (index !== -1) {
      setPianoKeyPressed(index, true);
    }
  }, [notes, isTyping]);

  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isTyping) {
      return;
    }
    const key = event.key;
    const index = keyBindings.indexOf(key);
    if (index !== -1) {
      setPianoKeyPressed(index, false);
    }
  }, [notes, isTyping]);

  // Autoplay
  useEffect(() => {
    let autoPlayTimeout: number;
    let lastKeyIndex = -1;
    if (shouldAutoPlay && songToPlay.length > 0) {
      const index = keyBindings.indexOf(songToPlay[0]);
      // Play the next note
      if (index !== -1) {
        lastKeyIndex = index;
        setPianoKeyPressed(index, true, true);
        // Release the key in 100ms, but don't move on to the next note until 200ms
        setTimeout(() => {
          setPianoKeyPressed(index, false, true);
        }, 100);
      }
      // Move on to the next note after 200ms
      autoPlayTimeout = setTimeout(() => {
        setSongToPlay(previous => previous.substring(1));
      }, 200);
    }
    return () => {
      // Clear the timeout and release the key
      if (autoPlayTimeout) {
        window.clearTimeout(autoPlayTimeout);
      }
      if (lastKeyIndex !== -1) {
        setPianoKeyPressed(lastKeyIndex, false, true);
      }
    }
  }, [shouldAutoPlay, songToPlay]);

  const startAutoplay = useCallback(() => {
    setShouldAutoPlay(true);
    setSongToPlay(song);
  }, [song]);

  const stopAutoplay = useCallback(() => {
    setShouldAutoPlay(false);
    setSongToPlay('');
  }, []);

  const onSongInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSong(event.target.value);
    localStorage.setItem('lastSong', event.target.value);
  }, []);

  return (
    <div
      id="root"
      ref={rootRef}
      tabIndex={-1}
      onKeyDown={(event) => handleKeyDown(event)}
      onKeyUp={(event) => handleKeyUp(event)}
    >
      <div id="piano">
        {notes.map((note, index) =>
          <div
            key={note}
            className={`key ${pressed[index] ? 'key-pressed' : ''}`}
            onPointerDown={() => setPianoKeyPressed(index, true)}
            onPointerUp={() => setPianoKeyPressed(index, false)}
            onPointerLeave={() => !shouldAutoPlay && setPianoKeyPressed(index, false)}
          >
            {note} ({keyBindings[index]})
          </div>
        )}
      </div>
      <div id="autoplay">
        <input type="text"
          onChange={onSongInput}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          value={song} />
        <button onClick={startAutoplay}>Autoplay</button>
      </div>
    </div >
  )
}

export default App
