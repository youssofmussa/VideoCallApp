// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VideoCall from "./components/VideoCall";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<VideoCall />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
