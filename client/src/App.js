import './App.css';
import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import Chats from './pages/Chats';

function App() {
  return (
    <div className="App">
<Route path='/' component={Home} exact/> 
<Route path='/chat' component={Chats} exact/>
    </div>
  );
}

export default App;
