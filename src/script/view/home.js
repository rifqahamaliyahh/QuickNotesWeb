import NotesApi from '../../script/data/remote/notes-api.js';

const home = async () => {
    const displaySavedNotes = async () => {
        try {
            console.log('Fetching saved notes...');
            const { data } = await NotesApi.getNotes();
            console.log('Data from API:', data);
            const savedNotesList = document.querySelector('#saved-notes note-list');

            savedNotesList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(note => {
                    const existingNote = savedNotesList.querySelector(`note-item[data-id="${note.id}"]`);
                    if (!existingNote) {
                        createNoteItem(savedNotesList, note);
                    }
                });
            } else {
                console.log('No saved notes found.');
            }
        } catch (error) {
            console.error('Error fetching saved notes:', error);
        }
    };

    const displayArchivedNotes = async () => {
        try {
            console.log('Fetching archived notes...');
            const { data } = await NotesApi.getArchivedNotes();
            const archivedNotesList = document.querySelector('#archived-notes note-list');

            archivedNotesList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(note => {
                    const existingNote = archivedNotesList.querySelector(`note-item[data-id="${note.id}"]`);
                    if (!existingNote) {
                        createNoteItem(archivedNotesList, note);
                    }
                });
            } else {
                console.log('No archived notes found.');
            }
        } catch (error) {
            console.error('Error fetching archived notes:', error);
        }
    };

    const createNoteItem = (parentElement, note) => {
        const newNote = document.createElement('note-item');
        newNote.setAttribute('data-id', note.id);
        newNote.setAttribute('data-title', note.title);
        newNote.setAttribute('data-created-at', note.createdAt);
        newNote.setAttribute('data-archived', note.archived);
        newNote.setAttribute('data-body', note.body);
        parentElement.appendChild(newNote);
    };

    const addNoteHandler = async (event) => {
        event.preventDefault();
        const title = document.getElementById('note-title').value.trim();
        const body = document.getElementById('note-body').value.trim();

        if (!title || !body) {
            alert("Both title and note's body must be filled!");
            return;
        }

        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        try {
            await NotesApi.createNote(title, body);
            document.getElementById('note-title').value = '';
            document.getElementById('note-body').value = '';
            await displaySavedNotes();
            await displayArchivedNotes();
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            loader.style.display = 'none';
        }
    };

    displaySavedNotes();
    displayArchivedNotes();
    document.getElementById('add-note').addEventListener('click', addNoteHandler);
};

export default home;
