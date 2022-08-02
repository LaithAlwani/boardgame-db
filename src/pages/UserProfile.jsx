import { useState } from "react";
import XMLParser from "react-xml-parser";
import { MdOutlineViewList } from "react-icons/md";
import { MdOutlineGridView } from "react-icons/md";
import { toast } from "react-hot-toast";
import ScrollableList from "../components/ScrollableList";

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [games, setGames] = useState([]);
  const [gamesByFilter, setGamesByFilter] = useState([]);
  const [gridView, setGridView] = useState(true);
  const [loading, setLoading] = useState(false);
  const collectionURL = `collection?username=${username}`;
  const thingURL = `thing?type=boardgame`;

  const handleClick = () => {
    if (username) {
      setLoading(true);
      fetch(`https://boardgamegeek.com/xmlapi2/${collectionURL}`, {
        crossDomain: true,
      })
        .then((res) => res.text())
        .then((data) => {
          setGames([]);
          var xml = new XMLParser().parseFromString(data);
          const tempGames = []
          // console.log(xml.children[5])
          xml.children.forEach((game, i) => {
            const tempgame = {}
            game.children.forEach(child => {
              // console.log(child)
              if (child.name === "name") tempgame.title = child.value
              if (child.name === "originalname") tempgame.title = child.value
              if (child.name === "numplays") tempgame.numPlays = parseInt(child.value) 
              if (child.name === "image") tempgame.image = child.value
              if (child.name === "thumbnail") tempgame.thumbnail = child.value
              if (child.name === "status") tempgame.status = child.attributes
              if (child.name === "comment") tempgame.comment = child.value
              // tempGames.push(tempgame)
            })
            tempGames.push(tempgame)
          })
          console.log("tempgames=>",tempGames)
          setGames(tempGames);
          setGamesByFilter(tempGames);
          setUsername("");
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } else {
      toast.error("username required");
    }
  };

  const getDecodedString = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const filterByTag = (value) => {
    setTag(value);
    
    if (value === "own") {
      setGamesByFilter(games.filter((game) => game.status.own !== "0"));
    } else if (value === "wanttoplay") {
      setGamesByFilter(games.filter((game) => game.status.wanttoplay !== "0"));
    } else if (value === "prevowned") {
      setGamesByFilter(games.filter((game) => game.status.prevowned !== "0"));
    } else if (value === "fortrade") {
      setGamesByFilter(games.filter((game) => game.status.fortrade !== "0"));
    } else if (value === "preorder") {
      setGamesByFilter(games.filter((game) => game.status.preordered !== "0"));
    } else if (value === "wishlist") {
      setGamesByFilter(
        games.filter(
          (game) =>
            game.status.want !== "0" ||
            game.status.wanttobuy !== "0" ||
            game.status.wishlist !== "0"
        )
      );
    } else {
      setGamesByFilter(games);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="BGG username"
        className="bgg-username-input"
      />
      <button onClick={handleClick}>import</button>
      {games.length > 0 && (
        <div className="filters">
          <span
            className={tag === "own" ? "tag green checked" : "tag green"}
            onClick={tag === "own" ? () => filterByTag("") : () => filterByTag("own")}>
            Own
          </span>
          <span
            className={tag === "prevowned" ? "tag yellow checked" : "tag yellow"}
            onClick={tag === "prevowned" ? () => filterByTag("") : () => filterByTag("prevowned")}>
            prev
          </span>
          <span
            className={tag === "wanttoplay" ? "tag blue checked" : "tag blue"}
            onClick={
              tag === "wanttoplay" ? () => filterByTag("") : () => filterByTag("wanttoplay")
            }>
            play
          </span>
          <span
            className={tag === "wishlist" ? "tag pink checked" : "tag pink"}
            onClick={tag === "wishlist" ? () => filterByTag("") : () => filterByTag("wishlist")}>
            Wishlist
          </span>
          <span
            className={tag === "fortrade" ? "tag red checked" : "tag red"}
            onClick={tag === "fortrade" ? () => filterByTag("") : () => filterByTag("fortrade")}>
            Trade
          </span>
          <span
            className={tag === "preorder" ? "tag brown checked" : "tag brown"}
            onClick={tag === "preorder" ? () => filterByTag("") : () => filterByTag("preorder")}>
            preorder
          </span>
        </div>
      )}
      <p> ({gamesByFilter.length}) Games</p>
      {games.length > 0 &&
        (loading ? <div className="loader"></div> : <ScrollableList list={gamesByFilter} />)}
      {games.length > 0 &&
        (!gridView ? (
          <span onClick={() => setGridView(!gridView)}>
            <MdOutlineGridView size={30} />
          </span>
        ) : (
          <span onClick={() => setGridView(!gridView)}>
            <MdOutlineViewList size={30} />
          </span>
        ))}
      <div className={gridView ? "grid" : "list"}>
        {gamesByFilter.map((game, i) => (
         <div key={i} className="game-container">
            <div className="img-container">
              <img
                src={
                  game.thumbnail
                }
                alt=""
              />
            </div>

            <h3>{getDecodedString(game.title)}</h3>
            <p>
              {game.yearpublished}
            </p>
            <p>Plays:{game.numPlays}</p>
            {game.comment && <p>comment:{getDecodedString(game.comment)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
