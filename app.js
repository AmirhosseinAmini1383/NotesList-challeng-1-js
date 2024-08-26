import { notesList } from "./notesList.js";
const mainCart = document.querySelector(".main-cart");
const inputSearch = document.querySelector(".input-search");
const filterTodos = document.querySelector(".filter-todos");
const selectSort = document.querySelectorAll(".select-control");
let _noteListResult = [];
let status = "ALL";
class NoteList {
  getNoteList() {
    return notesList;
  }
}
class Storage {
  static saveNoteList(note) {
    return localStorage.setItem("NoteList", JSON.stringify(note));
  }
  static getAllNoteList() {
    return JSON.parse(localStorage.getItem("NoteList") || []);
  }
}

function filterNoteList(data, search) {
  return data.filter((item) =>
    item.title.toLowerCase().trim().includes(search.toLowerCase().trim())
  );
}

function displayNotelist(notes) {
  const colors = [
    "#d00000",
    "#3f88c5",
    "#ffba08",
    "#01804d",
    "#3d348b",
    "#ff6d00",
    "#dd2d4a",
    "#0d41e1",
    "#004068",
  ];
  let result = "";
  notes.forEach((item, index) => {
    const color = colors[index % colors.length];
    result += `
    <div class="cart-content ${
      item.completed ? "completed" : ""
    }" style="background-color:${color}">
    <p class="cart-title ${item.completed ? "completed-txt" : ""}">${
      item.title
    }</p>
    <p class="cart-description ${item.completed ? "completed-txt" : ""}">${
      item.description
    }</p>
    <div class="cart-item-footer">
    <p class="cart-item-date">${new Date(item.createdAt).toLocaleDateString(
      "UTC",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }
    )}</p>
    <div>
    <svg class="icon check" data-note-id=${item.id}>
    <use xlink:href="assets/images/icons.svg#task-done"></use>
    </svg>
    <svg class="icon delete" data-note-id=${item.id}>
    <use xlink:href="assets/images/icons.svg#trash"></use>
    </svg>
    </div>
    </div>
    </div>
    `;
  });
  mainCart.innerHTML = result;
  actionBtns();
}
function actionBtns() {
  const checkBtns = document.querySelectorAll(".check");
  const deleteBtns = document.querySelectorAll(".delete");
  checkBtns.forEach((btns) => {
    btns.addEventListener("click", (e) => {
      const notes = Storage.getAllNoteList();
      const noteId = +e.target.dataset.noteId;
      const note = notes.find((note) => note.id === noteId);
      note.completed = !note.completed;
      Storage.saveNoteList(notes);
      statusNoteList(notes);
    });
  });
  deleteBtns.forEach((btns) => {
    btns.addEventListener("click", (e) => {
      const notes = Storage.getAllNoteList();
      const noteId = +e.target.dataset.noteId;
      const filterNotes = notes.filter((note) => note.id !== noteId);
      Storage.saveNoteList(filterNotes);
      statusNoteList(filterNotes);
    });
  });
}

inputSearch.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase().trim();
  const notes = Storage.getAllNoteList();
  _noteListResult = filterNoteList(notes, inputValue);
  statusNoteList(_noteListResult);
});

function statusNoteList(data) {
  switch (status) {
    case "ALL": {
      displayNotelist(data);
      break;
    }
    case "COMPLETED": {
      const filterStatus = data.filter((item) => item.completed);
      displayNotelist(filterStatus);
      break;
    }
    case "UNCOMPLETED": {
      const filterStatus = data.filter((item) => !item.completed);
      displayNotelist(filterStatus);
      break;
    }
    default:
      throw new Error("NO MATCHING STATUS");
  }
}
filterTodos.addEventListener("change", (e) => {
  status = e.target.value;
  const notes = Storage.getAllNoteList();
  statusNoteList(notes);
});
function sortNoteList(data, sort) {
  if (sort === "latest") {
    return data.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
  if (sort === "earliest") {
    return data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
selectSort.forEach((btnSort) => {
  btnSort.addEventListener("click", (event) => {
    let sortType;
    const notes = Storage.getAllNoteList();
    if (event.target.classList.contains("Ascending")) {
      sortType = "latest";
    } else if (event.target.classList.contains("Descending")) {
      sortType = "earliest";
    }
    if (sortType) {
      const newSortNote = sortNoteList(notes, sortType);
      statusNoteList(newSortNote);
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const noteList = new NoteList();
  const noteListData = noteList.getNoteList();
  displayNotelist(noteListData);
  Storage.saveNoteList(noteListData);
});
