//task form related references
const taskForm = document.querySelector(`#task-form`);
const taskFormBtn = document.querySelector(`#task-submit-btn`);
const formInputs = taskForm.querySelectorAll(`.input`);

const cardsContainer = document.querySelector(`#cards-container`); // <- card container reference
const $cardTemplate = document.querySelector(`#card-template`).content; // <- card Template content

getCards(); // <- loads cards when the js is loaded. 


//get the json data from a file with a special php query.
//[individual functions on different files as these might need not be good practice] 
function getCards() {
    let xhr = new XMLHttpRequest();
    xhr.open( `POST`, `getInfo.php`, true );
    xhr.setRequestHeader( 'Content-type',
    'application/x-www-form-urlencoded' );
    xhr.onload = function() {
        if(this.status == 200 ) {
            //the info returned needs to be in JSOn
            loadCards( JSON.parse(this.responseText) );
        }
    };
    xhr.send();
}

//loadCards, uses the function createCard to create several of em
//data needs to be json array
function loadCards(data) {
    cardsContainer.innerHTML = "";
    data.forEach( (row)=>{
        createCard(row);
    } );
}

//create a card with a json data passed to it as parameter
function createCard(task) {
    let $cardClone = $cardTemplate.cloneNode(true); // <- clone from template

    // put the data of the task in the clone
    $cardClone.querySelector(`.card-title`).textContent = task.Title;
    $cardClone.querySelector(`.card-text`).textContent = task.Descrip;
    $cardClone.querySelector(`.card-date`).textContent = task.E_Date;
    $cardClone.querySelector(`.card-id`).textContent = task.Id;

    //if task.IsFinished is true [1], add the classes to it. 
    if( task.Is_Finished == 1 ) {
        $cardClone.querySelector(`.card`).classList.add(`finished`);
        $cardClone.querySelector(`.card-done-btn`).classList.add(`active`);
    }
    //add the card to the container
    cardsContainer.append( $cardClone );
}

//When a new task is submited from the 'new task' form
taskForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    disableInputs(); //<- disables inputs

    //get the values from the newTaskForm inputs
    const title = document.querySelector(`#title-input`).value;
    const description = document.querySelector(`#description-input`).value;
    const date = document.querySelector(`#date-input`).value;

    let xhr = new XMLHttpRequest();
    xhr.open( `POST`, `insertTask.php` ,true );
    xhr.setRequestHeader( 'Content-type',
    'application/x-www-form-urlencoded' );
    xhr.onload = function() {
        if( this.status == 200 ) {
            updateAll();
        }
    };
    xhr.send( `title=${title} &description=${description} &date=${date}` );
} );

//makes the form inputs not able to be edited
//the submit button is also disabled
function disableInputs() {
    formInputs.forEach( (input)=>{
        input.disabled = true;
    } );
    taskFormBtn.disabled = true;
}

//makes the form inputs able to be edited.
//the submit btn is also enabled
function enableInputs() {
    formInputs.forEach( (input)=>{
        input.disabled = false;
    } );
    taskFormBtn.disabled = false;
}

//closes the form (if open), and cleans the taskform inputs.
//enables the inputs agains (in case they are disabled)
//deletes the cards in the container and loads them from the database
function updateAll() {
    taskForm.classList.remove(`in`);
    clearInputs();
    enableInputs();
    getCards();
}

//clears the newTaskForm inputs
function clearInputs() {
    formInputs.forEach( (input)=> {
        input.value = "";
    } );
}




//shows or hides the taskForm
function taskFormToggle() {
    taskForm.classList.toggle(`in`);
}

//shows the options list in the card
function showCardOptions(btn) {
    const card = btn.closest( `.card` );
    const list = card.querySelector(`.card-options-list`);
    list.classList.toggle(`in`);
}

