import GlobalStyle from './globalStyles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <GlobalStyle />
        <Navbar />
        <Home />
      </div>
    </Router>
  );
}

export default App;
