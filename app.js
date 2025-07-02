let notes = [];

function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(event) {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    notes.unshift({
        id: generateId(),
        title: title,
        content: content
    });

    saveNotes();
    renderNotes();
}

function generateId() {
    return Date.now().toString();
}

function saveNotes(){
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    if(notes.length === 0) {
        notesContainer.innerHTML = `
          <div class="empy-state">
            <h2> No notes yet</h2>
            <p>Create your first note to get Started!</p>
            <button class="add-note-btn" onclick="openNoteDialog()">+ Add your first Note</button>
          </div>   
        `;

        return;
    }

    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">
          <h3>${note.title}</h3>
          <p class="note-content">${note.content}</p>
        </div>
        `).join('');
}

function openNoteDialog() {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    dialog.showModal();
    titleInput.focus();
}

function closeNoteDialog() {
    document.getElementById('noteDialog').closest();
}

document.addEventListener('DOMContentLoaded', function () {
    notes = loadNotes();
    renderNotes();

    document.getElementById('noteForm').addEventListener('submit', saveNote);

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if(event.target === this) {
            closeNoteDialog();
        }
    })
})