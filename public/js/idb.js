const indexedDB = window.indexedDB

let db
const request = indexedDB.open('budget', 1)

request.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore('new_entry', { autoIncrement: true })
}

request.onsuccess = function(event) {
    db = event.target.result
    if (navigator.online) {
        addEntry()
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(['new_entry'], 'readwrite')
    const store = transaction.objectStore('new_entry')
    store.add(record)
}

function addEntry() {
    const transaction = db.transaction(['new_entry', 'readwrite'])
    const store = transaction.objectStore('new_entry')
    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/jason, text/plain, */*',
                    'Content-Type': 'Application/json'
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(['new_entry'], 'readwrite')
                const store = transaction.objectStore('new_entry')
                store.clear()
                alert('Changes submitted')
            })
            .catch (err => {
                console.log(err)
            })
        }
    }
}

window.addEventListener('online', addEntry)