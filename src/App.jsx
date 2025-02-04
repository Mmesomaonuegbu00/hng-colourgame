import { useState, useEffect } from "react";
import "./App.css";
import think from "./assets/think.png";
import winSound from "./assets/win.mp3";
import wrong from "./assets/wrong.mp3";

function App() {
  const [targetColor, setTargetColor] = useState("");
  const [colorOptions, setColorOptions] = useState([]);
  const [frontColors, setFrontColors] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("");
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [lives, setLives] = useState(3);
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);

  useEffect(() => {
    startNewGame(true);
  }, []);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startNewGame = (resetScore = false) => {
    let newTargetColor = generateRandomColor();
    let options = new Set([newTargetColor]);

    while (options.size < 6) {
      options.add(generateRandomColor());
    }

    let optionList = [...options];
    let uniqueFrontColors = optionList.map(() => generateRandomColor());

    setTargetColor(newTargetColor);
    setColorOptions(shuffleArray(optionList));
    setFrontColors(shuffleArray(uniqueFrontColors));
    setGameStatus("");
    setFlippedIndex(null);
    setLives(3);
    setWinCount(0);
    setLoseCount(0);

    if (resetScore) {
      setScore(0);
    }
  };

  const playSound = (sound) => {
    new Audio(sound).play();
  };

  const handleGuess = (color, index) => {
    setFlippedIndex(index);

    setTimeout(() => {
      if (color === targetColor) {
        setScore((prevScore) => prevScore + 1);
        setWinCount((prev) => prev + 1);
        setGameStatus("Correct! 🎉");
        playSound(winSound);
        setTimeout(() => startNewGame(), 2000);
      } else {
        setLives((prevLives) => prevLives - 1);
        setLoseCount((prev) => prev + 1);
        setGameStatus("You Are Wrong! ❌");
        playSound(wrong);
        setTimeout(() => {
          setGameStatus("");
          setFlippedIndex(null);
        }, 1000);

        if (lives - 1 === 0) {
          setTimeout(() => {
            alert("Game Over! You lost all lives.");
            startNewGame(true);
          }, 1000);
        }
      }
    }, 300);
  };

  return (
    <div className="game-container">
      <div className="guess-text">
        <h1>Color Guessing Game</h1>
        <p data-testid="gameInstructions"
        >Guess the correct color by choosing the correct colour option!</p>
        <div className="lives">
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} style={{ fontSize: "24px", color: "red" }}>❤️</span>
          ))}
        </div>
      </div>

      <p className="status" data-testid="gameStatus"
      >{gameStatus}</p>

      <div className="colour-div">
        <img src={think} alt="" />
        <div className="target-box" data-testid="colorBox"
          style={{ backgroundColor: targetColor }}>
          ?? guess ??
        </div>
      </div>

      <div className="score">
        <p data-testid="score"
        >Your Score: {score} | Losses: {loseCount}</p>
        <button onClick={() => startNewGame(true)} data-testid="newGameButton"
        >New Game</button>
      </div>

      <div className="options-container">
        {colorOptions.map((color, index) => (
          <div
            key={index}
            className={`color-option ${flippedIndex === index ? "flipped" : ""}`}
            onClick={() => handleGuess(color, index)}
            data-testid="colorOption"

          >
            <div className="color-front" style={{ backgroundColor: frontColors[index] }}></div>
            <div className="color-back" style={{ backgroundColor: color }}></div>
          </div>
        ))}
      </div>

      <p>NB: this surface isn't the real color</p>
    </div>
  );
}

export default App