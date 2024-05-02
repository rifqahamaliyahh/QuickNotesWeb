import NotesApi from "../data/remote/notes-api.js";

class NoteItem extends HTMLElement {
    static observedAttributes = [
        "data-id",
        "data-title",
        "data-body",
        "data-created-at",
        "data-archived",
    ];

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "open" });
        this._template = document
            .getElementById("noteItem")
            .content.cloneNode(true);
    }

    connectedCallback() {
        const titleElement = this._template.querySelector(".note__title");
        const dateElement = this._template.querySelector(".note__date");
        const descriptionElement =
            this._template.querySelector(".note__description");

        if (titleElement && dateElement && descriptionElement) {
            this._shadowRoot.appendChild(this._template);
            this.updateContent();

            const deleteButton = this._shadowRoot.querySelector(".btn-remove");
            if (deleteButton) {
                deleteButton.addEventListener("click", () => {
                    this.deleteNote();
                });
            }

            const archivedButton = this._shadowRoot.querySelector(".btn-archive");
            if (archivedButton) {
                archivedButton.addEventListener("click", this.archiveNote.bind(this));
            }
        }
    }

    updateContent() {
        const titleSlot = this._shadowRoot.querySelector('slot[name="title"]');
        const dateSlot = this._shadowRoot.querySelector('slot[name="short-date"]');
        const descriptionSlot = this._shadowRoot.querySelector(
            'slot[name="short-description"]',
        );

        if (titleSlot && dateSlot && descriptionSlot) {
            titleSlot.textContent = this.getAttribute("data-title") || "Note's Title";
            dateSlot.textContent =
                this.getAttribute("data-created-at") || "Added Date";
            descriptionSlot.textContent =
                this.getAttribute("data-body") || "Note's Body";
        }
    }

    createNote() {
        console.log("Creating new note...");
        const title = "New Note Title";
        const body = "New Note Body";

        NotesApi.createNote(title, body)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => console.error("Error creating note:", error));
    }

    deleteNote() {
        const noteId = this.getAttribute("data-id");
        this.remove();
        NotesApi.deleteNote(noteId)
            .then((response) => console.log(response))
            .catch((error) => console.error("Error deleting note:", error));
    }

    archiveNote() {
        const noteId = this.getAttribute("data-id");
        const isArchived = this.getAttribute("data-archived") === "true";

        if (!isArchived) {
            NotesApi.archiveNote(noteId)
                .then((response) => {
                    console.log(response);
                    this.setAttribute("data-archived", "true");
                    this._moveToArchive();
                })
                .catch((error) => console.error("Error archiving note:", error));
        } else {
            NotesApi.unarchiveNote(noteId)
                .then((response) => {
                    console.log(response);
                    this.setAttribute("data-archived", "false");
                    this._moveFromArchive();
                })
                .catch((error) => console.error("Error unarchiving note:", error));
        }
    }

    _moveToArchive() {
        const archiveSection = document.querySelector("#archived-notes note-list");
        const noteItem = this;

        if (archiveSection && noteItem) {
            const archiveButton = noteItem.querySelector(".btn-archive");
            if (archiveButton) {
                archiveButton.removeEventListener("click", this.archiveNote.bind(this));
            }
            archiveSection.appendChild(noteItem);
        }
    }

    _moveFromArchive() {
        const savedNotesSection = document.querySelector("#saved-notes note-list");
        if (savedNotesSection) {
            savedNotesSection.appendChild(this);
        }
    }
}

customElements.define("note-item", NoteItem);
