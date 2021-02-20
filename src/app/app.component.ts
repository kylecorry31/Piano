import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  piano: any;
  baseOctave = 4;
  keyOrders = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  keyBindings: { [key: string]: string } = {
    '1': `C${this.baseOctave}`,
    '2': `D${this.baseOctave}`,
    '3': `E${this.baseOctave}`,
    '4': `F${this.baseOctave}`,
    '5': `G${this.baseOctave}`,
    '6': `A${this.baseOctave}`,
    '7': `B${this.baseOctave}`,
    '8': `C${this.baseOctave + 1}`,
    '9': `D${this.baseOctave + 1}`,
    '0': `E${this.baseOctave + 1}`,
  };

  pressed: string[] = [];

  private createPiano() {
    this.piano = new Tone.Sampler(
      {
        A0: 'A0.[mp3|ogg]',
        C1: 'C1.[mp3|ogg]',
        'D#1': 'Ds1.[mp3|ogg]',
        'F#1': 'Fs1.[mp3|ogg]',
        A1: 'A1.[mp3|ogg]',
        C2: 'C2.[mp3|ogg]',
        'D#2': 'Ds2.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        A2: 'A2.[mp3|ogg]',
        C3: 'C3.[mp3|ogg]',
        'D#3': 'Ds3.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        A3: 'A3.[mp3|ogg]',
        C4: 'C4.[mp3|ogg]',
        'D#4': 'Ds4.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        A4: 'A4.[mp3|ogg]',
        C5: 'C5.[mp3|ogg]',
        'D#5': 'Ds5.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        A5: 'A5.[mp3|ogg]',
        C6: 'C6.[mp3|ogg]',
        'D#6': 'Ds6.[mp3|ogg]',
        'F#6': 'Fs6.[mp3|ogg]',
        A6: 'A6.[mp3|ogg]',
        C7: 'C7.[mp3|ogg]',
        'D#7': 'Ds7.[mp3|ogg]',
        'F#7': 'Fs7.[mp3|ogg]',
        A7: 'A7.[mp3|ogg]',
        C8: 'C8.[mp3|ogg]',
      },
      {
        release: 1,
        baseUrl: './assets/audio/',
      }
    ).toMaster();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    this.onKeyDown(event.key);
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    this.onKeyUp(event.key);
  }

  onKeyDown(key: string) {
    if (this.piano == null) {
      this.createPiano();
    }
    let note: string = this.keyBindings[key];

    if (note == null) return;

    if (!this.pressed.includes(key)) {
      this.pressed.push(key);
    }
    this.piano.triggerAttackRelease(note, '4n');
  }

  onKeyUp(key: string) {
    this.pressed = this.pressed.filter((it) => it !== key);
  }
}
