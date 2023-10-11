import React, { useState, useEffect } from 'react';
import './Technicians.css';
import logo from '../img/logo.png';
import cat_loading from '../img/cat_loading.gif';

const formatTime = (timestamp) => {
    const date = new Date(timestamp);

    const hourOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const time = date.toLocaleTimeString('en-US', hourOptions);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${time} - ${month} ${day}`;
};

function Technicians() {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                // Make an API call to retrieve technician data from the server
                const response = await fetch(`/api/technicians?apikey=${process.env.REACT_APP_API_KEY}`);
                const data = await response.json();

                // Update the technicians state with the fetched data
                setTechnicians(data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching technicians:', error);
            }
        };

        fetchTechnicians(); // Fetch technicians every 10 seconds
        const intervalId = setInterval(fetchTechnicians, 10000); 

        return () => clearInterval(intervalId); // Cleanup function
    }, []);

    return (
        <div className="Technicians">
            <header className="header">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="title">Tech Tracker</h1>
            </header>
            {loading ? (
                <div className="loading-container">
                    <img src={cat_loading} alt="Loading..." />
                </div>
            ) : (
                <table className="technicians-table">
                <thead>
                <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Updated</th>
                </tr>
                </thead>
                <tbody>
                {technicians.map((technician) => (
                    <tr key={technician.name}>
                    <td>{technician.name}</td>
                    <td>{technician.status}</td>
                    <td>{formatTime(technician.time)}</td>
                    </tr>
                ))}
                </tbody>
                </table>
            )}
        </div>
    );
}

export default Technicians;

