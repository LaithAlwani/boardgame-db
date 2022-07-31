import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Layout from "./components/Layout";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";
import Plays from "./pages/Plays";
import Boardgames from "./pages/Boardgames";
import Settings from "./pages/Settings";
import Signin from "./components/Signin";
import { UserContext } from "./lib/context";
import { useUserData } from "./lib/hooks";

function App() {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Router>
      <div className="App">
        <Layout>
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="games" element={<Boardgames />} />
            <Route path="/plays" element={<Plays />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
          </Layout>
          </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
