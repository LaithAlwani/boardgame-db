import { auth, db } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { UserContext } from "../lib/context";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { getDoc, doc, writeBatch, increment, serverTimestamp } from "firebase/firestore";

export default function Signin() {
  const { user, username, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    //take user back to last page prior to login
    if (user && username) navigate(-1);
  }, [user, username, navigate]);

  return (
    <>
      {loading ? (
        <div className="loader"></div>
      ) : user ? (
        !username && <UserNameForm />
      ) : (
        <SigninFrom />
      )}
    </>
  );
}

const SigninFrom = () => {
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((results) => {
        const user = results.user;
        getDoc(doc(db, "users", user.uid))
          .then((userDoc) => {
            if (userDoc.data()) {
              toast((t) => (
                <div className="signin-toast">
                  <img
                    src={userDoc.data().avatar}
                    alt={userDoc.data().username}
                    className="avatar"
                  />
                  <span>Welcome {userDoc.data().username}</span>
                </div>
              ));
            }
          })
          .catch((err) => {
            toast.error(err.message);
          });
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
    <div className="signin">
      <h3>Login with social media</h3>
      <div className="social-sigin">
        <FaTwitter size={50} color="gray" /> {/*orginal color #1DA1F2*/ }
        <FcGoogle size={50} onClick={loginWithGoogle} />
        <FaApple size={50} color="gray" />
      </div>
      <span>only google login works</span>
    </div>
  );
};

const UserNameForm = () => {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const intialImage = auth.currentUser.photoURL;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { user, username } = useContext(UserContext);

  const handleChange = (e) => {
    const val = e.target.value;
    const re = /^.{3,25}$/;
    if (val.length < 3 || val.length > 20) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };
  //functions is calling on every formValue change debounce is not working
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3 && username.length <= 50) {
        const usernameRef = doc(db, "usernames", username.trim());
        try {
          const userDoc = await getDoc(usernameRef);
          if (!userDoc.exists()) setIsValid(true);
          setLoading(false);
        } catch (e) {
          console.log("doc not found");
        }
      }
    }, 500),
    []
  );

  const saveNewUser = async (newUser) => {
    const usernameDoc = doc(db, "usernames", formValue);
    const userDoc = doc(db, "users", user.uid);
    const batch = writeBatch(db);
    batch.set(userDoc, newUser);
    batch.set(usernameDoc, { uid: user.uid });
    batch.set(doc(db, "site-stats", "main"), { users: increment(1) }, { merge: true });
    try {
      await batch.commit();
      toast.success(`Welcome ${formValue}`);
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      avatar: intialImage,
      username: formValue,
      displayName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastlogin: serverTimestamp(),
    };

    setUploading(true);
    if (file) {
      uploadImageToStorage(file, "user-images", auth.currentUser.uid)
        .then((url) => {
          const tempUser = { ...newUser, avatar: url };
          saveNewUser(tempUser);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      saveNewUser(newUser);
    }
  };

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);
  return (
    !username && (
      <section>
        <h3>Choose a display name</h3>
        <form onSubmit={handleSubmit} className="usernameForm">
          <img src={intialImage} alt="" style={{ width: "64px" }} />
          {/* {!preview && <ImageCropper setFile={setFile} aspect={1} />}
          {preview &&
            <>
            <img src={preview} alt="" style={{ width: "64px" }} />
            <button onClick={() => {
              setFile(null)
              setPreview(null)
            }}>Delete</button>
            </>
          } */}
          <input
            type="text"
            name="username"
            placeholder="choose a username"
            value={formValue}
            onChange={handleChange}
            autoComplete="off"
          />
          <button type="submit" disabled={!isValid}>
            choose
          </button>
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          {loading && <div className="loader"></div>}
          {uploading && <h3>{progress}%</h3>}
          {}
        </form>
        <p>
          Your display name is what other users can see while using the application and is unquie to
          your account
        </p>
      </section>
    )
  );
};

function UsernameMessage({ username, isValid, loading }) {
  if (username.length > 0 && username.length < 3) {
    return <p style={{ color: "red" }}>username must be more the 3 characters</p>;
  } else if (username.length > 0 && username.length > 50) {
    return <p style={{ color: "red" }}>username must be 50 characters or less</p>;
  } else if (loading) {
    return <p>checking</p>;
  } else if (username && isValid) {
    return <p style={{ color: "green" }}> "{username}" is available </p>;
  } else if (username && !isValid) {
    return <p style={{ color: "red" }}>"{username}" is not available</p>;
  } else {
    return <p></p>;
  }
}
