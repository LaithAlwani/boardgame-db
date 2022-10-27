import { useState } from "react";
import { XMLParser } from "fast-xml-parser";
import { MdOutlineViewList } from "react-icons/md";
import { MdOutlineGridView } from "react-icons/md";
import { toast } from "react-hot-toast";
import ScrollableList from "../components/ScrollableList";
import { useEffect } from "react";

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [games, setGames] = useState([]);
  const [gamesByFilter, setGamesByFilter] = useState([]);
  const [gridView, setGridView] = useState(true);
  const [loading, setLoading] = useState(false);
  const collectionURL = `collection?username=Laitho`;
  const thingURL = `thing?id=`;


  const options = {
    ignoreAttributes: false,
  };

  const importGames = () => {
    if (!username) {
      setLoading(true);
      fetch(`https://boardgamegeek.com/xmlapi2/${collectionURL}`, {
        crossDomain: true,
      })
        .then((res) => res.text())
        .then((data) => {
          const parser = new XMLParser(options);
          const { items } = parser.parse(data);
          setGames([]);
          const tempGames = [];
          items.item.forEach((game) => {
            const tempgame = {};
            tempgame.bggId = game["@_objectid"];
            game.originalname
              ? (tempgame.title = game.originalname.toString())
              : (tempgame.title = game.name["#text"].toString());
            tempgame.numPlays = game.numplays;
            tempgame.image = game.image;
            tempgame.thumbnail = game.thumbnail;

            tempgame.status = {
              own: game.status["@_own"] === "1" ? true : false,
              prevowned: game.status["@_prevowned"] === "1" ? true : false,
              preordered: game.status["@_preordered"] === "1" ? true : false,
              wishlist:
                game.status["@_want"] === "1" ||
                game.status["@_wanttobuy"] === "1" ||
                game.status["@_wishlist"] === "1"
                  ? true
                  : false,
              play: game.status["@_wanttoplay"] === "1" ? true : false,
              trade: game.status["@_fortrade"] === "1" ? true : false,
            };
            tempgame.comment = game.comment;
            tempGames.push(tempgame);
          });
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
      setGamesByFilter(games.filter((game) => game.status.own));
    } else if (value === "play") {
      setGamesByFilter(games.filter((game) => game.status.play));
    } else if (value === "prevowned") {
      setGamesByFilter(games.filter((game) => game.status.prevowned));
    } else if (value === "trade") {
      setGamesByFilter(games.filter((game) => game.status.trade));
    } else if (value === "preordered") {
      setGamesByFilter(games.filter((game) => game.status.preordered));
    } else if (value === "wishlist") {
      setGamesByFilter(games.filter((game) => game.status.wishlist));
    } else {
      setGamesByFilter(games);
    }
  };

  useEffect(() => {
    importGames()
  },[])

  return (
    <div>
      {/* <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="BGG username"
        className="bgg-username-input"
      />
      <button onClick={handleClick}>import</button> */}

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
            className={tag === "play" ? "tag blue checked" : "tag blue"}
            onClick={tag === "play" ? () => filterByTag("") : () => filterByTag("play")}>
            play
          </span>
          <span
            className={tag === "wishlist" ? "tag pink checked" : "tag pink"}
            onClick={tag === "wishlist" ? () => filterByTag("") : () => filterByTag("wishlist")}>
            Wishlist
          </span>
          <span
            className={tag === "trade" ? "tag red checked" : "tag red"}
            onClick={tag === "trade" ? () => filterByTag("") : () => filterByTag("trade")}>
            Trade
          </span>
          <span
            className={tag === "preordered" ? "tag brown checked" : "tag brown"}
            onClick={tag === "preordered" ? () => filterByTag("") : () => filterByTag("preordered")}>
            preorder
          </span>
        </div>
      )}
      <p> ({gamesByFilter.length}) Games</p>
      
      {games.length > 0 &&
        (loading ? <div className="loader"></div> : <ScrollableList list={gamesByFilter} />)}
      
      {games.length > 0 &&
        (!gridView ? (
          <span className="grid-list-icon" onClick={() => setGridView(!gridView)}>
            <MdOutlineGridView size={30} />
          </span>
        ) : (
          <span className="grid-list-icon" onClick={() => setGridView(!gridView)}>
            <MdOutlineViewList size={30} />
          </span>
        ))}
      <div className={gridView ? "grid" : "list"}>
        {gamesByFilter.map((game, i) => (
          <div key={i} className="game-container">
            <div className="img-container">
              <img src={game.thumbnail} alt="" />
            </div>

            <h3>{getDecodedString(game.title)}</h3>
            <p>{game.yearpublished}</p>
            {/* <p>Plays:{game.numPlays}</p> */}
            {game.comment && <p>comment:{getDecodedString(game.comment)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
