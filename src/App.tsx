import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Search from "./pages/Search";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/search/:name' element={<Search/>}/>
            </Routes>
        </Router>
    )
}

export default App
