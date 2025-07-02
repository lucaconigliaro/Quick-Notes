// Array globale che contiene tutte le note
let notes = []

// Variabile per tenere traccia se stiamo modificando una nota esistente
let editingNoteId = null

// Carica le note salvate da localStorage, o ritorna un array vuoto se non ci sono
function loadNotes() {
  const savedNotes = localStorage.getItem('quickNotes')
  return savedNotes ? JSON.parse(savedNotes) : []
}

// Salva la nota nuova o modificata
function saveNote(event) {
  event.preventDefault() // blocca il comportamento di default del form (refresh pagina)

  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if(editingNoteId) {
    // Se stiamo modificando una nota esistente

    const noteIndex = notes.findIndex(note => note.id === editingNoteId)
    notes[noteIndex] = {
      ...notes[noteIndex], // mantieni proprietà esistenti
      title: title,
      content: content
    }

  } else {
    // Altrimenti, aggiungi una nuova nota all'inizio dell'array
    notes.unshift({
      id: generateId(), // genera un id unico
      title: title,
      content: content
    })
  }

  closeNoteDialog() // chiudi la finestra del dialogo
  saveNotes()       // salva tutte le note aggiornate nel localStorage
  renderNotes()     // aggiorna la visualizzazione delle note
}

// Genera un id unico basato sul timestamp corrente
function generateId() {
  return Date.now().toString()
}

// Salva l'array delle note su localStorage in formato JSON
function saveNotes() {
  localStorage.setItem('quickNotes', JSON.stringify(notes))
}

// Elimina una nota dato il suo id
function deleteNote(noteId) {
  notes = notes.filter(note => note.id != noteId) // filtra fuori la nota con id uguale a noteId
  saveNotes()
  renderNotes()
}

// Mostra tutte le note nella pagina, o un messaggio se non ci sono note
function renderNotes() {
  const notesContainer = document.getElementById('notesContainer');

  if(notes.length === 0) {
    // se non ci sono note, mostra messaggio di stato vuoto
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>Nessuna nota presente</h2>
        <p>Crea la tua prima nota per iniziare!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Aggiungi la tua prima nota</button>
      </div>
    `
    return
  }

  // se ci sono note, crea il markup HTML per ciascuna nota
  notesContainer.innerHTML = notes.map(note => `
    <div class="note-card">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Modifica nota">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Elimina nota">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>
    </div>
    `).join('')
}

// Apre il dialogo per aggiungere o modificare una nota
function openNoteDialog(noteId = null) {
  const dialog = document.getElementById('noteDialog');
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');

  if(noteId) {
    // Modalità modifica
    const noteToEdit = notes.find(note => note.id === noteId)
    editingNoteId = noteId
    document.getElementById('dialogTitle').textContent = 'Modifica Nota'
    titleInput.value = noteToEdit.title
    contentInput.value = noteToEdit.content
  }
  else {
    // Modalità aggiunta nuova nota
    editingNoteId = null
    document.getElementById('dialogTitle').textContent = 'Aggiungi Nuova Nota'
    titleInput.value = ''
    contentInput.value = ''
  }

  dialog.showModal()
  titleInput.focus()
}

// Chiude il dialogo della nota
function closeNoteDialog() {
  document.getElementById('noteDialog').close()
}

// Cambia tema tra chiaro e scuro e salva la scelta su localStorage
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

// Applica il tema salvato all'avvio della pagina
function applyStoredTheme() {
  if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme')
    document.getElementById('themeToggleBtn').textContent = '☀️'
  }
}

// Quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
  applyStoredTheme()    // Applica il tema salvato
  notes = loadNotes()   // Carica le note salvate
  renderNotes()         // Mostra le note

  // Event listener per il form di salvataggio nota
  document.getElementById('noteForm').addEventListener('submit', saveNote)

  // Event listener per il bottone di cambio tema
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

  // Chiude il dialogo se clicco fuori dal contenuto (sul backdrop)
  document.getElementById('noteDialog').addEventListener('click', function(event) {
    if(event.target === this) {
      closeNoteDialog()
    }
  })
})