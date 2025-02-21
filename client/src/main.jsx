import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Route,Routes,BrowserRouter} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Login from './Components/login/Login.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
    <Routes>
    <Route path="login" element={<Login />} />
   
    </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
