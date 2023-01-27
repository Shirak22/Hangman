import {data} from './data.js'; //importing the words from external file 

 window.onload = ()=> {
    let gameSettings = {
            words: data,
            maxAtempts: 5,
            randomWord: '',
            guessedLetters: [],
            wrongGuesses: [],
            score: 0,
            preScore: 0,
            previousGuessedWords: [],
            totalWordsGuesses: 0
    }
    let timerInterval; 
    let enterState = false;
    let gameOverState = false; 
    document.querySelector('#restart').addEventListener('click',()=>{
        reset();
        setTimer();
        gameOverState = false;
    });
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' && enterState === false) { //Enter on start 
            startGame();
            enterState = true;
        }
    });
 
    
    function startGame() {
            reset();
            setTimer();
           
        window.addEventListener('keydown', (e) => {
            if(!gameOverState){
                checkLetterExistens(gameSettings, eventCheck(e.key));
                displayUI();
                gameRules(gameSettings);
            }
           
        });
    }
    //It makes blanks for every letter in word and resets to default value and generate new word
    function reset(){
         gameOver('Hidden',false); //hide the gameover screen
         gameSettings.maxAtempts = 5; 
         gameSettings.guessedLetters = [];
         gameSettings.wrongGuesses = [];
         gameSettings.randomWord = setRandomWord(gameSettings.words);
          document.querySelector('figure').removeAttribute('class'); 
         document.querySelector('figure').setAttribute('class', ' ');
        for (let i = 0; i < gameSettings.randomWord.length; i++) {
            gameSettings.guessedLetters.push( ' ');
        }

        displayUI();
    }
    // checking if the pressed button is letter and return it in lowerCase 
    function eventCheck(event){
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÖÄÅabcdefghijklmnopqrstuvwxyzöäå';
        if(alphabet.includes(event) || alphabet.includes(event.toUpperCase())){
            return event.toLowerCase();
        }else {
            return;
        }
    } 

    function displayUI(){
        renderLettersInDom(gameSettings.wrongGuesses, 'nomatch');
        renderLettersInDom(gameSettings.guessedLetters);
        document.querySelector('.score').innerHTML = `Score: <b>${gameSettings.score}</b>`;
        document.querySelector('.totalGuessed__words').innerHTML = `Words: <b>${gameSettings.totalWordsGuesses}</b>`;
        
        document.querySelector('.pre__score').innerHTML = `Score: <b>${getState('score')}</b>`;
        document.querySelector('.pre__totalGuessed__words').innerHTML = `Words: <b>${getState('words')}</b>`;
        document.querySelector('.pre__time').innerHTML = `${getState('time')}`;

        
        document.querySelector('.caption').innerHTML = `Guessed Words: `;
        gameSettings.previousGuessedWords.forEach(word=>{
            document.querySelector('.caption').innerHTML += ` <b>${word}</b>,`; 
        });
        
    }
    //checks the correct letter and push it to an array, and pushes the wrong one to another array  
    function checkLetterExistens(gameSettings,event) {
        if (gameSettings.randomWord.includes(event)) {
            let letterIndex = returnIndex(gameSettings.randomWord, event);
            letterIndex.forEach(letter => {
                gameSettings.guessedLetters[letter] = event.toString();
            });
    
        } else if (!gameSettings.wrongGuesses.includes(event) && event !== undefined){ 
            gameSettings.wrongGuesses.push(event);
        }
    }
    //function that returns array of indexes of one letter   
    function returnIndex(arr,letter){
            let letterMatch = [];
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] === letter){
               letterMatch.push(i); 
            }
        }
    
        return letterMatch;
    }
    //updates the UI in the Dom it takes 2 parameters the array of letters and the (DOM place) css class in string format
    function renderLettersInDom(Arr,place = 'word'){
        document.querySelector(`.${place}`).innerHTML = '' ; 
        Arr.forEach(letter => {
            document.querySelector(`.${place}`).innerHTML += `<li>${letter}</li>` ;
        });
    }
    //returns random word 
    function setRandomWord(wordString) {
         let words = wordString.toLowerCase().split(',');
        return words[Math.floor(Math.random() * words.length)];
    }
    //rendering the SVG classes 
    function renderHangman(num){
        switch(num){
            case 1: 
            document.querySelector('figure').classList.add('scaffold');
            break;
            case 2: 
            document.querySelector('figure').classList.add('head');
            break;
            case 3: 
            document.querySelector('figure').classList.add('body');
            break; 
            case 4: 
            document.querySelector('figure').classList.add('arms');
            break; 
            case 5: 
            document.querySelector('figure').classList.add('legs');
            break; 

        }
    }
    //Game logic 
    function gameRules(gameSettings){
        if(gameSettings.wrongGuesses.length <= gameSettings.maxAtempts){
            renderHangman(gameSettings.wrongGuesses.length); 
        }else if(gameSettings.wrongGuesses.length > 5 ){
            saveState('score',gameSettings.score);
            saveState('words',gameSettings.totalWordsGuesses);
            setPreviousTime();
            gameOver(gameSettings.randomWord,true);
            gameOverState = true;
            gameSettings.score = 0;
            gameSettings.totalWordsGuesses = 0;
            gameSettings.previousGuessedWords = [];
        }
        
        if(gameSettings.guessedLetters.join('') === gameSettings.randomWord){
            scoreLogic(gameSettings);
            reset();
        }
        }
    //game over screen
    function gameOver(word,active){
        let place = document.querySelector('.game-over'); 
        active == true ? place.classList.add('show') : place.classList.remove('show');
        place.children[1].innerHTML = `The word we were looking for was <b style ='color:#9c4848;'>${word}</b>.`;
        enterState = false;
    }
    //score points logic 
    function scoreLogic(gameSettings){
        let wrongLettersTotal = gameSettings.wrongGuesses.length; 
        let guessedLettersNumber = gameSettings.guessedLetters.length; 
        
        if(wrongLettersTotal <= 1 ){
            gameSettings.score += guessedLettersNumber * 15; 
        }else if(1 < wrongLettersTotal && wrongLettersTotal < 4 ){
            gameSettings.score += guessedLettersNumber * 7;
        }else{
            gameSettings.score += guessedLettersNumber * 2;
        }
        gameSettings.totalWordsGuesses++;
        gameSettings.previousGuessedWords.push(gameSettings.randomWord);
    }    
//saving in localstorage in the broweser it takes (  string(var name in storage),  string(var value),  string(takes 'set' to save and 'get' to get the value)  )
    function saveState(score,value){

            localStorage.setItem(score,value.toString()); 
       

    }
    function getState(score){
           return localStorage.getItem(score);
    
    }
//setting timer  for every game and reset it if it called again
    function setTimer(){
        clearInterval(timerInterval);
        document.querySelector('.time').innerText = '0';
        let time = Date.now();

        timerInterval = setInterval(()=>{

            let now = Math.round((Date.now() - time)/1000);

            document.querySelector('.time').innerText = now;
            console.log(now);

        }, 1000);

    }

    //saves the time state on gameover and return it as previous time 
    function setPreviousTime(){
      let preTime =  parseInt(document.querySelector('.time').innerText); 
      saveState('time',preTime); 
    }
}//End
   






