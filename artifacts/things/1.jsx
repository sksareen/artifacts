import React, { useState, useEffect } from 'react';

const PokerChipTracker = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', chips: 1000 },
    { id: 2, name: 'Player 2', chips: 1000 },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [pot, setPot] = useState(0);
  const [history, setHistory] = useState([]);
  const [blindTimer, setBlindTimer] = useState({ time: 900, level: 1, smallBlind: 5, bigBlind: 10 });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [customChipAmount, setCustomChipAmount] = useState('');

  const chipDenominations = [5, 10, 25, 100, 500, 1000];

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = { id: Date.now(), name: newPlayerName.trim(), chips: 1000 };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      addToHistory(`${newPlayerName.trim()} joined the game with 1000 chips`);
    }
  };

  const updateChips = (id, amount) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, chips: Math.max(0, player.chips + amount) } : player
    ));
    const player = players.find(p => p.id === id);
    addToHistory(`${player.name} ${amount > 0 ? 'received' : 'bet'} ${Math.abs(amount)} chips`);
    if (amount < 0) {
      setPot(prevPot => prevPot + Math.abs(amount));
    }
  };

  const removePlayer = (id) => {
    const player = players.find(p => p.id === id);
    setPlayers(players.filter(p => p.id !== id));
    addToHistory(`${player.name} left the game with ${player.chips} chips`);
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({ ...player, chips: 1000 })));
    setPot(0);
    setHistory([]);
    setBlindTimer({ time: 900, level: 1, smallBlind: 5, bigBlind: 10 });
    addToHistory('Game reset. All players start with 1000 chips');
  };

  const allIn = (id) => {
    const player = players.find(p => p.id === id);
    updateChips(id, -player.chips);
    addToHistory(`${player.name} went all-in with ${player.chips} chips`);
  };

  const addToHistory = (entry) => {
    setHistory(prevHistory => [`${new Date().toLocaleTimeString()} - ${entry}`, ...prevHistory.slice(0, 9)]);
  };

  const settlePot = (winnerId) => {
    const winner = players.find(p => p.id === winnerId);
    updateChips(winnerId, pot);
    addToHistory(`${winner.name} won the pot of ${pot} chips`);
    setPot(0);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && blindTimer.time > 0) {
      interval = setInterval(() => {
        setBlindTimer(prevTimer => ({
          ...prevTimer,
          time: prevTimer.time - 1
        }));
      }, 1000);
    } else if (blindTimer.time === 0) {
      setBlindTimer(prevTimer => ({
        time: 900,
        level: prevTimer.level + 1,
        smallBlind: prevTimer.smallBlind * 2,
        bigBlind: prevTimer.bigBlind * 2
      }));
      addToHistory(`Blinds increased to ${blindTimer.smallBlind * 2}/${blindTimer.bigBlind * 2}`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, blindTimer.time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
      fontFamily: 'Arial, sans-serif',
      color: '#e0e0e0',
    },
    title: {
      textAlign: 'center',
      fontSize: '28px',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
    playerList: {
      marginBottom: '20px',
    },
    playerItem: {
      background: 'linear-gradient(145deg, #2a2a2a, #3a3a3a)',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '10px',
    },
    playerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    playerName: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    chipCount: {
      fontSize: '16px',
      color: '#ffd700',
    },
    chipButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px',
    },
    button: {
      background: 'linear-gradient(145deg, #3a3a3a, #4a4a4a)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '5px',
      border: 'none',
      background: '#3a3a3a',
      color: '#fff',
    },
    addButton: {
      width: '100%',
      padding: '10px',
      background: 'linear-gradient(145deg, #32CD32, #228B22)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.3s ease',
    },
    resetButton: {
      width: '100%',
      padding: '10px',
      background: 'linear-gradient(145deg, #FF4500, #FF6347)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '20px',
      transition: 'all 0.3s ease',
    },
    potDisplay: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '20px 0',
      color: '#ffd700',
    },
    historyContainer: {
      marginTop: '20px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '10px',
      padding: '10px',
      maxHeight: '200px',
      overflowY: 'auto',
    },
    historyItem: {
      marginBottom: '5px',
      fontSize: '14px',
    },
    timerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '10px',
      padding: '10px',
    },
    timerDisplay: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    blindDisplay: {
      fontSize: '18px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Poker Chip Tracker Pro</h1>
      <div style={styles.timerContainer}>
        <div>
          <div style={styles.timerDisplay}>{formatTime(blindTimer.time)}</div>
          <div style={styles.blindDisplay}>Blinds: {blindTimer.smallBlind}/{blindTimer.bigBlind}</div>
        </div>
        <button style={styles.button} onClick={() => setIsTimerRunning(!isTimerRunning)}>
          {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
        </button>
      </div>
      <div style={styles.potDisplay}>Pot: ${pot}</div>
      <div style={styles.playerList}>
        {players.map((player) => (
          <div key={player.id} style={styles.playerItem}>
            <div style={styles.playerHeader}>
              <span style={styles.playerName}>{player.name}</span>
              <span style={styles.chipCount}>${player.chips}</span>
            </div>
            <div style={styles.chipButtons}>
              {chipDenominations.map(denomination => (
                <button key={denomination} style={styles.button} onClick={() => updateChips(player.id, denomination)}>+{denomination}</button>
              ))}
              {chipDenominations.map(denomination => (
                <button key={-denomination} style={styles.button} onClick={() => updateChips(player.id, -denomination)}>-{denomination}</button>
              ))}
              <input
                type="number"
                value={customChipAmount}
                onChange={(e) => setCustomChipAmount(e.target.value)}
                placeholder="Custom amount"
                style={{...styles.input, width: '100px', marginRight: '5px'}}
              />
              <button style={styles.button} onClick={() => {
                updateChips(player.id, parseInt(customChipAmount) || 0);
                setCustomChipAmount('');
              }}>Add/Remove</button>
              <button style={{...styles.button, background: 'linear-gradient(145deg, #FF4500, #FF6347)'}} onClick={() => allIn(player.id)}>All-In</button>
              <button style={{...styles.button, background: 'linear-gradient(145deg, #4169E1, #1E90FF)'}} onClick={() => settlePot(player.id)}>Win Pot</button>
            </div>
          </div>
        ))}
      </div>
      <input
        style={styles.input}
        type="text"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        placeholder="New player name"
      />
      <button style={styles.addButton} onClick={addPlayer}>Add Player</button>
      <button style={styles.resetButton} onClick={resetGame}>Reset Game</button>
      <div style={styles.historyContainer}>
        {history.map((entry, index) => (
          <div key={index} style={styles.historyItem}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default PokerChipTracker;