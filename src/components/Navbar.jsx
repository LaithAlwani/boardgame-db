import {Link, useLocation} from "react-router-dom";

export default function Navbar() {
  const location = useLocation()
  const path = location.pathname.split("/")[1]
  console.log(path)
  return (
    <nav>
      <div className="nav-container">
        <div className="logo"><Link to="/">BGDB</Link> </div>
        <div className="nav-links">
          <Link to="/games">
            <a className={path === "games"? "active" : ""}>Games</a> 
            </Link>
          <Link to="/plays">
          <a className={path === "plays"? "active" : ""}>Plays</a> 
            
          </Link>
          <Link to="/signin">
          <a className={path === "signin"? "active" : ""}>Sign in</a> 

          </Link>
          <Link to="#">Sign Out</Link>
          
        </div>
      </div>
    </nav>
  );
}
