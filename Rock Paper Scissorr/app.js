let userScore = 0; 
let compScore = 0; 
const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const bodyColor = document.querySelector("body");
console.log(bodyColor);
const genComputerChoice = () =>{
   const options = ["rock", "paper","scissors"];
   const randomIndx =  Math.floor(Math.random()*3);
   return options[randomIndx];
}
const DrawGame =() =>{
    msg.style.backgroundColor = "#081b31";
    msg.innerText = "Game was Drawn";
    // bodyColor.style.backgroundColor = "white";
}
const showWinner = (userWin,userChoice,compChoice) =>{
    let scoreUser = document.querySelector("#user-score");
    if(userWin){
        ++userScore;
        scoreUser.innerText = userScore;
        msg.innerText = `You Win !!! Your choice ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        // bodyColor.style.backgroundColor = "Blue";
    }
    else{
        let compUser = document.querySelector("#comp-score");
        ++compScore;
        compUser.innerText =compScore;
        msg.innerText = `You Lost ,Your choice ${compChoice} beats ${userChoice}`;
        // bodyColor.style.backgroundColor = "Brown";
        msg.style.backgroundColor = "red";
    }
}
const playGame = (userChoice)=>{
    console.log("userChoice = ",userChoice);
    const compChoice = genComputerChoice();
    console.log("compChoice = ",compChoice);


    
        if(userChoice === compChoice){
        //Draw
       DrawGame();
        }
        else {
            let userWin = true;
            if(userChoice === "rock"){
              userWin = compChoice === "paper" ? false : true;
            } else if(userChoice === "paper"){
                userWin =  compChoice === "scissors" ? false : true;
            }
            else{
                //rock paper
              userWin = compChoice === "rock" ? false : true;
            }
            showWinner(userWin,userChoice,compChoice);
        }
    
}


choices.forEach((choice) => {
    console.log(choice);
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        console.log("clicked",userChoice);
        playGame(userChoice);
       console.log(genComputerChoice) ;
    });
});

const creative = () => {

}

