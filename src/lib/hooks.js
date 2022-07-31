import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { getDoc, doc, onSnapshot, increment, serverTimestamp } from "firebase/firestore";


export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(userRef, (docRef) => {
          setUsername(docRef.data()?.username);
          setUserAvatar(docRef.data()?.avatar);
          setLoading(false);
        });
      } else {
        setUser(null);
        setUsername(null);
        setLoading(false);
      }
      return unsubscribe;
    });
  }, [user]);
  return { user, username, userAvatar, loading };
};