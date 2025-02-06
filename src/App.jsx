import { useEffect, useState, useRef } from 'react'
import './App.css'
import './MainMenu.css'
import GameOn from './GameOn'
import MainMenu from './MainMenu'
import backgroundMusic from './assets/background_music.mp3'
import card_flip from "./assets/card_flip.mp3";
import positive_bleep from "./assets/positive_bleep.mp3";
import negative_bleep from "./assets/negative_bleep.mp3";
import win_sound from "./assets/winSound.wav";

function App() {
  const [gameState, setGameState] = useState("mainMenu");
  const [musicOn, setMusicOn] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.6);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [musicVolume, setMusicVolume] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);

  const musicRef = useRef(null);
  const sfxRef_positiveBleep = useRef(null);
  const sfxRef_negativeBleep = useRef(null);
  const sfxRef_gameWon = useRef(null);
  const sfxRef_shuffle = useRef(null);

  const decreaseGlobalVolume = () => {
    let newVolume = globalVolume - 0.1;
    newVolume = parseFloat(newVolume.toFixed(1));
    if (newVolume < 0) newVolume = 0.0;
    setGlobalVolume(newVolume)
  }

  const increaseGlobalVolume = () => {
    let newVolume = globalVolume + 0.1;
    newVolume = parseFloat(newVolume.toFixed(1));    
    if (newVolume > 1) newVolume = 1.0;
    setGlobalVolume(newVolume)
  }

  const decreaseMusicVolume = () => {
    let newVolume = musicVolume - 0.1;
    newVolume = parseFloat(newVolume.toFixed(1));
    if (newVolume < 0) newVolume = 0.0;
    setMusicVolume(newVolume)
  }

  const increaseMusicVolume = () => {
    let newVolume = musicVolume + 0.1;
    newVolume = parseFloat(newVolume.toFixed(1));
    if (newVolume > 1) newVolume = 1.0;
    setMusicVolume(newVolume)
  }

  const decreaseSfxVolume = () => {
    let newVolume = sfxVolume - 0.1;
    newVolume = parseFloat(newVolume.toFixed(1));
    if (newVolume < 0) newVolume = 0.0;
    setSfxVolume(newVolume);
  }

  const increaseSfxVolume = () => {
    let newVolume = sfxVolume + 0.1;
    newVolume = parseFloat(newVolume.toFixed(1));    
    if (newVolume > 1) newVolume = 1.0;
    setSfxVolume(newVolume)
  }

  const toggleMusic = () => {
    setMusicOn(!musicOn)
  }

  // Original mounting of background music
  useEffect(() => {
    musicRef.current = new Audio(backgroundMusic);
    musicRef.current.loop = true;

    if (musicOn) musicRef.current.play() 
    else musicRef.current.pause()

    return () => {
      musicRef.current.pause();
      musicRef.current = null;
    }
  }, [musicOn])

  // Changing music volume
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = 1.0 * musicVolume * globalVolume
    }
  }, [globalVolume, musicVolume])

  // Mounting SFX 
  useEffect(() => {
    sfxRef_positiveBleep.current = new Audio(positive_bleep);
    sfxRef_positiveBleep.current.volume = 0.6 * sfxVolume * globalVolume;
    sfxRef_negativeBleep.current = new Audio(negative_bleep);
    sfxRef_negativeBleep.current.volume = 0.6 * sfxVolume * globalVolume;
    sfxRef_gameWon.current = new Audio(win_sound);
    sfxRef_gameWon.current.volume = 1.0 * sfxVolume * globalVolume;
    sfxRef_shuffle.current = new Audio(card_flip);
    sfxRef_shuffle.current.volume = 1.0 * sfxVolume * globalVolume;
  }, [globalVolume, sfxVolume])

  const playSFX = (sound) => {
    sound.current.play();
  }

  useEffect(() => {
    playSFX(sfxRef_shuffle);
  }, [sfxVolume])

  return (
    <>
      <div className={`gameSettings_modal ${showSettings ? "" : "hidden"}`}>
        <div className="gameSettings_board">
          <div className="gameSettings_title">Settings</div>
          <div className="gameSettings_option">
            {`Global Volume:`}
            <span className="gameSettings_controller" onClick={decreaseGlobalVolume}> - </span>
            {`${globalVolume * 100}%`}
            <span className="gameSettings_controller" onClick={increaseGlobalVolume}> + </span>
          </div>
          <div className="gameSettings_option" onClick={toggleMusic}>
            {`Music: `}
            <span className="gameSettings_controller">{`${musicOn ? "ON" : "OFF"}`}</span>
          </div>
          <div className="gameSettings_option">
            {`Music Volume:`} 
            <span className="gameSettings_controller" onClick={decreaseMusicVolume}> - </span>
            {`${musicVolume * 100}%`}
            <span className="gameSettings_controller" onClick={increaseMusicVolume}> + </span>
          </div>
          <div className="gameSettings_option">
            {`SFX Volume:`} 
            <span className="gameSettings_controller" onClick={decreaseSfxVolume}> - </span>
            {`${sfxVolume * 100}%`}
            <span className="gameSettings_controller" onClick={increaseSfxVolume}> + </span>
          </div>
          <div className="gameSettings_btn" onClick={() => setShowSettings(false)}>Close</div>
        </div>
      </div>
      {gameState === "gameOn" ? 
        <GameOn 
          musicOn={musicOn} 
          setMusicOn={setMusicOn} 
          playSFX={playSFX}
          sfxRef_shuffle={sfxRef_shuffle}
          sfxRef_gameWon={sfxRef_gameWon}
          sfxRef_negativeBleep={sfxRef_negativeBleep}
          sfxRef_positiveBleep={sfxRef_positiveBleep}
          setShowSettings={setShowSettings}
        /> : 
        <MainMenu 
          setGameState={setGameState} 
          musicOn={musicOn} 
          toggleMusic={toggleMusic}
          setShowSettings={setShowSettings}
        />}
    </>
  )
}

export default App
