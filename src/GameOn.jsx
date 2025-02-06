import { useState, useEffect } from "react";
import Card from "./Card";
import { getImageURL } from "./imageAPI";
import { cardFaces } from "./cardFaces";
import card_flip from "./assets/card_flip.mp3";
import positive_bleep from "./assets/positive_bleep.mp3";
import negative_bleep from "./assets/negative_bleep.mp3";
import win_sound from "./assets/winSound.wav";

export default function GameOn({playSFX, sfxRef_shuffle, sfxRef_gameWon, sfxRef_negativeBleep, sfxRef_positiveBleep, setShowSettings}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [pickedCards, setPickedCards] = useState([]);
  const [loadState, setLoadState] = useState({
    loading: true,
    cards: [],
    error: null,
  });
  const [allImagesReady, setAllImagesReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadedCards = await Promise.all(
          cardFaces.map(async (card) => {
            const imageUrl = await getImageURL(card.pixabayId);
            return { ...card, imageUrl };
          })
        );

        setLoadState({
          loading: false,
          cards: loadedCards.filter((card) => card.imageUrl !== null),
          error: null,
        });
      } catch (e) {
        setLoadState({
          loading: false,
          cards: [],
          error: e.message,
        });
      }
    };

    loadImages();
  }, []);

  const imageReady = () => {
    setImagesReady((prevImagesReady) => {
      const updatedValue = prevImagesReady + 1;
      console.log(`Images ready: ${updatedValue}`);
      if (updatedValue === 12) {
        setAllImagesReady(true);
      }
      return updatedValue;
    });
  };

  const shuffleCards = () => {
    setIsFlipped(true);
    playSFX(sfxRef_shuffle)
    setTimeout(() => {
      const shuffledCards = [...loadState.cards].sort(
        () => Math.random() - 0.5
      );
      setLoadState({ ...loadState, cards: shuffledCards });
    }, 600);

    setTimeout(() => {
      setIsFlipped(false);
      playSFX(sfxRef_shuffle)
    }, 800);
  };

  const pickCard = (id) => {
    const updatedPickedCards = [...pickedCards, id];
    setPickedCards(updatedPickedCards);
    console.log(updatedPickedCards);
  };

  const isRepeated = (id) => {
    let isRepeated = false;

    for (let card of pickedCards) {
      if (card === id) {
        isRepeated = true;
        playSFX(sfxRef_negativeBleep)
        return isRepeated;
      }
    }

    playSFX(sfxRef_positiveBleep)
    return isRepeated;
  };

  const increaseScore = () => {
    let newScore = currentScore + 1;
    setCurrentScore(newScore);

    const scoreElement = document.querySelector(".score");
    scoreElement.classList.add("blink");
    setTimeout(() => {
      scoreElement.classList.remove("blink");
    }, 500);

    if (newScore > maxScore) {
      setMaxScore(newScore);

      const maxScoreElement = document.querySelector(".maxScore");
      maxScoreElement.classList.add("blink");
      setTimeout(() => {
        maxScoreElement.classList.remove("blink");
      }, 500);
    }

    if (newScore >= 12) {
      setShowModal(true);
      playSFX(sfxRef_gameWon)
    }
  };

  const highlightCards = (id) => {
    const newPickedCards = [...pickedCards, id]; // add the last picked card to the array to compensate it's lacking in the state
    for (let i = 0; i <= newPickedCards.length - 1; i++) {
      let card = newPickedCards[i];

      if (i !== newPickedCards.length - 1) {
        document.getElementById(card).classList.add("green");
        setTimeout(() => {
          document.getElementById(card).classList.remove("green");
        }, 1000);
      } else {
        document.getElementById(card).classList.add("red");
        setTimeout(() => {
          document.getElementById(card).classList.remove("red");
        }, 1000);
      }
    }
  };

  const handleCardClick = (id) => {
    pickCard(id);

    if (!isRepeated(id)) {
      console.log("Ok");
      increaseScore();

      currentScore < 11 ? shuffleCards() : "";
    } else {
      console.log("DUH!");
      highlightCards(id);

      setTimeout(() => {
        setCurrentScore(0);
        setPickedCards([]);
        shuffleCards();
      }, 1000);
    }
  };

  const handlePlayAgainClick = () => {
    setShowModal(false);
    setCurrentScore(0);
    setPickedCards([]);
    shuffleCards();
  }

  return (
    <>
      <div className={`header`}>
        <img className="header_btn" src="./public/settingsIcon.svg" alt="Settings icon" onClick={() => setShowSettings(true)}/>
        <div className="title">Animal Count</div>
        <div
          className={`score ${
            loadState.loading || !allImagesReady ? "invisible" : ""
          }`}
        >
          {`Score: ${currentScore}`}
        </div>
        <div
          className={`maxScore ${
            loadState.loading || !allImagesReady ? "invisible" : ""
          }`}
        >
          {`Max Score: ${maxScore}`}
        </div>
      </div>
      <div className="main">
        <div
          className={`
            card-grid 
            ${loadState.loading || !allImagesReady ? "hidden" : ""}
          `}
        >
          {loadState.cards.map((card) => {
            return (
              <Card
                key={card.id}
                id={card.id}
                url={card.imageUrl}
                cards={loadState.cards}
                isFlipped={isFlipped}
                onClick={() => handleCardClick(card.id)}
                imageReady={imageReady}
              />
            );
          })}
        </div>
        <div
          className={`loading_container ${
            loadState.loading || !allImagesReady ? "" : "hidden"
          }`}
        >
          <div className="loading_spinner"></div>
          <div className="loading_message">Loading...</div>
        </div>
        <div className={`gameOver_modal ${showModal ? "" : "hidden"}`} id="modal">
          <div className={`gameOver_container`}>
            <div className={'confetti'}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            </div>
            <div className={`gameOver_board`}> 
              <div className={'gameOver_message'}>Great job! You Won!</div>
              <img src="./public/trophy-153395.svg" />
              <div className={`gameOver_btn`}>
                <div onClick={handlePlayAgainClick}>Play again?</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
