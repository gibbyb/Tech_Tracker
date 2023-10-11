import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import home_icon from '../img/home_icon.png';
import history_icon from '../img/history_icon.png';
import update_icon from '../img/update_icon.png';

function Sidebar(props) {
    const { isOpen, toggle } = props;

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <ul>
                <li><Link to="/" onClick={toggle}><img src={home_icon} alt="Home"/></Link></li>
                <li><Link to="/history" onClick={toggle}><img src={history_icon} alt="History"/></Link></li>
                <li><Link to="/update" onClick={toggle}><img src={update_icon} alt="Update"/></Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;

