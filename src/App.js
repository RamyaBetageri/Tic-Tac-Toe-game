import { useState  } from 'react';
import logo from './logo.svg';
import './App.css';
import Player from './components/player.js';
import GameBoard from './components/GameBoard.js';
import Log from './components/Log.js';
import GameOver from './components/GameOver';
import { WINNING_COMBINATIONS } from './components/winning_combination';

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

      if (gameTurns.length > 0 && gameTurns[0].player === 'X'){
        currentPlayer = 'O';
      }
      return currentPlayer;
}


function App() {

  const [players, setPlayers] = useState({
    'X': 'Player 1',
    'O':'Player 2'
  });

  const [gameTurns, setGameTurns] = useState([]);
  //const [hasWinner, setHasWinner] = useState(false);
  //const [activePlayer, setActivePlayer] = useState('X');

  const activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard].map(array => [...array]);


  for (const turn of gameTurns){
      const { square, player} = turn;
      const {row, col} = square;

      gameBoard[row][col]= player;
  }
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination [0].row][combination [0].column];
    const secondSquareSymbol = gameBoard[combination [1].row][combination [1].column];
    const thirdSquareSymbol = gameBoard[combination [2].row][combination [2].column];

    if (firstSquareSymbol && 
      firstSquareSymbol === secondSquareSymbol && 
      firstSquareSymbol === thirdSquareSymbol
    ){
      winner = players[firstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    //setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X' );
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: {row: rowIndex, col: colIndex}, player: activePlayer },
         ...prevTurns,
        ];
        return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return{
        ...prevPlayers,
        [symbol]: newName

      };
    });
  }

  return (
  <main>
    <div id="game-container">
      <ol id="players" className= "highlight-player">
      <Player
       intialName="player1" 
       symbol="X" 
       isActive={activePlayer === 'X'}
       onChangeName={handlePlayerNameChange}
       />
      <Player 
      intialName="player2" 
      symbol="O" 
      isActive={activePlayer === 'O'}
      onChangeName={handlePlayerNameChange}
      />

        
      </ol>
      {(winner ||hasDraw) &&(
         <GameOver winner= {winner} onRestart={handleRestart}/>
         )}
      <GameBoard  onSelectSquare={handleSelectSquare} board={gameBoard}/>
    </div>

    <Log turns={gameTurns}/>

  </main>
  );
}

export default App;
