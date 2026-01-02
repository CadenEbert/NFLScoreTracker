import ScoreList from "./ScoreList";
import './styles/Body.css';
import React from "react";



function Body() {
    return (
        <div className="body">
            
            <ScoreList />
            {/* Body content can be added here if needed */}
        </div>
    );
}
export default Body;