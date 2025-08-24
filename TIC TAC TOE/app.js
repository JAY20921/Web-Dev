let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newButton = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msgPara = document.querySelector("#msg");

// Initially hide the message
msgPara.style.visibility = "hidden";

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

let turnO = true; // Player O starts

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            turnO = false;
        } else {
            box.innerText = "X";
            
            turnO = true;
        }
        boxes.forEach(box => {
  if (box.innerText === "O") {
    box.style.color = "#ff1008ff";
    
  }
});

        box.disabled = true;
        checkWinner();
    });
});

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;   // ✅ enable the box
        box.innerText = "";     // ✅ clear text
    }
};

const showWinner = (winner) => {
    msgPara.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    msgPara.style.visibility = "visible";  // ✅ show message
    disableBoxes(); // ✅ stop game after win
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;

        if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
            if (pos1 === pos2 && pos2 === pos3) {
                showWinner(pos1);
                return; // ✅ stop checking once winner is found
            }
        }
    }
   
    // Check for draw (if no winner and all boxes filled)
    let isDraw = Array.from(boxes).every(box => box.innerText !== "");
    if (isDraw) {
        msgPara.innerText = "It's a Draw!";
        msgContainer.classList.remove("hide");
        msgPara.style.visibility = "visible";
    }
};

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    msgPara.style.visibility = "hidden";  // ✅ hide message
};

// Attach to reset buttons
resetBtn.addEventListener("click", resetGame);
newButton.addEventListener("click", resetGame);
