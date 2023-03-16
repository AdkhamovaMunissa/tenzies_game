import './App.css';
import Die from "./Die";
import {nanoid} from "nanoid";
import Confetti from "react-confetti";
import React, { useEffect, useState } from "react";

function App() {


    const [dice, setDice] = useState(allNewDice());
    const [tenzies, setTenzies] = useState(false);
    const [count, setCount] = useState(25);
    const [gameOver, setGameOver]= useState(false);
    const [bestCount, setBestCount] = useState(JSON.parse(localStorage.getItem("bestCount")) || 24);

    useEffect(() => {
      localStorage.setItem("bestCount", JSON.stringify(bestCount));
    }, [bestCount]);

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice]);

  

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function newGame () {
      setGameOver(false);
      setCount(25);
      console.log(count, gameOver);
      setTenzies(false);
      setDice(allNewDice());
    }
    
    
    function rollDice() {
        console.log(count, gameOver);
        if (count > 0) {
            if(!tenzies) {
                setCount(count-1);
                setDice(oldDice => oldDice.map(die => {
                    return die.isHeld ? 
                        die :
                        generateNewDie()
            }))
            } else if (tenzies){
                setCount(25);
                console.log(count);
                setTenzies(false);
                setDice(allNewDice());
                if (bestCount < count) setBestCount(count);
            }
        }
        else {
           setGameOver(true); 
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {gameOver && 
                <div className="game">
                    <h1 className="title">Game Over!</h1>
                    <p className="instructions">Out of rolls!</p>
                    <button className="roll-dice" onClick={newGame}>New Game!</button>
                </div>
            }
            {!gameOver &&
                <div className="game"> 
                    {tenzies && <Confetti />}
                    <h1 className="title">Tenzies</h1>
                    <p className="instructions">Roll until all dice are the same. 
                    Click each die to freeze it at its current value between rolls.</p>
                    <h4 className="best-score">Best Score: {bestCount}</h4> 
                    <div className="dice-container">
                        {diceElements}
                    </div>
                    <h4 className="rolls-left">Rolls Left: {count}</h4>
                    <button 
                        className="roll-dice" 
                        onClick={rollDice}
                    >
                        {tenzies ? "New Game" : "Roll"}
                    </button> 
                </div> 
            }
            <footer className='footer'>Adkhamova Munissa</footer>
        </main>
    )
}

export default App;
