import React from 'react';

function CreatorModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h3>밥프렌즈</h3>
        <div className="company-description">
          <p className="main-text"><strong>Recipick</strong></p>
          <p className="sub-text">
            냉장고 속 재료로 만들 수 있는 요리를 AI가 추천해드립니다.
          </p>
          <p className="sub-text">
            실시간 인기요리 랭킹, 블로그 레시피, 유튜브 영상까지 한번에 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreatorModal;

