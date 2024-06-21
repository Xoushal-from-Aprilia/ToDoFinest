// script.js
let clients = [];

function addClient() {
    const name = document.getElementById('clientName').value;
    const details = document.getElementById('clientDetails').value;
    const day = document.getElementById('clientDay').value;

    if (name === '' || details === '') {
        alert('Per favore, inserisci tutti i dati del cliente.');
        return;
    }

    const client = {
        name,
        details,
        day
    };

    clients.push(client);
    displayClients(clients);
    clearInputs();
}

function clearInputs() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientDetails').value = '';
    document.getElementById('clientDay').value = 'Lunedì';
}

function displayClients(clientsToDisplay) {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';

    clientsToDisplay.forEach(client => {
        const li = document.createElement('li');
        li.textContent = `${client.name} - ${client.details} (${client.day})`;
        clientList.appendChild(li);
    });
}

function filterClients() {
    const filterDay = document.getElementById('filterDay').value;
    let filteredClients = clients;

    if (filterDay !== 'Tutti') {
        filteredClients = clients.filter(client => client.day === filterDay);
    }

    displayClients(filteredClients);
}