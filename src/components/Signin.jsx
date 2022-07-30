import {auth} from "../firebase/config"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import  toast from "react-hot-toast"



export default function Signin() {
    const handleSignIn = async()=>{
        const provider = new GoogleAuthProvider()
        toast.promise(signInWithPopup(auth, provider),
        {
          loading:"loading....",
          success:({user})=>`welcome ${user.displayName}`,
          error:"cannot sign in"
        } )
        
        // .then(results =>{
        //     const user = results.user
        //     toast.promise
        // })
        // .catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // The email of the user's account used.
        //     const email = error.customData.email;
        //     // The AuthCredential type that was used.
        //     const credential = GoogleAuthProvider.credentialFromError(error);
        //     // ...
        //   })
    }
  return (
    <a onClick={handleSignIn}>Sign in</a>
  )
}
