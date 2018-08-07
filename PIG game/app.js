/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


var score, currentScore, activePlayer, gamePlaying;
var dice = [];

var diceDOM0 = document.querySelector(".dice-0");
var diceDOM1 = document.querySelector(".dice-1");




init();


//document.querySelector("#current-" + activePlayer).textContent = dice;


document.querySelector(".btn-roll").addEventListener('click', function() 
{
    if(gamePlaying)
    {

        //get random number
        dice[0] = Math.floor(Math.random()*6) + 1;
        dice[1] = Math.floor(Math.random()*6) + 1;
        
        
        //display the number
        diceDOM0.style.display = "block";
        diceDOM0.src = "dice-" + dice[0] + ".png";

        diceDOM1.style.display = "block";
        diceDOM1.src = "dice-" + dice[1] + ".png";

        //update the result if number isn't 1
        if(dice[0] !== 1 && dice[1]!==1)
        {
            //add score
            roundScore += (dice[0]+dice[1]);
            document.querySelector("#current-" + activePlayer).innerHTML = "<b>" + roundScore + "</b";
        }
        else
        {
            //next player
            nextPLayer();
            
        }
    }  
 });
 

document.querySelector(".btn-hold").addEventListener("click", function ()
{
    if(gamePlaying)
    {

        //add roundscore to global score
        scores[activePlayer] += roundScore;
        
        //update ui
        document.querySelector("#score-"+ activePlayer).textContent = scores[activePlayer];
        
        var input = document.querySelector(".final-score").value; 
        var winningScore;
        if(input)
        {
            winningScore = input;
        }
        else
        {
            winningScore = 100;
        }
        //check if player won
        if(scores[activePlayer]>=winningScore)
        {
            document.querySelector("#name-"+ activePlayer).textContent = "Winner!";
            document.querySelector(".player-"+ activePlayer+"-panel").classList.add("winner");
            document.querySelector(".player-"+ activePlayer+"-panel").classList.remove("active");
            
            gamePlaying = false; 
        }
        else
        {
            nextPLayer();
        }
        
        
    }        
});
document.querySelector(".btn-new").addEventListener("click", init);
    
function nextPLayer () 
 {
    roundScore = 0;
    document.querySelector("#current-" + activePlayer).textContent = roundScore;
    // document.querySelector(".player-"+ activePlayer +"-panel").classList.remove("active");
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    //document.querySelector(".player-"+ activePlayer +"-panel").classList.add("active");
    document.querySelector(".player-0-panel").classList.toggle("active");
    document.querySelector(".player-1-panel").classList.toggle("active");
    diceDOM0.style.display = "none";
    diceDOM1.style.display = "none";
}
function init()
{

    
    
    scores = [0,0];
    roundScore = 0;
    gamePlaying = true;
    
    
    activePlayer = 0;
    
    diceDOM0.style.display = "none";
    diceDOM1.style.display = "none";
    document.getElementById("score-0").textContent = "0";
    document.getElementById("score-1").textContent = "0";
    document.getElementById("current-0").textContent = "0";
    document.getElementById("current-1").textContent = "0";

    document.getElementById("name-0").textContent = "PLayer 1";
    document.getElementById("name-1").textContent = "PLayer 2";
    document.querySelector(".player-0-panel").classList.remove("winner");
    document.querySelector(".player-1-panel").classList.remove("winner");
    document.querySelector(".player-0-panel").classList.remove("active");
    document.querySelector(".player-1-panel").classList.remove("active");

    document.querySelector(".player-0-panel").classList.add("active");
    
}



