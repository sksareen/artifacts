import React, { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

const PokerChipTracker = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [pot, setPot] = useState(0);
  const [history, setHistory] = useState([]);
  const [blindTimer, setBlindTimer] = useState({ time: 900, level: 1, smallBlind: 5, bigBlind: 10 });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [customChipAmount, setCustomChipAmount] = useState('');
  const [peerId, setPeerId] = useState('');
  const [peers, setPeers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [joinId, setJoinId] = useState('');

  const chipDenominations = [5, 10, 25, 100, 500, 1000];

  useEffect(() => {
    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('connection', (conn) => {
      conn.on('data', handleIncomingData);
      setPeers(prevPeers => [...prevPeers, conn]);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const handleIncomingData = (data) => {
    switch (data.type) {
      case 'GAME_STATE':
        setPlayers(data.players);
        setPot(data.pot);
        setHistory(data.history);
        setBlindTimer(data.blindTimer);
        setIsTimerRunning(data.isTimerRunning);
        break;
      // Add other case handlers as needed
    }
  };

  const broadcastGameState = useCallback(() => {
    const gameState = {
      type: 'GAME_STATE',
      players,
      pot,
      history,
      blindTimer,
      isTimerRunning
    };
    peers.forEach(conn => conn.send(gameState));
  }, [players, pot, history, blindTimer, isTimerRunning, peers]);

  useEffect(() => {
    if (isHost) {
      broadcastGameState();
    }
  }, [isHost, broadcastGameState]);

  const createGame = () => {
    setIsHost(true);
    addToHistory('Game created. Share your ID with others to join.');
  };

  const joinGame = () => {
    const peer = new Peer();
    peer.on('open', () => {
      const conn = peer.connect(joinId);
      conn.on('open', () => {
        conn.on('data', handleIncomingData);
        setPeers([conn]);
        addToHistory('Joined the game successfully.');
      });
    });
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = { id: Date.now(), name: newPlayerName.trim(), chips: 1000 };
      setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
      setNewPlayerName('');
      addToHistory(`${newPlayerName.trim()} joined the game with 1000 chips`);
    }
  };

  const updateChips = (id, amount) => {
    setPlayers(prevPlayers => prevPlayers.map(player =>
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
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== id));
    addToHistory(`${player.name} left the game with ${player.chips} chips`);
  };

  const resetGame = () => {
    setPlayers(prevPlayers => prevPlayers.map(player => ({ ...player, chips: 1000 })));
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

  return (
    <div>
      <h1>Multi-Device Poker Chip Tracker</h1>
      
      {!isHost && peers.length === 0 && (
        <div>
          <button onClick={createGame}>Create Game</button>
          <input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="Enter host's ID"
          />
          <button onClick={joinGame}>Join Game</button>
        </div>
      )}
      
      {isHost && (
        <div>
          Your Host ID: {peerId} (Share this with others to join)
        </div>
      )}

      <div>
        <div>
          <div>{formatTime(blindTimer.time)}</div>
          <div>Blinds: {blindTimer.smallBlind}/{blindTimer.bigBlind}</div>
        </div>
        <button onClick={() => setIsTimerRunning(!isTimerRunning)}>
          {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
        </button>
      </div>
      <div>Pot: ${pot}</div>
      <div>
        {players.map((player) => (
          <div key={player.id}>
            <div>
              <span>{player.name}</span>
              <span>${player.chips}</span>
            </div>
            <div>
              {chipDenominations.map(denomination => (
                <button key={denomination} onClick={() => updateChips(player.id, denomination)}>+{denomination}</button>
              ))}
              {chipDenominations.map(denomination => (
                <button key={-denomination} onClick={() => updateChips(player.id, -denomination)}>-{denomination}</button>
              ))}
              <input
                type="number"
                value={customChipAmount}
                onChange={(e) => setCustomChipAmount(e.target.value)}
                placeholder="Custom amount"
              />
              <button onClick={() => {
                updateChips(player.id, parseInt(customChipAmount) || 0);
                setCustomChipAmount('');
              }}>Add/Remove</button>
              <button onClick={() => allIn(player.id)}>All-In</button>
              <button onClick={() => settlePot(player.id)}>Win Pot</button>
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        placeholder="New player name"
      />
      <button onClick={addPlayer}>Add Player</button>
      <button onClick={resetGame}>Reset Game</button>
      <div>
        {history.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default PokerChipTracker;