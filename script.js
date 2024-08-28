document.getElementById('addCardForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardTitle = document.getElementById('cardTitle').value;
    document.getElementById('cardTitle').value = "";
    document.getElementById('cardTitle').focus();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadCards();
        }
    };
    xhr.send(`action=addCard&cardTitle=${cardTitle}`);
});

document.getElementById('editCardForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardTitle = document.getElementById('editCardTitle').value;
    const originalTitle = document.getElementById('editCardTitle').getAttribute('data-original-title');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadCards();
            closeModal();
        }
    };
    xhr.send(`action=editCard&originalTitle=${originalTitle}&newTitle=${cardTitle}`);
});

document.getElementById('addSubtaskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardTitle = document.getElementById('addSubtaskForm').getAttribute('data-card-title');
    const subtaskDescription = document.getElementById('subtaskDescription').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadCards();
            closeSubtaskModal();
            document.getElementById('subtaskDescription').value = "";
        }
    };
    xhr.send(`action=addSubtask&cardTitle=${cardTitle}&subtaskDescription=${subtaskDescription}`);
});

function loadCards() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'server.php?action=loadCards', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const cards = JSON.parse(xhr.responseText);
            document.getElementById('to-do-list').innerHTML = cards.toDo.map(card => `
                <li class="card" draggable="true" ondragstart="drag(event)" onclick="openEditModal('${card.title}')">
                    <span class="delete-button" onclick="deleteCard(event, '${card.title}')">X</span>
                    <span class="add-subtask-button" onclick="openSubtaskModal(event, '${card.title}')">+</span>
                    ${card.title}
                    <ul class="subtask-list">
                        ${card.subtasks.map(subtask => `
                            <li class="subtask">
                                <input type="checkbox" ${subtask.completed ? 'checked' : ''} onclick="toggleSubtask(event, '${subtask.id}')">
                                ${subtask.description}
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `).join('');
            document.getElementById('in-progress-list').innerHTML = cards.inProgress.map(card => `
                <li class="card" draggable="true" ondragstart="drag(event)" onclick="openEditModal('${card.title}')">
                    <span class="delete-button" onclick="deleteCard(event, '${card.title}')">X</span>
                    <span class="add-subtask-button" onclick="openSubtaskModal(event, '${card.title}')">+</span>
                    ${card.title}
                    <ul class="subtask-list">
                        ${card.subtasks.map(subtask => `
                            <li class="subtask">
                                <input type="checkbox" ${subtask.completed ? 'checked' : ''} onclick="toggleSubtask(event, '${subtask.id}')">
                                ${subtask.description}
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `).join('');
            document.getElementById('done-list').innerHTML = cards.done.map(card => `
                <li class="card" draggable="true" ondragstart="drag(event)" onclick="openEditModal('${card.title}')">
                    <span class="delete-button" onclick="deleteCard(event, '${card.title}')">X</span>
                    <span class="add-subtask-button" onclick="openSubtaskModal(event, '${card.title}')">+</span>
                    ${card.title}
                    <ul class="subtask-list">
                        ${card.subtasks.map(subtask => `
                            <li class="subtask">
                                <input type="checkbox" ${subtask.completed ? 'checked' : ''} onclick="toggleSubtask(event, '${subtask.id}')">
                                ${subtask.description}
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `).join('');
        }
    };
    xhr.send();
}

function drag(event) {
    event.dataTransfer.setData('text', (event.target.innerText.split("\n")[1]).split(" ")[1]);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const target = event.target.closest('.column').id;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadCards();
        }
    };
    xhr.send(`action=moveCard&cardTitle=${data}&target=${target}`);
}

function openEditModal(title) {
    document.getElementById('editCardTitle').value = title;
    document.getElementById('editCardTitle').setAttribute('data-original-title', title);
    document.getElementById('editModal').style.display = 'block';
}

function openSubtaskModal(event, title) {
    event.stopPropagation();
    document.getElementById('addSubtaskForm').setAttribute('data-card-title', title);
    document.getElementById('subtaskModal').style.display = 'block';
    document.getElementById('subtaskDescription').focus();
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function closeSubtaskModal() {
    document.getElementById('subtaskModal').style.display = 'none';
}

function deleteCard(event, title) {
    event.stopPropagation();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadCards();
        }
    };
    xhr.send(`action=deleteCard&cardTitle=${title}`);
}

function toggleSubtask(event, subtaskId) {
    const completed = event.target.checked;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadCards();
        }
    };
    xhr.send(`action=toggleSubtask&subtaskId=${subtaskId}&completed=${completed}`);
}

document.getElementsByClassName('close')[0].onclick = function() {
    closeModal();
}

document.getElementsByClassName('close')[1].onclick = function() {
    closeSubtaskModal();
}

window.onclick = function(event) {
    if (event.target == document.getElementById('editModal')) {
        closeModal();
    }
    if (event.target == document.getElementById('subtaskModal')) {
        closeSubtaskModal();
    }
}

loadCards();