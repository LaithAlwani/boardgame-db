import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import Signin from "./Signin";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
          <NavLink to="/">BGDB</NavLink>
        </div>
        <div className="nav-links">
          <NavLinks user={user} />
        </div>
        <span id="burger-icon-container" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "burger-icon open" : "burger-icon"}></span>
        </span>
      </div>
      
        <div className={isOpen? "nav-mobile open":"nav-mobile"} onClick={() => setIsOpen(!isOpen)}>
          <NavLinks user={user} />
        </div>
     
    </nav>
  );
}

const NavLinks = ({ user }) => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    // signOut(auth).then(toast.success("Successfully Signed Out")
    // .catch(err=>toast.error(err.message)))
    toast.promise(
      signOut(auth),
      {
        loading: "Signing Out...",
        success: "Successfully Singed Out",
        error: "Could not sign out",
      },
      {
        success: navigate("/"),
      }
    );
  };
  return (
    <>
      <NavLink to="/games">Games</NavLink>
      <NavLink to="/plays">Plays</NavLink>
      {!user && <Signin />}
      {user && (
        <>
          <NavLink to="/profile" className="avatar">
            <img src={user.photoURL} alt={user.displayName} />
          </NavLink>
          <a onClick={handleSignOut}>Sign Out</a>
        </>
      )}
    </>
  );
};
