const d = document,
     $draggableContainer = d.querySelector(".main__abc"),
     $droppableContainer = d.querySelector(".droppable-elements"),
     $img = d.querySelector(".main__img"),
     $draggableFragment = d.createDocumentFragment(),
     $droppableFragment = d.createDocumentFragment(),
     frutas = ["banana", "cereza", "fresa", "higo", "kiwi", "manzana", "naranja", "pera", "piña", "uva"],
     stockArray = [
          {
               name: "frutas",
               content: ["banana", "cereza", "fresa", "higo", "kiwi", "manzana", "naranja", "pera", "piña", "uva"]
          },
          {
               name: "animales",
               content: ["caballo", "delfin", "gallina", "gato", "hipopotamo", "loro", "perro", "tortuga", "camello", "mono"]
          },
     ];

let correct = 0,
     total = 0,
     time = 60;

const getLetters = (indexStockArray) => {
     const arraySelect = stockArray[indexStockArray].content;

     let lengthLetters = arraySelect.length,
          indexRandom = Math.floor(Math.random() * lengthLetters),
          newArray = arraySelect[indexRandom].split("");
     return newArray;
}
let letter = "";
const printLetters = (indexStockArray = 0) => {
     let arrayDroppable = getLetters(indexStockArray),
          array1 = [...arrayDroppable].sort(),
          arrayABC = [...getLetters(indexStockArray).reverse(), ...array1, ...getLetters(indexStockArray).sort()];

     letter = arrayDroppable.join("");
     $img.setAttribute("src", `img/${stockArray[indexStockArray].name}/${letter}.png`);

     arrayABC.forEach(el => {
          const $draggableElement = d.createElement("div")
          $draggableElement.textContent = el.toLocaleUpperCase(),
               $draggableElement.classList.add("draggable");
          $draggableElement.setAttribute("draggable", "true");
          $draggableElement.setAttribute("data-id", el);
          $draggableFragment.appendChild($draggableElement);
     });

     arrayDroppable.forEach(el => {
          const $droppableElement = d.createElement("div");
          $droppableElement.classList.add("droppable");
          $droppableElement.setAttribute("data-id", el);
          $droppableFragment.appendChild($droppableElement);
     });

     $draggableContainer.appendChild($draggableFragment);
     $droppableContainer.appendChild($droppableFragment);
}

printLetters(); // Pasar el indice (default: 0) del array Ejm: 0, 1, ...

const $correctSpan = d.querySelector(".correct"),
     $totalSpan = d.querySelector(".total"),
     $timeDiv = d.querySelector(".time__number");

d.addEventListener("DOMContentLoaded", e => {
     const $draggableElements = d.querySelectorAll(".draggable"),
          $droppableElements = d.querySelectorAll(".droppable");

     const dragStart = (e) => {
          e.dataTransfer.setData("text", e.target.dataset.id);
     }
     const dragOver = (e) => {
          e.preventDefault();
          e.target.classList.add("droppable-hover")
     }
     const dragLeave = (e) => {
          e.target.classList.remove("droppable-hover")
     }
     const drop = (e) => {
          const $draggableElementId = e.dataTransfer.getData("text"),
               $droppableElementId = e.target.dataset.id,
               $draggableElement = d.querySelector(`.main__abc [data-id = ${$draggableElementId}]`)
          e.target.classList.remove("droppable-hover");

          let dropped = e.target.classList.contains("droppable");

          if (($draggableElementId === $droppableElementId) && dropped) {
               $draggableElement.setAttribute("draggable", "false");
               e.target.textContent = "";
               e.target.classList.add("dropped-ok");
               e.target.append($draggableElement);
               correct++;

          } else if (dropped) {
               e.target.append($draggableElement);
               e.target.classList.add("dropped-error");
               total++;
          }
          $correctSpan.innerHTML = correct;
          $totalSpan.innerHTML = total;
     }

     $draggableElements.forEach(el => {
          el.addEventListener("dragstart", dragStart);
     });
     $droppableElements.forEach(el => {
          el.addEventListener("dragover", dragOver);
          el.addEventListener("dragleave", dragLeave);
          el.addEventListener("drop", drop);
     });

     d.addEventListener("click", e => {
          if (e.target.matches(".droppable *")) {
               if (e.target.matches("[draggable='true']")) {
                    e.target.parentElement.classList.remove("dropped-error");
                    $draggableContainer.appendChild(e.target);
               }
          }
     });

     const $mensageContainer = d.querySelector(".message-container"),
          $messageTitle = d.querySelector(".message__title"),
          $aciertos = d.querySelector(".aciertos__span"),
          $fallos = d.querySelector(".fallos__span"),
          $startBtn = d.querySelector(".message__start-btn");

     const printMessage = (clase, message) => {
          $mensageContainer.style.display = "flex";
          $messageTitle.classList.add(clase);
          $messageTitle.innerHTML = message;
          $aciertos.innerHTML = correct;
          $fallos.innerHTML = total;
     }

     let countDown = setInterval(() => {
          time--;
          $timeDiv.innerHTML = time;
          if (time === 0 || letter.length === correct) clearInterval(countDown);

          if (time > 0 && letter.length === correct) {
               printMessage("winner", "¡Muy bien!");
          }
          else if (time === 0 && letter.length > correct) {
               printMessage("loser", "¡Tiempo agotado!");
          }
     }, 1000);

     $startBtn.addEventListener("click", e => {
          location.reload();
     });
});

