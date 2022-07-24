import {auth} from "../firebase/config"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'



export default function Signin() {
    const handleSignIn = async()=>{
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
        .then(results =>{
            const user = results.user
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
          })
    }
  return (
    <a onClick={handleSignIn}>Sign in</a>
  )
}
