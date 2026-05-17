// Check authentication
checkAuth();

// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', loadDashboard);

async function loadDashboard() {
    try {
        const response = await fetchAPI('/tasks?limit=100');
        const data = await response.json();

        if (!response.ok) {
            showNotification('Błąd wczytywania danych', 'danger');
            return;
        }

        // Calculate statistics
        const tasks = data.data || [];
        const stats = {
            newTasks: tasks.filter(t => t.status === 'pending').length,
            inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
            completedTasks: tasks.filter(t => t.status === 'completed').length,
            overdueTasks: tasks.filter(t => {
                return t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed';
            }).length,
        };

        // Update statistics cards
        document.getElementById('newTasksCount').textContent = stats.newTasks;
        document.getElementById('inProgressCount').textContent = stats.inProgressTasks;
        document.getElementById('completedCount').textContent = stats.completedTasks;
        document.getElementById('overdueCount').textContent = stats.overdueTasks;

        // Load recent tasks
        loadRecentTasks(tasks.slice(0, 5));
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
}

function loadRecentTasks(tasks) {
    const tbody = document.getElementById('recentTasksBody');
    tbody.innerHTML = '';

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Brak zadań</td></tr>';
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${task.title}</strong></td>
            <td>${getStatusBadge(task.status)}</td>
            <td>${getPriorityBadge(task.priority)}</td>
            <td>${formatDate(task.due_date)}</td>
            <td>
                <a href="/tasks?task=${task.id}" class="btn btn-sm btn-outline-primary">Edytuj</a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// New task form handler
document.getElementById('newTaskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value || null,
        priority: document.getElementById('taskPriority').value,
        due_date: document.getElementById('taskDueDate').value || null,
    };

    try {
        const response = await fetchAPI('/tasks', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            showNotification('Zadanie dodane pomyślnie!', 'success');
            document.getElementById('newTaskForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('newTaskModal')).hide();
            loadDashboard();
        } else {
            const error = await response.json();
            showNotification(`Błąd: ${error.message || 'Nie udało się dodać zadania'}`, 'danger');
        }
    } catch (error) {
        showNotification(`Błąd: ${error.message}`, 'danger');
    }
});
