import React from 'react';

function Logo() {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="logo" onClick={handleLogoClick}>
      <div className="logo-text">
        <span style={{'--i': 1}} className="letter r-container">
          R<span className="chef-hat"><i className="fas fa-hat-chef"></i></span>
        </span>
        <span style={{'--i': 2}} className="letter">e</span>
        <span style={{'--i': 3}} className="letter">c</span>
        <span style={{'--i': 4}} className="letter highlight">!</span>
        <span style={{'--i': 5}} className="letter tight-right">P</span>
        <span style={{'--i': 6}} className="letter spoon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100" height="100">
            <g className="wiggle">
              <ellipse cx="32" cy="20" rx="12" ry="14" fill="#e0e0e0"/>
              <rect x="30" y="26" width="4" height="28" rx="2" fill="#e0e0e0"/>
            </g>
          </svg>
        </span>
        <span style={{'--i': 7}} className="letter tight-left">c</span>
        <span style={{'--i': 8}} className="letter">k</span>
      </div>
      <div className="plate"></div>
      <div className="steam steam-1"></div>
      <div className="steam steam-2"></div>
      <div className="steam steam-3"></div>
      <div className="glow"></div>
    </div>
  );
}

export default Logo;

