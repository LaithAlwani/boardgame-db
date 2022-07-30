import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import Signin from "./Signin";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GiMeeple } from "react-icons/gi";
import { GiNotebook } from "react-icons/gi";
import { GoSignOut } from "react-icons/go";
import { MdSettings } from "react-icons/md";

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
        <NavLink to="/">
          <div className="nav-icon">
            <img src="/dice.png" alt="" className="logo" />
            <span>Boardgame Tools</span>
          </div>
        </NavLink>

        <div className="nav-links">
          <NavLinks user={user} />
        </div>
      </div>
    </nav>
  );
}

const NavLinks = ({ user }) => {
  const size = 30;
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
      {user && (
        <NavLink to="/profile" className="avatar">
          <div className="nav-icon">
            <img src={user.photoURL} alt={user.displayName} />
            <span>{user.displayName.split(" ")[0]}</span>
          </div>
        </NavLink>
      )}
      <NavLink to="/games">
        <div className="nav-icon">
          <GiMeeple size={size} />
          <span>Games</span>
        </div>
      </NavLink>
      <NavLink to="/plays">
        <div className="nav-icon">
          <GiNotebook size={size} />
          <span>Plays</span>
        </div>
      </NavLink>
      <NavLink to="/settings">
        <div className="nav-icon">
          <MdSettings size={size} />
          <span>Settings</span>
        </div>
      </NavLink>

      {user ? (
        <div className="nav-icon" onClick={handleSignOut}>
          <GoSignOut size={size} color={"white"} />
          <span>Sign Out</span>
        </div>
      ) : (
        <Signin size={size} />
      )}
    </>
  );
};
