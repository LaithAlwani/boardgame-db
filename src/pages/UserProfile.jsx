import { useState } from "react";
import XMLParser from "react-xml-parser";
import { MdOutlineViewList } from "react-icons/md";
import { MdOutlineGridView } from "react-icons/md";
import { toast } from "react-hot-toast"
import ScrollableList from "../components/ScrollableList";

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const [tag, setTag] = useState("");
  const [games, setGames] = useState([]);
  const [gamesByFilter, setGamesByFilter] = useState([]);
  const [gridView, setGridView] = useState(true);
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
        setGamesByFilter(xml.children);
        setUsername("");
      })
      .catch((err) => console.log);
  };

  const getDecodedString = (str) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
};

  const filterByTag = (value) => {
    setTag(value);
    if (value === "own") {
      setGamesByFilter(
        games.filter((game) => game.children[4].attributes.own !== "0")
      );
    } else if (value === "wanttoplay") {
      setGamesByFilter(
        games.filter((game) => game.children[4].attributes.wanttoplay !== "0")
      );
    } else if (value === "prevowned") {
      setGamesByFilter(
        games.filter((game) => game.children[4].attributes.prevowned !== "0")
      );
    } else if (value === "fortrade") {
      setGamesByFilter(
        games.filter((game) => game.children[4].attributes.fortrade !== "0")
      );
    } else if (value === "preorder") {
      setGamesByFilter(
        games.filter((game) => game.children[4].attributes.preordered !== "0")
      );
    } else if (value === "wishlist") {
      setGamesByFilter(
        games.filter(
          (game) =>
            game.children[4].attributes.want !== "0" ||
            game.children[4].attributes.wanttobuy !== "0" ||
            game.children[4].attributes.wishlist !== "0"
        )
      );
    } else {
      setGamesByFilter(games);
    }
  };

  return (
    <div >
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleClick}>import BGG</button>
      {games.length > 0 && (
        <div className="filters">
          <span
            className={tag === "own" ? "tag green checked" : "tag green"}
            onClick={
              tag === "own" ? () => filterByTag("") : () => filterByTag("own")
            }
          >
            Own
          </span>
          <span
            className={
              tag === "prevowned" ? "tag yellow checked" : "tag yellow"
            }
            onClick={
              tag === "prevowned"
                ? () => filterByTag("")
                : () => filterByTag("prevowned")
            }
          >
            prev
          </span>
          <span
            className={tag === "wanttoplay" ? "tag blue checked" : "tag blue"}
            onClick={
              tag === "wanttoplay"
                ? () => filterByTag("")
                : () => filterByTag("wanttoplay")
            }
          >
            play
          </span>
          <span
            className={tag === "wishlist" ? "tag pink checked" : "tag pink"}
            onClick={
              tag === "wishlist"
                ? () => filterByTag("")
                : () => filterByTag("wishlist")
            }
          >
            Wishlist
          </span>
          <span
            className={tag === "fortrade" ? "tag red checked" : "tag red"}
            onClick={
              tag === "fortrade"
                ? () => filterByTag("")
                : () => filterByTag("fortrade")
            }
          >
            Trade
          </span>
          <span
            className={tag === "preorder" ? "tag brown checked" : "tag brown"}
            onClick={
              tag === "preorder"
                ? () => filterByTag("")
                : () => filterByTag("preorder")
            }
          >
            preorder
          </span>
        </div>
      )}
      <p> ({gamesByFilter.length}) Games</p>
      <ScrollableList list={gamesByFilter} />
      {games.length > 0 && (!gridView ? 
        
          <span onClick={() => setGridView(!gridView)}>
            <MdOutlineGridView  size={30} />
          </span>:
          <span onClick={() => setGridView(!gridView)}>
            <MdOutlineViewList size={30} />
          </span>)
        
      }
      <div className={gridView ? "grid" : "list"}>
        {gamesByFilter.map((game) => (
          <div key={game.attributes.objectid} className="game-container">
            <div className="img-container">
              <img
                src={
                  game.children[1].name === "originalname"
                    ? game.children[4].value
                    : game.children[3].value
                }
                alt=""
              />
            </div>

            <h3>
              {getDecodedString(game.children[0].value)}
            </h3>
            {/* <p>
              {game.children[1].name === "originalname"
                ? game.children[2].value
                : game.children[1].value}
            </p> */}
            {/* <p>
              Plays:{" "}
              {game.children[1].name === "originalname"
                ? game.children[6].value
                : game.children[5].value}
            </p> */}
            {/* <div className="tags">
              {game.children[4].attributes.own === "1" && (
                <span className="tag green">own</span>
              )}
              {game.children[4].attributes.prevowned === "1" && (
                <span className="tag yellow">prev-owned</span>
              )}
              {game.children[4].attributes.wanttoplay === "1" && (
                <span className="tag blue">want to play</span>
              )}
              {(game.children[4].attributes.want === "1" ||
                game.children[4].attributes.wanttobuy === "1" ||
                game.children[4].attributes.wishlist === "1") && (
                <span className="tag pink">whishlist</span>
              )}
              {game.children[4].attributes.preordered === "1" && (
                <span className="tag brown">preorder</span>
              )}
              {game.children[4].attributes.fortrade === "1" && (
                <span className="tag red">for trade</span>
              )}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
