// Strings array for fetching gify images. You can change them if you want to whatever you want.
// Dont change the function names or count of elements unless you want to modify the code

function animals() {
  return [
    "elephant",
    "giraffe",
    "bear",
    "zebra",
    "monkey",
    "panda",
    "kangaroo",
    "leopard",
    "cheetah",
    "crocodile",
    "wolf",
    "fox",
    "octopus",
    "dog",
    "cat",
    "horse",
    "gorilla",
    "rhinoceros",
    "cow",
    "donkey",
  ];
}
function cities() {
  return [
    "Tokyo",
    "Delhi",
    "Shanghai",
    "Dhaka",
    "Cairo",
    "São Paulo",
    "Mexico City",
    "Beijing",
    "Mumbai",
    "Osaka",
    "New York City",
    "London",
    "Paris",
    "Istanbul",
    "Bangkok",
    "Seoul",
    "Los Angeles",
    "Rome",
    "Dubai",
    "Singapore",
  ];
}
function countries() {
  return [
    "France",
    "Spain",
    "United States",
    "China",
    "Italy",
    "Turkey",
    "Mexico",
    "Thailand",
    "Germany",
    "United Kingdom",
    "Japan",
    "Austria",
    "Greece",
    "Malaysia",
    "India",
    "Russia",
    "Hong Kong",
    "Cambodia",
    "Canada",
    "Netherlands",
  ];
}
function celebrities() {
  return [
    "Charlie Chaplin",
    "Marilyn Monroe",
    "Marlon Brando",
    "Audrey Hepburn",
    "Humphrey Bogart",
    "Katharine Hepburn",
    "James Stewart",
    "Elizabeth Taylor",
    "Elvis Presley",
    "Michael Jackson",
    "The Beatles",
    "Madonna",
    "Frank Sinatra",
    "John Lennon",
    "Albert Einstein",
    "Martin Luther King Jr.",
    "Muhammad Ali",
    "Pablo Picasso",
    "Walt Disney",
    "Neil Armstrong",
  ];
}

export function shuffleDeck(inputDeck) {
  let deck = [...inputDeck];
  let currentIndex = deck.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }

  return deck;
}
//Generate an array of 20 unique Pokemon Ids (1 to 1025)
export function getPokemonIds() {
  let breakLoop = false;
  let returnArray = [];
  let id = 0;
  while (!breakLoop) {
    id = getRandomNumber(1025);
    if (returnArray.indexOf(id) === -1) {
      returnArray.push(id);
    }
    if (returnArray.length === 20) {
      breakLoop = true;
    }
  }
  return returnArray;
}

function getRandomNumber(x) {
  return Math.floor(Math.random() * x) + 1;
}

async function getPokemon(activePokemonId) {
  const allPokemonUrl = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";

  let pokemonUrl = `${allPokemonUrl}${activePokemonId}`;
  try {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
      throw new Error(`Pokémon not found`);
    }
    const activePokemon = await response.json();
    return {
      name: activePokemon.name,
      imageUrl: activePokemon.sprites.front_default,
    };
  } catch (err) {
    console.log(err);
    window.alert(`Pokémon not found ${activePokemonId}`);
  }
}

export async function buildDeck(cat,subCat) {
  if (cat === "pokemon") {
    let deck = await buildPokemonDeck();
    return deck;
  }
  if(cat === "giphy"){
  if (subCat === "animals") {
    let deck = await buildGiphyDeck(animals());
    return deck;
  }
  if (subCat === "celebrities") {
    let deck = await buildGiphyDeck(celebrities());
    return deck;
  }
  if (subCat === "cities") {
    let deck = await buildGiphyDeck(cities());
    return deck;
  }
  if (subCat === "countries") {
    let deck = await buildGiphyDeck(countries());
    return deck;
  }
  }
  console.log("deck from did not match!", cat,subCat);
  return null;
}

async function buildPokemonDeck() {
  let pokemonIds = getPokemonIds();
  let cardDeck = [];
  for (let i = 0; i < pokemonIds.length; i++) {
    let pok = await getPokemon(pokemonIds[i]); // ✅ await the Promise
    cardDeck.push({
      name: pok.name,
      id: "id" + i,
      imageUrl: pok.imageUrl,
      clicked: false,
    });
  }
  return cardDeck;
}

async function getGiphyImage(searchString, giphyAPIKey) {
  try {
    const encoded = encodeURIComponent(searchString);
    const giphyRequest = `https://api.giphy.com/v1/gifs/translate?api_key=${giphyAPIKey}&s=${encoded}`;

    const responsePromise = await fetch(giphyRequest);

    if (!responsePromise.ok) {
      alert("Network error fetching Giphy image");
      return { status: -1, name: null, imageUrl: null };
    }

    const giphyObject = await responsePromise.json();

    if (giphyObject.meta.status !== 200) {
      if (giphyObject.meta.status === 429) {
        // alert("You have made too many requests! Please wait up to an hour.");
        return { status: 429, name: null, imageUrl: null };
      } else {
        // alert("Unable to fetch image");
        return { status: -1, name: null, imageUrl: null };
      }
    }

    return {
      status: 0,
      name: searchString,
      imageUrl: giphyObject.data.images.original.url,
    };
  } catch (err) {
    console.error(err);
    // alert("Unexpected error while fetching Giphy image");
    return { status: -1, name: null, imageUrl: null };
  }
}

async function buildGiphyDeck(searchStrings) {
  const giphyAPIKey = "0BZtaP7kPFxjbZZ4GwhOud6IccACVQ0R";
  let cardDeck = [];
  let i = 0;
  while (i < searchStrings.length) {
    let giphy;
    let tries = 0;
    while (tries < 4) {
      giphy = await getGiphyImage(searchStrings[i], giphyAPIKey);
      if (giphy.status === 0) {
        break;
      }
      if (giphy.status === 429) {
        console.log(
          "Limit exceeded, please wait for an hour to play again using giphy images"
        );
        return null;
      }
      tries++;
      await new Promise((r) => setTimeout(r, 1000));
    }
    if (giphy.status !== 0) {
      console.log("Downloading failed after multiple retries. Network error?");
      return undefined;
    }
    cardDeck.push({
      name: giphy.name,
      id: "id" + i,
      imageUrl: giphy.imageUrl,
      clicked: false,
    });
    i++;
  }
  return cardDeck;
}
