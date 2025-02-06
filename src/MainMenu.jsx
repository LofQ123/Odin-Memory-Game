import { useState } from "react";
import PropTypes from "prop-types";

MainMenu.propTypes = {
  setGameState: PropTypes.func,
};

export default function MainMenu({ setGameState, musicOn, toggleMusic, setShowSettings }) {
  const [showCredits, setShowCredits] = useState(false);
  const [startingGame, setStartingGame] = useState(false);

  const startGame = () => {
    setStartingGame(true);

    setTimeout(() => {
      setGameState("gameOn");
    }, 1000);
  };

  return (
    <div className="mainMenu">
      <div
        className={`mainMenu_title ${showCredits ? "hidden" : ""} ${
          startingGame ? "fadeOut" : ""
        }`}
      >
        Animal Count
      </div>
      <div
        className={`mainMenu_container ${showCredits ? "credits" : ""} ${
          startingGame ? "fadeOut" : ""
        }`}
      >
        <div
          className={`mainMenu_start ${showCredits ? "hidden" : ""} ${
            startingGame ? "fadeOut" : ""
          }`}
          onClick={startGame}
        >
          Start
        </div>
        <div
          className={`mainMenu_music ${showCredits ? "hidden" : ""} ${
            startingGame ? "fadeOut" : ""
          }`}
          onClick={() => setShowSettings ("true")}
        >
          {`Settings`}
        </div>
        <div
          className={`mainMenu_credits ${showCredits ? "raised" : ""} ${
            startingGame ? "fadeOut" : ""
          }`}
          onClick={showCredits ? undefined : () => setShowCredits(true)}
        >
          Credits
        </div>

        <div className={`credits_content ${showCredits ? "" : "hidden"}`}>
          Animal pictures: Dmitry Abramov
          <a href="https://pixabay.com/users/creozavr-2567670/" target="_blank">
            (@creozavr)
          </a>
        </div>
        <div className={`credits_content ${showCredits ? "" : "hidden"}`}>
          Background and music AI-generated
        </div>
        <div
          className={`credits_backBtn ${showCredits ? "" : "hidden"}`}
          onClick={() => setShowCredits(false)}
        >
          Back
        </div>
      </div>
      <div className="mainMenu_footer">
        <a href="https://github.com/LofQ123" target="_blank">
          <img className="gitLogo" src="./assets/gitLogo.svg" />
        </a>
        <div>Ruslan Alexeev</div>
      </div>
    </div>
  );
}
