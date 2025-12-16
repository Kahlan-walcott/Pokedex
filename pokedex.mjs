import readline from 'readline'

// I used https://www.w3schools.com/js/default.asp to better understand how to use Javascript

function showMenu(){
    // display all menu options
    console.log('\n----------Menu Options----------');
    console.log('Enter 1 to search for a Pokémon');
    console.log('Enter 2 to search for an item');
    console.log('Enter 3 to search for a move');
    console.log('Enter 4 or exit to exit the program\n');
}

async function prompts(cb){
    // use readline to ask the user for a search term. It will then call the function passed into it (which is what cb is - a callback function), and pass the data the user entered as a parameter.
    let term;
    try {
	    term = await askQuestion("What would you like to search: ");
	    //console.log(`Your term was, ${term}`);
    } catch(err) {
        console.error("An error occurred: not valid", err);
    }
    if (term == ' ' || term == undefined || term == '') {
        // To make sure the user types something in insted of enter or space
        console.log("You have to type what Pokémon you would like to search.");
	    term = await askQuestion("What would you like to search: ");
	    //console.log(`Your term was, ${term}.`)
    } else {
        await cb(term);
    }
}

async function searchPoke(term){
    // query the API for a particular Pokemon (passed in as term). If it receives a valid response, it will call printPoke(json) with the json to print out the name, weight, height, base experience, and all the moves for that Pokemon. It will then call run() again to reprompt.
    //console.log(`over here dofus: ${term}`); 
    let json;
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
        json = await response.json();
    } catch(err) {
        console.error("An error occurred:", err);
    }
    // printing information in a neat way and then asking the user for input again
    await printPoke(json);
    await run();
}


function printPoke(json){
    //  print the data for the Pokemon in a neat and clean way. print out the name, weight, height, base experience, and all the moves for that Pokemon
    let name = json.name;
    let weight = json.weight;
    let height = json.height;
    let experience = json.base_experience;
    console.log(`\nName: ${name}`);
    console.log(`Weight: ${weight}`);
    console.log(`Height: ${height}`);
    console.log(`Base Experience: ${experience}`);
    console.log(`The moves for ${name}:`);
    json.moves.forEach( moves => {
        console.log(moves.move.name);
    })
}

async function searchItem(term){
    // exactly like the searchPoke() function, except searches the Item endpoint for an item. Calls the corresponding printItem(json) method. Calls run() to reprompt.
    let json;
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/item/${term}`);
        json = await response.json();
    } catch(err) {
        console.error("An error occurred:", err);
    }
    await printItem(json);
    await run();
}

function printItem(json){
    //  prints item data neatly. Pick at least four fields to display from the endpoint's data.
    let name = json.name;
    let category = json.category.name;
    let fling = json.fling_power;
    console.log(`\nName: ${name}`);
    console.log(`Category: ${category}`);
    if (fling == null) {
        console.log(`${name} does not have any fling power (${fling}).`);
    } else {
        console.log(`Fling power: ${fling}`);
    }
    console.log(`${name}'s effects:`);
    json.effect_entries.forEach( effect => {
        console.log("Effect: " + effect.effect);
        console.log("Short term effect: " + effect.short_effect);
    })
}

async function searchMove(term){
    // works exactly like the searchPoke() function, except searches the Move endpoint for a move. Calls the corresponding printMove(json) method.
    let json;
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/move/${term}`);
        json = await response.json();
    } catch(err) {
        console.error("An error occurred:", err);
    }
    await printMove(json);
    await run();
}

function printMove(json){
    // prints the move data in a neatly formatted way. Calls run() to reprompt.
    let name = json.name;
    let accuracy = json.accuracy;
    let power = json.power;
    let pp = json.pp;
    console.log(`\nName: ${name}`);
    console.log(`Accuracy: ${accuracy}%`);
    console.log(`Power: ${power}`);
    console.log(`Power Points: ${name} can be used ${pp} times`);
    console.log("The Pokémon that can learn this move:");
    json.learned_by_pokemon.forEach( poke => {
        console.log(poke.name);
    });
}

function askQuestion(query) {
    // function for asking a question from the .mjs file in Blackboard
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function run(){
    // will call showMenu(), then use readline to ask the user to enter their choice. We will call the prompt function and pass to it the name of the function we wish to use for searching.
    showMenu();
    let choice;
    try {
	    choice = await askQuestion("Enter the menu choice: ")
	    //console.log(`Your choice was, ${choice}.`)
    } catch(err) {
        console.error("An error occurred:", err);
    }
    if (choice == 1) {
        await prompts(searchPoke);
    } else if (choice == 2) {
        await prompts(searchItem);
    } else if (choice == 3) {
        await prompts(searchMove);
    } else {
        // if the user types anything other that the expected response the program ends
        console.log("Thanks for using this Pokedex!");
    }

}

run();

