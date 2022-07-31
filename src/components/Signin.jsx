import { auth } from "../firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { GoSignIn } from "react-icons/go";

export default function Signin({ size }) {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    // toast.promise(,
    // {
    //   loading:"loading....",
    //   success:({user})=>`welcome ${user.displayName}`,
    //   error:"cannot sign in"
    // } )
    signInWithPopup(auth, provider)
      .then((results) => {
        const user = results.user;
        toast((t) => (
          <div className="signin-toast">
            <img src={user.photoURL} alt={user.displayName} className="avatar" />
            <span>Welcome {user.displayName}</span>
          </div>
        ));
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div onClick={handleSignIn} className="nav-icon">
      <GoSignIn size={size} color="white" />
      <span>Sign in</span>
    </div>
  );
}
