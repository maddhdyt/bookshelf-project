document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_SHELF";

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, false);
    book.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 }

function findBookIndex(bookId) {
    for(index in book){
        if(book[index].id === bookId){
            return index
        }
    }
    return -1
  }

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    book.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
   
function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
    bookTarget.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 }


function addBookToCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
  
    bookTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
 } 

function findBook(bookId){
    for(bookItem of book){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
  }

function generateId() {
    return +new Date();
}
 
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
 }

function makeBook(bookObject) {
 
    const textTitle = document.createElement("h4");
    textTitle.classList.add("judul-buku")
    textTitle.innerText = bookObject.title;
  
    const textAuthor = document.createElement("span");
    textAuthor.classList.add("penulis-buku")
    textAuthor.innerText = bookObject.author;
    
    const pBatas = document.createElement("p");
    pBatas.innerText = "I";

    const infoYear = document.createElement("span");
    infoYear.classList.add("tahunTerbitInfo")
    infoYear.innerText = bookObject.year;

    const detailBuku = document.createElement("div");
    detailBuku.classList.add("detail")
    detailBuku.append(textAuthor,pBatas, infoYear,);

    const descBuku = document.createElement("div");
    descBuku.classList.add("desc-book")
    descBuku.append(textTitle, detailBuku);

    const item = document.createElement("div");
    item.classList.add("list-item")
    item.append(descBuku);
    
    const card = document.createElement("div");
    card.classList.add("card")
    card.append(item);
    card.setAttribute("id", `book-${bookObject.id}`);

    if(bookObject.isCompleted){
 
        const undoButton = document.createElement("button");
        undoButton.classList.add("undoButton");
        undoButton.addEventListener("click", function () {
            Swal.fire({
                title: 'Pindahin buku ke rak <br>BELUM DIBACA?',
                showCancelButton: true,
                confirmButtonText: 'Iya, pindahin!',
                cancelButtonText: 'Ga jdi, udah dibaca :)',
                confirmButtonColor: 'rgb(54, 114, 204)',
                cancelButtonColor: 'rgb(255, 123, 0)'
              }).then((result) => {
                if (result.isConfirmed) {
                    undoBookFromCompleted(bookObject.id);
                  Swal.fire('Terpindahkan', '', 'success')
                }
              })
        
        });
    
        const trashButton = document.createElement("button");
        trashButton.classList.add("trashButton");
        trashButton.addEventListener("click", function () { 
            Swal.fire({
                title: 'Yakin hapus nih?',
                text: "Nanti ga bakal balik lagi lohh, kyk mantan  :(",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgb(54, 114, 204)',
                cancelButtonColor: 'rgb(255, 123, 0)',
                confirmButtonText: 'Iya hapus aja!',
                cancelButtonText: 'Ga jadi deh.'
              }).then((result) => {
                if (result.isConfirmed) {
                    removeBookFromCompleted(bookObject.id);
                  Swal.fire(
                    'Terhapus!',
                    'Selamat mantan kamu bertambah :).',
                    'success'
                  )
                }
            })
        });
        
        const btnCheck2 = document.createElement("div");
        btnCheck2.classList.add("btn-AfterReaded")
        btnCheck2.append(undoButton, trashButton);

        item.append(btnCheck2)

    } else {
    
        const checkButton = document.createElement("button");
        checkButton.classList.add("checkButtonUnreaded");
        checkButton.addEventListener("click", function () {
            Swal.fire({
                title: 'Pindahin buku ke rak <br>SUDAH DIBACA?',
                showCancelButton: true,
                confirmButtonText: 'Iya, pindahin!',
                cancelButtonText: 'Ga jdi, belum kebaca :(',
                confirmButtonColor: 'rgb(54, 114, 204)',
                cancelButtonColor: 'rgb(255, 123, 0)'
              }).then((result) => {
                if (result.isConfirmed) {
                  addBookToCompleted(bookObject.id);
                  Swal.fire('Terpindahkan', '', 'success')
                }
              })
        });


        const trashBtn = document.createElement("button");
        trashBtn.classList.add("trashButton");
        trashBtn.addEventListener("click", function () { 
            Swal.fire({
                title: 'Yakin hapus nih?',
                text: "Nanti ga bakal balik lagi lohh, kyk mantan  :(",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgb(54, 114, 204)',
                cancelButtonColor: 'rgb(255, 123, 0)',
                confirmButtonText: 'Iya hapus aja!',
                cancelButtonText: 'Ga jadi deh.'
              }).then((result) => {
                if (result.isConfirmed) {
                    removeBookFromCompleted(bookObject.id);
                  Swal.fire(
                    'Terhapus!',
                    'Selamat mantan kamu bertambah :).',
                    'success'
                  )
                }
            })
        });

        const btnCheck = document.createElement("div");
        btnCheck.classList.add("btn-checkUnreaded")
        btnCheck.append(checkButton, trashBtn);
        
        item.append(btnCheck);
    }
    return card;
 }

  

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
 }   

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Upss, Maaf browser tidak mendukung local storage!!");
        return false
    }
    return true;
 }

function loadDataFromStorage() {
    const serialData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serialData);
    if(data !== null){
        for(books of data){
            book.push(books);
        }
    }
document.dispatchEvent(new Event(RENDER_EVENT));
 }
  
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById("book");
    uncompletedBOOKList.innerHTML = "";
    
    const completedBOOKList = document.getElementById("completed-book");
    completedBOOKList.innerHTML = "";

    for(bookItem of book){
        const bookElement = makeBook(bookItem);
     
        if(bookItem.isCompleted == false)
            uncompletedBOOKList.append(bookElement);
            else
                completedBOOKList.append(bookElement);
        }      
    });
document.addEventListener(SAVED_EVENT, function() {
});
      
  
  
