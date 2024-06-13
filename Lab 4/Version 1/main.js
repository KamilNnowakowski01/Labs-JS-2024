import Note from './Note.js';
import NoteManager from './NoteManager.js';
import UIManager from './UIManager.js';

const noteManager = new NoteManager();

const note1 = new Note("Zakupy", "Mleko, chleb, jajka", "Red", false, new Date());
const note2 = new Note("Spotkanie", "Spotkanie z klientem o 14:00", "Blue", true, new Date());
const note3 = new Note("Szkoła", "Zajecia 17:00", "White", false, new Date());
const note4 = new Note("Dom", "Wynieść śmieci", "Red", false, new Date());

noteManager.addNote(note1);
noteManager.addNote(note2);
noteManager.addNote(note3);
noteManager.addNote(note4);

noteManager.loadNotes();

const uiManager = new UIManager(noteManager);

document.addEventListener('DOMContentLoaded', () => {
    uiManager.showNotes();
});
