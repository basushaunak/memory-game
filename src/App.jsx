import { useEffect, useState } from "react";
import "./App.css";
import icon from "./assets/logo/logo.png";
import Header from "./components/Header.jsx";
import Dropdown from "./components/Dropdown.jsx";
import { shuffleDeck, buildDeck } from "./utils.js";
import ScoreCard from "./components/ScoreCard.jsx";
import Card from "./components/Card.jsx";
export default function App() {
  const headerStyle = { color: "black", height: "100px" };
  const scoreCardStyle = {
    color: "white",
    top: "10px",
    right: "10px",
    position: "absolute",
  };
  let items = [
    { id: "giphy", name: "Giphy", key: "giphy" },
    { id: "pokemon", name: "Pokemon", key: "pokemon" },
  ];
  let giphyTypes = [
    { id: "animals", name: "Animals", key: "animals" },
    { id: "celebrities", name: "Celebrities", key: "celebrities" },
    { id: "cities", name: "Cities", key: "cities" },
    { id: "countries", name: "Countries", key: "countries" },
  ];
  const [cardDeck, setCardDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("pokemon");
  const [subCategory, setSubCategory] = useState("animals");
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  function categoryChange(e) {
    setCategory(e.target.value);
  }

  function subCategoryChange(e) {
    setSubCategory(e.target.value);
  }

  function cardClick(e) {
    let cardId = e.target.id;
    let index = getIndex(cardDeck, cardId);
    if (index === -1) {
      console.log("Logical Error! Card is not in the array!!!");
      return;
    }
    if (cardDeck[index].clicked) {
      alert("Uh Oh! You already clicked me earlier!!!");
      for (let i = 0; i < cardDeck.length; i++) {
        cardDeck[i].clicked = false;
      }
      if (score > highScore) {
        setHighScore(score);
      }
      setScore(0);
    } else {
      cardDeck[index].clicked = true;
      setScore((oldScore) => (oldScore = oldScore + 1));
    }
    setCardDeck((oldDeck) => shuffleDeck(oldDeck));
  }
  useEffect(() => {
    if (score === 20) {
      alert(
        "Congratulations! You have a good memory! Reload the page to play a new game."
      );
    }
  }, [score]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(false);

    async function loadDeck() {
      try {
        const deck = await buildDeck(category, subCategory);

        if (cancelled) return;

        if (!deck || deck.length === 0) {
          setError(true);
        } else {
          setCardDeck(deck);
        }
      } catch (err) {
        console.log(err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDeck();

    return () => {
      cancelled = true;
    };
  }, [category, subCategory]);

  if (loading) return <p className="status">Loading deck. Please wait…</p>;
  {
    if (error) return <p className="status">Failed to load deck.</p>;
  }

  if (!cardDeck || cardDeck.length === 0) {
    return <p className="status">Deck is empty.</p>;
  }
  return (
    <>
      <Header style={headerStyle} title="Memory Game" icon={icon} />
      <ScoreCard score={score} highScore={highScore} style={scoreCardStyle} />

      <div className="card-selector">
        <Dropdown
          items={items}
          id="source"
          label="Source: "
          selectedItem={category}
          handleChange={categoryChange}
        />
        {category === "giphy" && (
          <Dropdown
            items={giphyTypes}
            id="giphytypes"
            label="Images: "
            selectedItem={subCategory}
            handleChange={subCategoryChange}
          />
        )}
      </div>
      <div className="card-grid">
        {cardDeck.map((card) => {
          return <Card card={card} key={card.id} handleClick={cardClick} />;
        })}
      </div>
      <div class="acknowledgement">
        Image/API Powered by: {category === "giphy" ? "Giphy" : "freeCodeCamp"}
      </div>
    </>
  );
}

function getIndex(cards, cardId) {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === cardId) {
      return i;
    }
  }
  return -1;
}
