import React from 'react';

function CreatorModal({ onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h3>🍳 Recipick</h3>
        <div className="company-description">
          <p className="main-text"><strong>냉장고 속 재료로 요리 추천</strong></p>
          <p className="sub-text">
            AI 기반 레시피 추천 서비스
          </p>
          
          <div className="developer-info">
            <h4>👨‍💻 Developer</h4>
            <p className="developer-name">Neafrun</p>
            <div className="contact-links">
              <a href="mailto:shjw5392@naver.com" className="contact-link">
                <i className="fas fa-envelope"></i> shjw5392@naver.com
              </a>
              <a href="https://github.com/Neafrun" target="_blank" rel="noopener noreferrer" className="contact-link">
                <i className="fab fa-github"></i> GitHub
              </a>
            </div>
          </div>

          <div className="tech-stack">
            <h4>🛠 Tech Stack</h4>
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Gemini AI</span>
              <span className="tech-badge">Naver API</span>
              <span className="tech-badge">YouTube API</span>
            </div>
          </div>

          <div className="key-features">
            <h4>⭐ Key Features</h4>
            <ul className="features-list">
              <li>🤖 AI 기반 맞춤 레시피 추천</li>
              <li>🔥 실시간 인기 요리 TOP 5</li>
              <li>⌨️ 타이핑 효과로 자연스러운 UX</li>
              <li>💾 스마트 캐싱 시스템</li>
              <li>📝 블로그 레시피 & 유튜브 영상 연동</li>
            </ul>
          </div>

          <div className="project-info">
            <p className="project-date">📅 2024년 개발</p>
            <a href="https://github.com/Neafrun/Recipick" target="_blank" rel="noopener noreferrer" className="github-link">
              <i className="fab fa-github"></i> GitHub 저장소 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatorModal;

