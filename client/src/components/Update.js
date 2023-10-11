import React, { useState, useEffect } from 'react';
import './Technicians.css';
import './Update.css';
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

function UpdateTechnicians() {
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnicians, setSelectedTechnicians] = useState([]);
    const [newStatus, setNewStatus] = useState('');
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

        fetchTechnicians();
        const intervalId = setInterval(fetchTechnicians, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const handleCheckboxChange = (name, isChecked) => {
        if (isChecked) {
            setSelectedTechnicians(prevSelected => [...prevSelected, name]);
        } else {
            setSelectedTechnicians(prevSelected => prevSelected.filter(techName => techName !== name));
        }
    };
    const handleUpdate = async () => {
        if (newStatus === '' || selectedTechnicians.length === 0) {
            console.error('Please enter a status and select at least one technician.');
            return;
        }
        const updateData = {
            technicians: selectedTechnicians.map(name => ({ name, status: newStatus }))
        };
        try {
            const response = await fetch(`/api/update_technicians?apikey=${process.env.REACT_APP_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            const data = await response.text();
            console.log(data);

            // Fetch technicians once the update is successful
            const responseTechs = await fetch(`/api/technicians?apikey=${process.env.REACT_APP_API_KEY}`);
            const techsData = await responseTechs.json();
            setTechnicians(techsData);

            // Clear the selected technicians and the new status
            setSelectedTechnicians([]);
            setNewStatus('');

        } catch (error) {
            console.error('Error updating technicians:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();  // Prevents the default form submission behavior
        handleUpdate();
    };
    
    return (
        <div className="Technicians">
            <header className="header">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="title">Update Status</h1>
            </header>
            {loading ? (
                <div className="loading-container">
                    <img src={cat_loading} alt="Loading..." />
                </div>
            ) : (
                <table className="technicians-table">
                <thead>
                <tr>
                <th></th>
                <th>Name</th>
                <th>Status</th>
                <th>Updated</th>
                </tr>
                </thead>
                <tbody>
                {technicians.map((technician) => (
                    <tr key={technician.name}>
                    <td>
                        <input type="checkbox"
                        className="technician_checkbox"
                        checked={selectedTechnicians.includes(technician.name)}
                        onChange={(e) => handleCheckboxChange(technician.name, e.target.checked)} 
                        />
                    </td>
                    <td>{technician.name}</td>
                    <td>{technician.status}</td>
                    <td>{formatTime(technician.time)}</td>
                    </tr>
                ))}
                </tbody>
                </table>
            )}
            <div className="update_technicians">
                <form onSubmit={handleFormSubmit}>
                    <input 
                        type="text" 
                        placeholder="New Status" 
                        className="technician_status"
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="update_button"
                    >Update
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateTechnicians;

