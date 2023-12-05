require('colors');
const axios = require('axios').default;
const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

const baseURL = 'http://localhost:3000/tasks';

async function addTask(name, description, status) {
    try {
        await axios.post(baseURL, { name, description, status });
        console.log('Tarea agregada exitosamente\n'.green)
    } catch (error) {
        console.error('Error al agregar tarea.'.red);
    } finally {
        selectOption();
    }
}

async function removeTask(id) {
    try {
        await axios.delete(`${baseURL}/${id}`);
        console.log('Tarea eliminada exitosamente.\n'.green);
    } catch (error) {
        console.error('Error al eliminar tarea.\n'.red);
    } finally {
        selectOption();
    }
}

async function showTasks() {
    try {
        const response = await axios.get(baseURL);
        console.log('\nLista de tareas:\n'.green);
        console.log(response.data);
        console.log('\n');
    } catch (error) {
        console.error('Error al mostrar tareas.\n'.red);
    } finally {
        selectOption();
    }
}

function showMenu() {
    console.log('==============================='.yellow);
    console.log('       Gestor de Tareas')
    console.log('===============================\n'.yellow);
    console.log(`${'1.'.yellow} Agregar una tarea\n`);
    console.log(`${'2.'.yellow} Eliminar una tarea\n`);
    console.log(`${'3.'.yellow} Mostrar todas las tareas\n`);
    console.log(`${'4.'.yellow} Limpiar terminal\n`);
    console.log(`${'5.'.yellow} Mostrar menú\n`);
    console.log(`${'0.'.yellow} Salir\n\n`);
}

function selectOption() {
    readline.question('Seleccione una opción: '.yellow, async (option) => {
        switch (option) {
            case '1':
                console.log('\nProporcione los datos de la tarea que desea agregar\n');
                readline.question('Nombre: ', (inputName) => {
                    const name = inputName;
                    readline.question('Descripción: ', (inputDescription) => {
                        const description = inputDescription;
                        readline.question('Estado: ', async (inputStatus) => {
                            const status = inputStatus;
                            await addTask(name, description, status);
                        });
                    })
                });
                break;
            case '2':
                readline.question('\nProporcione el ID de la tarea que desea eliminar: ', async (id) => {
                    await removeTask(id);
                });
                break;
            case '3':
                await showTasks();
                break;
            case '4':
                console.clear();
                showMenu();
                selectOption();
                break;
            case '5':
                console.log('\n');
                showMenu();
                selectOption();
                break;
            case '0':
                console.log('\n');
                process.exit();
            default:
                console.log('Seleccione una opción válida\n'.red);
                selectOption();
                break;
        }
    });
}

console.clear();
showMenu();
selectOption();