import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Technicians from './components/Technicians';
import History from './components/History';
import Update from './components/Update';
import sidebar_button from './img/sidebar_button.png';
import './App.css'; 

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Router>
            <div className="App">
                <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
                <div className={`content ${sidebarOpen ? 'slide' : ''}`}>
                    <button className="sidebar-toggle-button" onClick={toggleSidebar}>
                        <img src={sidebar_button} alt="Toggle Sidebar" />
                    </button>
                    <Routes>
                        <Route path="/" exact element={<Technicians />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/update" element={<Update />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;


