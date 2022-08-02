export default function ScrollableList({ list }) {
  return (
    <div>
      {list && (
        <div className="scroll-list">
          {list.map((game, i) => (
            <div className="img-container" key={i}>
              <img
                src={
                   game.image
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
