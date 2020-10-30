import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Home/Home';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="shift">
          <div className="container-fluid">
            <Home />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </div>
      </div>
    </div>
  );
}

export default App;