//changes the max height of the card-text and make it scrollable
function cardShowMore(btn) {
    const card = btn.closest( `.card` );
    let cardText = card.querySelector(`.card-text`);
    
    //card.querySelector(`.card-text`).classList.toggle(`show`);
    cardText.classList.toggle(`show`);
    
    btn.classList.toggle(`active`);

    if( !cardText.classList.contains(`show`) ) {
        cardText.scrollTop = 0;
    }

}

//updates the card.Is_Finished status in the database
function cardToggleDone(btn) {
    const card = btn.closest( `.card` );
    let isFinished;

    //confirms if the card.IsFinihes state and gives its oppsite to a variable
    if( card.classList.contains(`finished`) ) {
        isFinished = 0;
    } else {
        isFinished = 1;
    }

    let xhr = new XMLHttpRequest();
    xhr.open( `POST`, `update.php` ,true );
    xhr.setRequestHeader( 'Content-type',
    'application/x-www-form-urlencoded' );
    xhr.onload = function() {
        if( this.status == 200 ) {
            updateAll();
            btn.classList.toggle(`active`);
        }
    };
    xhr.send( `id=${card.querySelector(`.card-id`).textContent} &isFinished=${isFinished}` );
}

//gives the card a `editable` class
//makes the title and text contenEditable = true
//shows a hidden date input to chage the date if needed
function editCard(btn) {
    const card = btn.closest(`.card`);
    
    card.classList.add(`editable`);
    card.querySelector(`.card-options-list`).classList.remove( `in` );
    card.querySelector(`.card-text`).setAttribute(`contentEditable`, `true`);
    card.querySelector(`.card-title`).setAttribute(`contentEditable`, `true`);
}

//submits the changes to the card to the databse
function submitChanges(btn) {
    const card = btn.closest(`.card`);

    //the the content of the editable card
    const cardTitle = card.querySelector(`.card-title`).textContent;
    const cardText = card.querySelector(`.card-text`).textContent;   
    const newDate = card.querySelector(`.card-new-date`).value;
    const cardId = card.querySelector(`.card-id`).textContent;

    //shows a confirm window, if accepted procceds
    if ( confirm(`Are you sure you want to save Changes of This Card?\n`+
    `${card.querySelector(".card-title").textContent}`) ) {
        if( !newDate ) { // <- if the newDate inputs has a new date: use a query. else: use the other one.
            sqlQuery(`UPDATE Tasks SET Title='${cardTitle}', Descrip='${cardText}' WHERE Id=${cardId}`);
        } else {
            sqlQuery(`UPDATE Tasks SET Title='${cardTitle}', Descrip='${cardText}', E_Date='${newDate}' WHERE Id=${cardId}`);
        }
        updateAll();
    } 
}

//when the cancel changes btn is pressed
//sets content editable to false
//removes the card.editable class
//updates.
function cancelEdit(btn) {
    let card = btn.closest(`.card`);
    card.classList.remove(`editable`);
    card.querySelector(`.card-text`).removeAttribute(`contentEditable`);
    card.querySelector(`.card-title`).removeAttribute(`contentEditable`);
    card.querySelector(`.card-date`).removeAttribute(`contentEditable`);
    updateAll();
}


//delete a card
function deleteCard(btn) {
    const card = btn.closest(`.card`);
    const cardId = card.querySelector(`.card-id`).textContent;

    //if window is confirmed, proceed.
    if ( confirm(`Are you sure you want to delete This Card?\n`+
    `${card.querySelector(".card-title").textContent}`) ) {
        sqlQuery( `DELETE FROM Tasks WHERE id=${cardId}` );
    }

}


//takes a sql query as a parameters and sends it to a php file.
//[probaly a better way to use SQL queries]
function sqlQuery(query) {
    let xhr = new XMLHttpRequest();

    xhr.open(`POST`, `custom_query.php`, true);
    xhr.setRequestHeader( 'Content-type',
    'application/x-www-form-urlencoded' );
    xhr.onload = function() {
        if( this.status == 200 ) {
            updateAll();
        }
    }
    xhr.send( `query=${query}` );
}
