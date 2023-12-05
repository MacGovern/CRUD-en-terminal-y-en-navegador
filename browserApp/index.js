const btnPost = document.getElementById('btnPost');
const nameInputPost = document.getElementById('inputPostNombre');
const descriptionInputPost = document.getElementById('inputPostDescripcion');
const statusInputPost = document.getElementById('inputPostEstado');
const displayedResults = document.getElementById('results');

function toLocalTime(dateTime) {
    return (new Date(dateTime)).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(', ', ' - ');
}

function btnActivation() {
    if (nameInputPost.value === '' || descriptionInputPost.value === '' || statusInputPost.value === '')
        btnPost.setAttribute('disabled', true);
    else
        btnPost.removeAttribute('disabled');
}

function showAlert() {
    const errorAlert = document.getElementById('alert-error');
    errorAlert.classList.replace('d-none', 'd-block');
    setTimeout(() => errorAlert.classList.replace('d-block', 'd-none'), 2500);
}

function addToDisplayedResults(task) {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `
                <div class="row p-3">
                    <div class="col-sm-auto col-lg-9 col-xl-10">
                        <p>NOMBRE: ${task.name}</p>
                        <p>DESCRIPCION: ${task.description}</p>
                        <p>ESTADO: ${task.status}</p>
                        <p>FECHA DE CREACION: ${toLocalTime(task.created_at)}</p>
                    </div>
                    <div class="col-sm-auto col-lg-3 col-xl-2 d-flex align-items-center">
                        <button class="btn btn-danger mt-4 mb-3" onclick="deleteTask(${task.id})">Eliminar</button>
                    </div>
                </div>
            `;
    displayedResults.appendChild(li);
}

async function getTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks/');
        const result = await response.json();
        if (!response.ok)
            throw Error;
        else {
            displayedResults.innerHTML = '';
            result.forEach(task => addToDisplayedResults(task));
        }
    } catch (error) {
        showAlert();
    }
}

async function createTask() {
    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInputPost.value,
                description: descriptionInputPost.value,
                status: statusInputPost.value
            })
        });
        if (!response.ok)
            throw Error;
        else
            await getTasks();
    } catch (error) {
        showAlert();
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
        if (!response.ok)
            throw Error;
        else
            await getTasks();
    } catch (error) {
        showAlert();
    }
}

btnPost.addEventListener('click', async () => {
    btnPost.setAttribute('disabled', true);
    await createTask();
    nameInputPost.value = '';
    descriptionInputPost.value = '';
    statusInputPost.value = '';
});