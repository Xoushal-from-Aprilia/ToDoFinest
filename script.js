// script.js
let clients = JSON.parse(localStorage.getItem('clients')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayClients(clients);
});

function addClient() {
    const name = document.getElementById('clientName').value;
    const details = document.getElementById('clientDetails').value;
    const day = document.getElementById('clientDay').value;

    if (name === '' || details === '') {
        alert('Per favore, inserisci tutti i dati del cliente.');
        return;
    }

    const client = {
        id: Date.now(),
        name,
        details,
        day
    };

    clients.push(client);
    localStorage.setItem('clients', JSON.stringify(clients));
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
        li.innerHTML = `${client.name} - ${client.details} (${client.day}) 
                        <button onclick="removeClient(${client.id})">Rimuovi</button>`;
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

function removeClient(id) {
    clients = clients.filter(client => client.id !== id);
    localStorage.setItem('clients', JSON.stringify(clients));
    displayClients(clients);
}

function exportToWord() {
    const filterDay = document.getElementById('filterDay').value;
    let filteredClients = clients;

    if (filterDay !== 'Tutti') {
        filteredClients = clients.filter(client => client.day === filterDay);
    }

    const doc = new docx.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx.Paragraph({
                        text: `Clienti del giorno: ${filterDay}`,
                        heading: docx.HeadingLevel.HEADING_1
                    }),
                    ...filteredClients.map(client => new docx.Paragraph(`${client.name} - ${client.details} (${client.day})`))
                ],
            },
        ],
    });

    docx.Packer.toBlob(doc).then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'clienti.docx';
        link.click();
    });
}
