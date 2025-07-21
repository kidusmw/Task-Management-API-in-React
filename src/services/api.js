class TaskApiService {
  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api/tasks';
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllTasks() {
    const res = await fetch(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  }

  async createTask(taskData) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
  }

  async getTaskById(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch task');
    return await res.json();
  }

  async updateTask(id, taskData) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  }

  async patchTask(id, taskData) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to patch task');
    return await res.json();
  }

  async deleteTask(id) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return true;
  }
}

export const taskApi = new TaskApiService();
