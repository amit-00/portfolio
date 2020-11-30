import GlobalStyle from './globalStyles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Navbar />
      <Home />
    </Router>
  );
}

export default App;
