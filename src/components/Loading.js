import React from 'react';

function Loading({ show }) {
  return (
    <div id="loading" className={show ? 'show' : ''}>
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;

