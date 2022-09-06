import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import handleGlobalUnload from './unload'

window.onunload = handleGlobalUnload

localStorage.setItem('game_color', 'black')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
    
);


