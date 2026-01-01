import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="brand">
                <h1>NFL Score Tracker</h1>
            </div>
            <nav className="nav">
                
                <a className="nav-link" href="#scores">Scores</a>
                <a className="nav-link" href="#teams">Teams</a>
                
            </nav>
        </header>
    );
}

export default Header;