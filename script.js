const popupBox = document.querySelector('.popup-box')
const popupTitle = document.querySelector('header p')
const popupIconClose = document.querySelector('header i')
const inputPopup = document.querySelector('input')
const textareaPopup = document.querySelector('textarea')
const addBtn = document.querySelector('button')
const wrapper = document.querySelector('.wrapper')
const addBox = document.querySelector('.add-box')
let isUpdate = false
let updateID = null
let notes = []

addBox.addEventListener('click', () => showModal())
const showModal = (noteTitle, noteDesc) => {
    popupBox.classList.add('show')
    inputPopup.focus()
    if (isUpdate) {
        popupTitle.innerHTML = 'Update Main Note'
        addBtn.innerHTML = 'Update Note'
        inputPopup.value = noteTitle
        textareaPopup.value = noteDesc
    } else {
        popupTitle.innerHTML = 'Add Note New'
        addBtn.innerHTML = 'Add Note'
    }
}
addBtn.addEventListener('click', () => {
    if (isUpdate) {
        let allNotes = getLocaleStorage()
        allNotes.some((note,index) => {
            if (index === updateID) {
                note.titleNote = inputPopup.value
                note.description = textareaPopup.value
            }
        })
        setLocalStorage(allNotes)
        generateNotes(allNotes)
        closeNotes()
        closesBox()
        isUpdate = false
    } else {
        let newNotes = {
        titleNote: inputPopup.value,
        description: textareaPopup.value,
        date: getItem()
    }
    notes.push(newNotes)
    setLocalStorage(notes)
    generateNotes(notes)
    closesBox()
    closeNotes()
    }
    
})
const closesBox = () => {
    inputPopup.value = ''
    textareaPopup.value = ''
}
const closeNotes = () => {
    popupBox.classList.remove('show')
}
const setLocalStorage = (notes) => {
     localStorage.setItem('notes', JSON.stringify(notes))
}
const getLocaleStorage = () => {
    let localStorageNotes = localStorage.getItem('notes')

    if (localStorageNotes) {
        notes = JSON.parse(localStorageNotes)
    } else {
        notes = []
    }
    return notes
}
const generateNotes = (note) => {
    document.querySelectorAll('.note').forEach(note => note.remove())
    note.forEach((notes,index) => {
        wrapper.insertAdjacentHTML('beforeend',`<li class="note">
        <div class="details">
          <p>${notes.titleNote}</p>
          <span>${notes.description}</span>
        </div>
        <div class="bottom-content">
          <span>${notes.date}</span>
          <div class="settings">
            <i class="uil uil-ellipsis-h" onclick="showSetting(this)"></i>
            <ul class="menu">
              <li onclick="editNote(${index}, '${notes.titleNote}', '${notes.description}')">
                <i class="uil uil-pen"></i>Edit
              </li>
              <li onclick="removeNote(${index})">
                <i class="uil uil-trash"></i>Delete
              </li>
            </ul>
          </div>
        </div>
      </li>`)
    })
}
const editNote = (noteID,noteTitle,noteDesc) => {
    isUpdate = true
    showModal(noteID,noteTitle,noteDesc)
    updateID = noteID
    
}
const removeNote = (noteIndex) => {
    let deleted = confirm('Are you sure to delete note?!')

    if (deleted) {
        let newNote = getLocaleStorage()
        newNote.splice(noteIndex,1)
        setLocalStorage(newNote)
        generateNotes(newNote)
    }
}
const showSetting = (el) => {
    el.parentElement.classList.add('show')

    document.addEventListener('click', e => {
        if (e.target.tagName !== 'I' || e.target != el) {
            el.parentElement.classList.remove('show')
        }
    })
}
const getItem = () => {
    let now = new Date()
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let newDay = now.getDay()
    let newMonth = now.getMonth()
    let newYear = now.getFullYear()
    let dayOfMonth = now.getDate()

    return `${months[newMonth]} ${dayOfMonth}, ${newYear} (${days[newDay]})`
}

popupIconClose.addEventListener('click', closeNotes)
window.addEventListener('keyup', e => {
    if (e.which == 27) {
        closeNotes()
    }
})
window.addEventListener('load', () => {
    let notes = getLocaleStorage()
    generateNotes(notes)
})