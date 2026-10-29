import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTasks() {
    setError('');
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error('Impossible de charger les tâches.');
      setTasks(await response.json());
    } catch {
      setError('Connexion à l’API impossible. Vérifie que les conteneurs sont démarrés.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setError('');
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle })
      });
      if (!response.ok) throw new Error();
      setTitle('');
      await loadTasks();
    } catch {
      setError('La tâche n’a pas pu être ajoutée.');
    }
  }

  async function toggleTask(id) {
    try {
      const response = await fetch(`${API}/${id}/toggle`, { method: 'PATCH' });
      if (!response.ok) throw new Error();
      await loadTasks();
    } catch {
      setError('Impossible de modifier cette tâche.');
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      await loadTasks();
    } catch {
      setError('Impossible de supprimer cette tâche.');
    }
  }

  const completed = tasks.filter(task => task.completed).length;

  return (
    <main className="page">
      <section className="panel">
        <div className="eyebrow">DÉMO FULL-STACK · DOCKER</div>
        <h1>Mes tâches</h1>
        <p className="intro">Une petite application React, Spring Boot et MySQL.</p>

        <form onSubmit={addTask} className="add-form">
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="Ex. Déployer le projet sur AWS"
            maxLength={180}
            aria-label="Titre de la tâche"
          />
          <button type="submit">Ajouter</button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="summary">
          <span>{tasks.length} tâche{tasks.length > 1 ? 's' : ''}</span>
          <span>{completed} terminée{completed > 1 ? 's' : ''}</span>
        </div>

        {loading ? <p className="muted">Chargement…</p> : (
          tasks.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">✓</span>
              <strong>Tout commence ici</strong>
              <p>Ajoute ta première tâche ci-dessus.</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task.id} className={task.completed ? 'task done' : 'task'}>
                  <button
                    className="check"
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
                  >{task.completed ? '✓' : ''}</button>
                  <span className="task-title">{task.title}</span>
                  <button className="delete" onClick={() => deleteTask(task.id)} aria-label="Supprimer">×</button>
                </li>
              ))}
            </ul>
          )
        )}
        <footer>Frontend React · API Java 21 · Base MySQL</footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
