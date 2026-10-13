document.addEventListener('DOMContentLoaded', () => {
    const tareas = document.getElementById('tareas');
    const tituloInput = document.getElementById('titulo');
    const cursoInput = document.getElementById('curso');
    const fechaInput = document.getElementById('fecha');
    const lista = document.getElementById('lista');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        if (tasks.length === 0) {
            lista.innerHTML = `<li class="list-group-item text-center text-muted py-3">No hay tareas registradas. ¡Agrega una arriba!</li>`;
            return;
        }
        lista.innerHTML = tasks.map((task, index) => {
            const { titulo, curso, fecha, completed } = task;

            return `
                <li class="list-group-item d-flex justify-content-between align-items-center ${completed ? 'list-group-item-success text-decoration-line-through' : ''}">
                    <div>
                        <strong>${titulo}</strong> - <span class="text-secondary">${curso}</span>
                        <br><small class="text-muted">Entrega: ${fecha}</small>
                    </div>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm ${completed ? 'btn-outline-warning' : 'btn-outline-success'}" onclick="toggleTask(${index})">
                            ${completed ? 'Pendiente' : 'Completado'}
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${index})">Eliminar</button>
                    </div>
                </li>
            `;
        }).join('');
    }

    tareas.addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = tituloInput.value.trim();
        const curso = cursoInput.value.trim();
        const fecha = fechaInput.value;

        const hoy = new Date().toISOString().split('T')[0];
        if (fecha <= hoy) {
            alert('! La fecha de entrega debe ser posterior a la fecha actual.');
            return;
        }

        const newTask = { 
            titulo,
            curso, 
            fecha, 
            completed: false 
        };
        tasks.push(newTask);
        saveAndRender();
        tareas.reset();
    });

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    window.toggleTask = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveAndRender();
    };

    window.deleteTask = function(index) {
        tasks.splice(index, 1);
        saveAndRender();
    };

    renderTasks();
});