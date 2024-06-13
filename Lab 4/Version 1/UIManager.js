import Note from './Note.js';
import NoteManager from './NoteManager.js';

export default class UIManager {
    constructor(noteManager){
        this.addBox = document.querySelector('#addBox');
        this.popupBox = document.querySelector('#popupBox');
        this.popupTitle = document.querySelector('#popupTitle');
        this.closeIcon = document.querySelector('#closeIcon');
        this.titleEl = document.querySelector('#titleInput');
        this.descEl = document.querySelector('#descInput');
        this.dateEl = document.querySelector('#dateInput');
        this.timeEl = document.querySelector('#timeInput');
        this.colorEl = document.querySelector('#colorSelect');
        this.pinnedEl = document.querySelector('#pinnedCheckbox');
        this.addBtn = document.querySelector('#addBtn');

        this.noteManager = noteManager;
        this.notes = this.noteManager.getAllNotes();

        this.isUpdate = false;
        this.updateId = null;

        this.init()
    }

    init(){
        this.addBox.addEventListener('click', () => {
            this.titleEl.focus();
            this.popupBox.classList.add('show');
        });

        this.closeIcon.addEventListener('click', () => {
            this.resetForm();
            this.popupBox.classList.remove('show');
        });

        this.addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const noteTitle = this.titleEl.value,
                noteDesc = this.descEl.value,
                noteDate = this.dateEl.value,
                noteTime = this.timeEl.value,
                noteColor = this.colorEl.value,
                notePinned = this.pinnedEl.checked;

            if (noteTitle || noteDesc) {
                let noteInfo;
                if (noteDate && noteTime) {
                    noteInfo = new Note(
                        noteTitle,
                        noteDesc,
                        noteColor,
                        notePinned,
                        new Date(`${noteDate}T${noteTime}`)
                    );
                } else {
                    noteInfo = new Note(
                        noteTitle,
                        noteDesc,
                        noteColor,
                        notePinned,
                        new Date()
                    );
                }

                if (!this.isUpdate) {
                    this.noteManager.addNote(noteInfo);
                } else {
                    this.noteManager.editNote(this.updateId, noteInfo);
                    this.isUpdate = false;
                    this.updateId = null;
                }

                this.resetForm();
                this.noteManager.saveNotes();
                this.popupBox.classList.remove('show');
                this.showNotes();
            }
        });

        this.showNotes();
    }

    showNotes() {
        const wrapper = document.querySelector('#wrapper');
        document.querySelectorAll('.note').forEach(note => note.remove());
        this.notes.forEach((note, index) => {
            const dateString = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '';
            const timeString = note.createdAt ? new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '';

            const pinnedClass = note.pinned ? 'pinned' : '';

            let liEl = `<li class="note color${note.color} ${pinnedClass}">
                            <div class="details">
                                <p>${note.title}</p>
                                <span>${note.content}</span>
                            </div>
                            <div class="bottom-content">
                                <span>${dateString} ${timeString}</span>
                                <div class="settings">
                                    <i class="uil uil-edit" data-index="${index}"></i>
                                    <i class="uil uil-trash" data-index="${index}"></i>
                                </div>
                            </div>
                        </li>`;
            wrapper.insertAdjacentHTML('beforeend', liEl);
        });

        document.querySelectorAll('.uil-edit').forEach(icon => {
            icon.addEventListener('click', () => {
                const index = parseInt(icon.dataset.index);
                this.updateNote(index);
            });
        });

        document.querySelectorAll('.uil-trash').forEach(icon => {
            icon.addEventListener('click', () => {
                const index = parseInt(icon.dataset.index);
                this.deleteNote(index);
            });
        });
    }

    deleteNote(noteId) {
        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return;
        this.noteManager.deleteNote(noteId);
        this.notes = this.noteManager.getAllNotes();
        this.showNotes();
    }

    updateNote(noteId) {
        this.isUpdate = true;
        this.updateId = noteId;
        const note = this.notes[noteId];
        this.titleEl.value = note.title;
        this.descEl.value = note.content;
        this.dateEl.value = new Date(note.createdAt).toISOString().slice(0, 10);
        this.timeEl.value = new Date(note.createdAt).toISOString().slice(11, 16);
        this.colorEl.value = note.color;
        this.pinnedEl.checked = note.pinned;
        this.addBox.click();
        this.addBtn.innerText = 'Edit Note';
        this.popupTitle.innerText = 'Editing a Note';
    }

    resetForm() {
        this.titleEl.value = '';
        this.descEl.value = '';
        this.dateEl.value = '';
        this.timeEl.value = '';
        this.colorEl.value = 'White';
        this.pinnedEl.checked = false;
        this.addBtn.innerText = 'Add Note';
        this.popupTitle.innerText = 'Add a new Note';
    }
}
