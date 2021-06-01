// Import dependencies
import React, { useState } from "react";
import "./App.css";
import Home from "./Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Video from "./Video";
import Upload from "./Upload";
import Cropper from "./Cropper";
import Draw from "./Draw";

function App() {
  const [image, setImage] = useState(null);
  const [coord, setCoord] = useState([150, 130, 340, 240]);
  const [result, setResult] = useState(null);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route exact path="/video">
          <Video
            image={image}
            setImage={setImage}
            coord={coord}
            setCoord={setCoord}
          />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/cropper">
          <Cropper image={image} coord={coord} setResult={setResult} />
        </Route>
        <Route path="/draw">
          <Draw result={result} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
