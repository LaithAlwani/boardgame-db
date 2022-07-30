import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import "./App.css";
import Layout from "./components/Layout";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";
import Plays from "./pages/Plays";
import Boardgames from "./pages/Boardgames";

function App() {
  return (
    <Router>
      <Layout>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="games" element={<Boardgames />} />
          <Route path="/plays" element={<Plays />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
