import Note from "./Note.js"

export default class NoteManager {
    constructor() {
      this.notes = [];
    }
  
    addNote(note) {
      this.notes.push(note);
      this.sortNotes();
      this.saveNotes();
    }
  
    editNote(index, updatedNote) {
      if (index >= 0 && index < this.notes.length) {
        this.notes[index] = updatedNote;
        this.sortNotes();
        this.saveNotes();
      } else {
        console.error("Index out of range");
      }
    }
  
    deleteNote(index) {
      if (index >= 0 && index < this.notes.length) {
        this.notes.splice(index, 1);
        this.saveNotes();
      } else {
        console.error("Index out of range");
      }
    }

    deleteNotes(){
      this.notes = [];
      this.saveNotes();
    }
  
    saveNotes() {
      localStorage.setItem("notes", JSON.stringify(this.notes));
    }
  
    loadNotes() {
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        this.notes = JSON.parse(storedNotes).map(
          note =>
            new Note(
              note.title,
              note.content,
              note.color,
              note.pinned,
              new Date(note.createdAt)
            )
        );
        this.sortNotes();
      }
    }
  
    getAllNotes() {
      return this.notes;
    }

    sortNotes() {
      this.notes.sort((a, b) => b.pinned - a.pinned || new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
