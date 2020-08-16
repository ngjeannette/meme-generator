import React from 'react';
import '../App.scss';
import { Link } from "react-router-dom";

function Nav() {
    return (
        <>
            <nav >
                <div className="navbar-start">
                    <a className="navbar-item" target="_blank" rel="noopener noreferrer" href="https://flaviocopes.com/sample-app-ideas/">Project 10</a>
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/generateMeme" className="navbar-item">Generate Meme</Link>
                </div>
            </nav>
        </>
    )
}
export default Nav;