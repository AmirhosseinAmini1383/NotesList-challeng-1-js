import { notesList } from "./notesList.js";
const mainCart = document.querySelector(".main-cart");
const inputSearch = document.querySelector(".input-search");
const filterTodos = document.querySelector(".filter-todos");
let _noteListResult = [];
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
  let result = "";
  notes.forEach((item) => {
    result += `
    <div class="cart-content ${item.completed ? "completed" : ""}">
    <p class="cart-title">${item.title}</p>
    <p class="cart-description">${item.description}</p>
    <div class="cart-item-footer">
    <p class="cart-item-date">${new Date(item.createdAt).toLocaleDateString(
      "UTC",
      {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      }
    )}</p>
    <div>
    <svg class="icon check" data-id=${item.id}>
    <use xlink:href="assets/images/icons.svg#task-done"></use>
    </svg>
    <svg class="icon delete" data-id=${item.id}>
    <use xlink:href="assets/images/icons.svg#trash"></use>
    </svg>
    </div>
    </div>
    </div>
    `;
  });
  mainCart.innerHTML = result;
  // Storage.saveNoteList(notes);
  actionBtns();
}
function actionBtns() {
  const checkBtns = document.querySelectorAll(".check");
  const deleteBtns = document.querySelectorAll(".delete");
  checkBtns.forEach((btns) => {
    btns.addEventListener("click", (e) => {
      console.log(e.target.dataset.id);
    });
  });
  deleteBtns.forEach((btns) => {
    btns.addEventListener("click", (e) => {
      console.log(e.target.dataset.id);
    });
  });
}

inputSearch.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase().trim();
  const notes = Storage.getAllNoteList();
  _noteListResult = filterNoteList(notes, inputValue);
  console.log(_noteListResult);
  // Storage.saveNoteList(_noteListResult);
  displayNotelist(_noteListResult);
});
document.addEventListener("DOMContentLoaded", () => {
  const noteList = new NoteList();
  const noteListData = noteList.getNoteList();
  displayNotelist(noteListData);
  Storage.saveNoteList(noteListData);
});
