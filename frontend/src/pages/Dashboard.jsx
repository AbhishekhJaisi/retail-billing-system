import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <h1>Welcome, {user.name || 'User'}</h1>
                <p>Dashboard is under development</p>
                
                <div className="dashboard-placeholder">
                    <p>Content coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
