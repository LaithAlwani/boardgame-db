export default function ScrollableList({ list }) {
  return (
    <div>
      {list && (
        <div className="scroll-list">
          {list.map((game) => (
            <div className="img-container" key={game.attributes.objectid}>
              <img
                src={
                  game.children[1].name === "originalname"
                    ? game.children[4].value
                    : game.children[3].value
                }
                alt="game name"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
