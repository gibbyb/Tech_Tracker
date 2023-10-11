import React, { useState, useEffect } from 'react';
import './Technicians.css';  // Using existing CSS
import './History.css'; 
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

function History() {
    const [history, setHistory] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/history?page=${currentPage}&apikey=${process.env.REACT_APP_API_KEY}`);
                const data = await response.json();
                setHistory(data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="Technicians">
            <header className="header">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="title">Tech Tracker History</h1>
            </header>
            {loading ? (
                <div className="loading-container">
                    <img src={cat_loading} alt="Loading..." />
                </div>
            ) : (
                <>
                    <table className="technicians-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.data.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.name}</td>
                                    <td>{entry.status}</td>
                                    <td>{formatTime(entry.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => handlePageChange(1)}
                        >Page 1
                        </button>

                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => handlePageChange(currentPage - 1)}
                        >Previous
                        </button>
                        <button>{currentPage}</button>
                        <button 
                            disabled={currentPage === history.meta.total_pages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >Next
                        </button>

                        <button 
                            disabled={currentPage === history.meta.total_pages}
                            onClick={() => handlePageChange(history.meta.total_pages)}
                        >Page {history.meta.total_pages}
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}

export default History;
// &lt; is the HTML entity for < and &gt; is the HTML entity for >.
