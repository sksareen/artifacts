import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FantasyBuddy = () => {
  const [team, setTeam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [settings, setSettings] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'YOUR_YAHOO_API_KEY';
  const teamId = 'YOUR_TEAM_ID';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setTeam(teamResponse.data);

        const rosterResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/roster`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setRoster(rosterResponse.data);

        const transactionsResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/transactions`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setTransactions(transactionsResponse.data);

        const scheduleResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/schedule`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setSchedule(scheduleResponse.data);

        const matchupsResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/matchups`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setMatchups(matchupsResponse.data);

        const settingsResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/settings`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setSettings(settingsResponse.data);

        const notificationsResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/notifications`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setNotifications(notificationsResponse.data);

        const recommendationsResponse = await axios.get(`https://fantasysports.yahooapis.com/fantasy/v2/team/${teamId}/recommendations`, {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        setRecommendations(recommendationsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey, teamId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Fantasy Buddy</h1>
      {team && (
        <div>
          <h2>Team: {team.name}</h2>
          <h3>Roster</h3>
          <ul>
            {roster.map(player => (
              <li key={player.player_id}>{player.name}</li>
            ))}
          </ul>
          <h3>Transactions</h3>
          <ul>
            {transactions.map(transaction => (
              <li key={transaction.transaction_id}>{transaction.type}</li>
            ))}
          </ul>
          <h3>Schedule</h3>
          <ul>
            {schedule.map(game => (
              <li key={game.game_id}>{game.date}</li>
            ))}
          </ul>
          <h3>Matchups</h3>
          <ul>
            {matchups.map(matchup => (
              <li key={matchup.matchup_id}>{matchup.opponent}</li>
            ))}
          </ul>
          <h3>Settings</h3>
          <pre>{JSON.stringify(settings, null, 2)}</pre>
          <h3>Notifications</h3>
          <ul>
            {notifications.map(notification => (
              <li key={notification.notification_id}>{notification.message}</li>
            ))}
          </ul>
        </div>
      )}
      <h3>Recommendations</h3>
      <ul>
        {recommendations.map(recommendation => (
          <li key={recommendation.player_id}>
            {recommendation.name}: {recommendation.rationale}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FantasyBuddy;
