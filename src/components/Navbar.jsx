import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import Signin from "./Signin";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GiMeeple } from "react-icons/gi";
import { GiNotebook } from "react-icons/gi";
import { GoSignOut } from "react-icons/go";
import { GoSignIn } from "react-icons/go";
import { MdSettings } from "react-icons/md";
import { UserContext } from "../lib/context";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-container">
        <NavLink to="/">
          <div className="nav-logo ">
            <img src="/dice.png" alt="" className="logo" />
            <span>Boardgame Tools</span>
          </div>
        </NavLink>

        <div className="nav-links">
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}

const NavLinks = () => {
  const { user, username, userAvatar, loading } = useContext(UserContext);
  const size = 25;
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
      {loading ? (
        <div className="loader"></div>
      ) : (
        user &&
        username &&
        userAvatar && (
          <NavLink to="/profile">
            <div className="nav-icon">
              <img src={userAvatar} alt={username} className="avatar" />
              <span>{username}</span>
            </div>
          </NavLink>
        )
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
        <NavLink to="/signin" className="nav-icon">
          <GoSignIn size={size} />
          <span>Sign in</span>
        </NavLink>
      )}
    </>
  );
};
