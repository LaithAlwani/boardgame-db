import { useState } from "react";
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
        // console.log(xml.children[9]);
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
          <div key={game.attributes.objectid} className="game-">
            <div className="img-container">
              <img src={game.children[2].value} alt="" />
            </div>
            <h3>
              {" "}
              {game.children[0].value.search("&#039;")
                ? game.children[0].value.replace("&#039;", "'")
                : game.children[0].value}
            </h3>
            <p>Plays: {game.children[5].value}</p>
            {game.children[4].attributes.own === "1" && <span className="tag">own</span>}
            {game.children[4].attributes.prevowned === "1" && (
              <span className="tag">prev-owned</span>
            )}
            {game.children[4].attributes.wanttoplay === "1" && (
              <span className="tag">want to play</span>
            )}
            {game.children[4].attributes.want === "1" ||
              game.children[4].attributes.wanttobuy === "1" ||
              (game.children[4].attributes.wishlist === "1" && (
                <span className="tag">whishlist</span>
              ))}
            {game.children[4].attributes.preordered === "1" && (
              <span className="tag">preorder</span>
            )}
            {game.children[4].attributes.fortrade === "1" && <span className="tag">for trade</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
