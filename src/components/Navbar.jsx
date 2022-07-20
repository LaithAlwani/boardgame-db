import {Link} from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        <div className="logo"><Link to="/">BGDB</Link> </div>
        <div className="nav-links">
          <Link to="/games">Games</Link>
          <Link to="/plays">Plays</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="#">Sign Out</Link>
          
        </div>
      </div>
    </nav>
  );
}
