import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Nav from './component/Navigation';
import GenerateMeme from './component/GenerateMeme'
import Home from './component/Home'

function App() {
  return (
    <Router>
      <div className="main">
        <Nav />
        <div className="content">
          <Route exact path="/" render={(props) => (<Home {...props} isAuthed={true} />)} />
          <Route exact path="/generateMeme" render={(props) => (<GenerateMeme {...props} isAuthed={true} />)} />
        </div>
      </div>
    </Router>
  );
}
export default App;