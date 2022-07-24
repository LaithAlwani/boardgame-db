import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import Signin from "./Signin";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let subscirbe;
    subscirbe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return subscirbe;
  }, [user]);

  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <Link to="/">BGDB</Link>
        </div>
        <div className="nav-links">
          <NavLinks user={user} />
        </div>
        <button id="burger-icon-container" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "burger-icon open" : "burger-icon"}></span>
        </button>
      </div>
      {isOpen && (
        <div id="nav-mobile" onClick={() => setIsOpen(!isOpen)}>
          <NavLinks user={user} />
        </div>
      )}
    </nav>
  );
}

const NavLinks = ({ user }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const handleSignOut = () => {
    signOut(auth)
      .then(console.log)
      .catch((err) => console.log);
  };
  return (
    <>
      <Link to="/games">
        <a className={path === "games" ? "active" : ""}>Games</a>
      </Link>
      <Link to="/plays">
        <a className={path === "plays" ? "active" : ""}>Plays</a>
      </Link>
      {!user && <Signin />}
      {user && (
        <>
          <Link to="/profile">
            <a className="avatar">
              <img src={user.photoURL} alt={user.displayName}  />
            </a>
          </Link>
          <a onClick={handleSignOut}>Sign Out</a>
        </>
      )}
    </>
  );
};
