import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";
import Plays from "./pages/Plays";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="games" element={<UserProfile />} />
          <Route path="/plays" element={<Plays />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
