import './App.css';
import 'flowbite';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/Header'
import { Home } from './pages/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <div className='App font-sans bg-gray-100'>
        <Header/>
        <div className="h-screen max-w-screen-xl mx-auto bg-gray-100">
          <Switch>
              <Route path="/" component={Home}/>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
