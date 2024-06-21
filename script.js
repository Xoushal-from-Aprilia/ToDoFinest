// script.js
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let currentClient = {};

document.addEventListener('DOMContentLoaded', () => {
    displayClients(clients);
});

function addClient() {
    const name = document.getElementById('clientName').value;
    const day = document.getElementById('clientDay').value;

    if (name === '' || !currentClient.street || !currentClient.civic || !currentClient.location) {
        alert('Per favore, inserisci tutti i dati del cliente.');
        return;
    }

    const client = {
        id: Date.now(),
        name,
        street: currentClient.street,
        civic: currentClient.civic,
        location: currentClient.location,
        day
    };

    clients.push(client);
    localStorage.setItem('clients', JSON.stringify(clients));
    displayClients(clients);
    clearInputs();
}

function clearInputs() {
    document.getElementById('clientName').value = '';
    currentClient = {};
}

function displayClients(clientsToDisplay) {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';

    clientsToDisplay.forEach(client => {
        const li = document.createElement('li');
        li.innerHTML = `${client.name} 
                        <button onclick="removeClient(${client.id})">Rimuovi</button>
                        <button class="map-btn" onclick="openInMaps('${client.street} ${client.civic}, ${client.location}')">🡪</button>`;
        li.onclick = () => showClientDetails(client);
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
                    ...filteredClients.map(client => new docx.Paragraph(`${client.name} - ${client.street}, ${client.civic}, ${client.location} (${client.day})`))
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

function showAnagraficaPopup() {
    document.getElementById('anagraficaPopup').style.display = 'block';
}

function closeAnagraficaPopup() {
    document.getElementById('anagraficaPopup').style.display = 'none';
}

function saveAnagrafica() {
    currentClient.street = document.getElementById('clientStreet').value;
    currentClient.civic = document.getElementById('clientCivic').value;
    currentClient.location = document.getElementById('clientLocation').value;
    closeAnagraficaPopup();
}

function showClientDetails(client) {
    const detailsText = `${client.name}<br>Via: ${client.street}<br>Civico: ${client.civic}<br>Località: ${client.location}<br>Giorno: ${client.day}`;
    document.getElementById('clientDetailsText').innerHTML = detailsText;
    document.getElementById('detailsPopup').style.display = 'block';
}

function closeDetailsPopup() {
    document.getElementById('detailsPopup').style.display = 'none';
}

function openInMaps(address) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}
