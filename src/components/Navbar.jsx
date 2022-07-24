import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import Signin from "./Signin";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [user, setUser] = useState(auth.currentUser);

  const handleSignOut = () => {
    signOut(auth)
      .then(console.log)
      .catch((err) => console.log);
  };
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
          <Link to="/games">
            <a className={path === "games" ? "active" : ""}>Games</a>
          </Link>
          <Link to="/plays">
            <a className={path === "plays" ? "active" : ""}>Plays</a>
          </Link>
          {!user && <Signin />}
          {user && (
            <>
              <Link to="#">
                <a>{user.displayName.split(" ")[0]}</a>
              </Link>
              <a onClick={handleSignOut}>Sign Out</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
