/**
 HÄNGA GUBBE

- lista med alfabetet
- lista med gissade bokstäver
- slumpa ut random ord
- lista med ord
- max antal gissningar
- antal gissningar anv gjort
VG
- poängräknare

 För att toggla SVG:en
 document.querySelector('figure').classList.add('scaffold')
 document.querySelector('figure').classList.add('head')
 document.querySelector('figure').classList.add('body')
 document.querySelector('figure').classList.add('arms')
 document.querySelector('figure').classList.add('legs')

 */

    let words = 'BIL,TRUCK,candidate,teaching,assignment,menu,apartment,quantity,patience,recognition,leadership,setting,shirt,reputation,dirt,introduction,reflction,direction,finding,truth,device,information';
    let maxAtempts = 5; 
    let points = 0;
   
    let randomWord = setRandomWord(words);
    //gissade_bokstäver 
    let guessedLetters = [];
    let wrongGuesses = []; 
 
    
    window.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter') {
            startGame();
        }
    });
 
    
    function startGame(){
        gameOver('Hidden',false);
        makeBlanks();
        renderLettersInDom(wrongGuesses, 'nomatch');
        renderLettersInDom(guessedLetters);
    
        window.addEventListener('keydown', (e) => {
            checkLetterExistens(randomWord, guessedLetters, wrongGuesses, eventCheck(e.key));
            gameRules(wrongGuesses,randomWord); 
            renderLettersInDom(wrongGuesses, 'nomatch');
            renderLettersInDom(guessedLetters);
        }); 
    }

    

    //It makes blanks for every letter in word 
    function makeBlanks(){
         maxAtempts = 5; 
         points = 0;
         randomWord = setRandomWord(words);
        //gissade_bokstäver 
         guessedLetters = [];
         wrongGuesses = []; 
         document.querySelector('figure').removeAttribute('class'); 
         document.querySelector('figure').setAttribute('class', ' ');
        for (let i = 0; i < randomWord.length; i++) {
            guessedLetters.push(' ');
        }
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
    //checks the correct letter and push it to an array, and pushes the wrong one to another array  
    function checkLetterExistens(word, correctArr, wrongArr, event) {
        if (word.includes(event)) {
            let letterIndex = returnIndex(word, event);
            letterIndex.forEach(letter => {
                correctArr[letter] = event.toString();
            });
    
        } else if (!wrongArr.includes(event) && event !== undefined){ 
            wrongArr.push(event);
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
    function gameRules(arr,word){
        if(arr.length <= maxAtempts){
            renderHangman(arr.length); 
        }else if(arr.length > 5 ){
            gameOver(word,true); 
        }
    }
    //game over screen
    function gameOver(word,active){
        let place = document.querySelector('.game-over'); 
        active == true ? place.classList.add('show') : place.classList.remove('show');
        place.children[1].innerHTML = `The word we were looking for was <b>${word}</b>.`;
    }