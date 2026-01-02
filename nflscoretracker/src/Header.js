import React from 'react';
import './styles/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header">
            <div className="brand">
                <h1>NFL Score Tracker</h1>
            </div>
            <nav className="nav">
                <Link className="nav-link" to="/scorigami">Scorigami</Link>
                <Link className="nav-link" to="/">Scores</Link>
                
                
                
            </nav>
        </header>
    );
}

export default Header;