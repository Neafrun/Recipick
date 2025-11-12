import React from 'react';

function CreatorModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h3>Recipick 개발팀</h3>
        <p>냉장고 속 재료로 무엇을 만들지 고민될 때, Recipick이 도와드릴게요!</p>
      </div>
    </div>
  );
}

export default CreatorModal;

