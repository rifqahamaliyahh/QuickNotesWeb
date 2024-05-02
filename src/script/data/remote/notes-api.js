class NotesApi {
  static BASE_URL = "https://notes-api.dicoding.dev/v2";

  static async getNotes() {
    const response = await fetch(`${this.BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch notes: ${response.status} - ${response.statusText}`);
    }
    const { status, message, data } = await response.json();
    return { status, message, data };
  }
  
  static async getArchivedNotes() {
    const response = await fetch(`${this.BASE_URL}/notes/archived`);
    if (!response.ok) {
      throw new Error(`Failed to fetch archived notes: ${response.status} - ${response.statusText}`);
    }
    const { status, message, data } = await response.json();
    return { status, message, data };
  }

  static async createNote(title, body) {
    const response = await fetch(`${this.BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
      }),
    });

    const data = await response.json();
    const formattedResponse = {
      status: "success",
      message: "Note created",
      data: {
        id: data.id,
        title: data.title,
        body: data.body,
        archived: data.archived,
        createdAt: data.createdAt,
      },
    };

    return formattedResponse;
  }

  static async deleteNote(noteId) {
    const response = await fetch(`${this.BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  }

  static async archiveNote(noteId) {
    const response = await fetch(`${this.BASE_URL}/notes/${noteId}/archive`, {
      method: "POST",
    });
    const data = await response.json();
    return data;
  }

  static async unarchiveNote(noteId) {
    const response = await fetch(`${this.BASE_URL}/notes/${noteId}/unarchive`, {
      method: "POST",
    });
    const data = await response.json();
    return data;
  }
}

export default NotesApi;
