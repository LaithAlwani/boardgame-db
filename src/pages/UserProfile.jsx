import {useState } from "react";
import XMLParser from "react-xml-parser";


export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [games, setGames] = useState([]);
  const collectionURL = `collection?username=${username}`;
  const thingURL = `thing?type=boardgame`;

  const handleClick = () => {
    
      fetch(`https://boardgamegeek.com/xmlapi2/${collectionURL}`, {
        crossDomain: true,
      })
        .then((res) => res.text())
        .then((data) => {
          
          setGames([]);
          var xml = new XMLParser().parseFromString(data);
          setGames(xml.children);
        })
        .catch((err) => console.log);
    
  };

  return (
    <div className="App">
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleClick}>import BGG</button>
      <p>Total Games: {games.length}</p>
      <div className="grid">
        {games.map((game) => (
          <div key={game.attributes.objectid}>
            <div className="img-container">
              <img src={game.children[2].value} alt=""  />
            </div>
            <h4> { game.children[0].value.search("&#039;")? game.children[0].value.replace("&#039;", "'"):game.children[0].value }</h4>
            <span>Plays: {game.children[5].value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
