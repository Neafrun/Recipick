import React, { useState } from 'react';

function RecipeResult({ recipeName, mode, content, onModeChange, onSave, naverBlogs, recipeSource, blogPage, setBlogPage }) {
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(true);
  const [isBlogExpanded, setIsBlogExpanded] = useState(true); // 초기에 펼쳐져 있음

  const BLOGS_PER_PAGE = 3;

  // HTML 태그 제거 함수
  const removeHtmlTags = (text) => {
    return text.replace(/<[^>]*>/g, '');
  };

  // AI 레시피 포맷팅 함수
  const formatRecipeContent = (text) => {
    if (!text) return '';
    
    let formatted = text;
    
    // [섹션 제목] → <h4>섹션 제목</h4> (굵고 크게)
    formatted = formatted.replace(/\[(.*?)\]/g, '<h4 class="recipe-section-title">$1</h4>');
    
    // "- 있으면 좋은 재료:" → 특별 스타일 (초록색으로 강조)
    formatted = formatted.replace(/^- (있으면 좋은 재료:)/gm, '<strong class="recipe-optional-label">$1</strong>');
    
    // "- 항목:" → <strong>항목:</strong> (굵게)
    formatted = formatted.replace(/^- (.*?:)/gm, '<strong class="recipe-item-label">$1</strong>');
    
    // 숫자 리스트 "1." → 굵게
    formatted = formatted.replace(/^(\d+\.)/gm, '<strong class="recipe-step-number">$1</strong>');
    
    // 줄바꿈 처리
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  };

  // 출처에 따라 블로그 문구 변경
  const getBlogMessage = () => {
    if (recipeSource === 'popular') {
      return {
        title: '🔥 현재 핫한 레시피 블로그',
        subtitle: '지금 가장 인기있는 레시피 블로그 글을 추천드릴게요!'
      };
    } else {
      return {
        title: '📝 다른 분들의 레시피도 궁금하신가요?',
        subtitle: 'AI 대신 실제 요리 경험담을 담은 블로그를 확인해보세요!'
      };
    }
  };

  const blogMessage = getBlogMessage();

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <h4>{recipeName}</h4>
        <div className="recipe-detail-actions">
          {mode && (
            <button 
              className="icon-btn" 
              onClick={() => onSave(recipeName)} 
              title="레시피 저장"
            >
              <i className="fas fa-bookmark"></i>
            </button>
          )}
        </div>
      </div>
      
      {content && (
        <div className="naver-blogs-section">
          <div 
            className="blog-section-header clickable"
            onClick={() => setIsRecipeExpanded(!isRecipeExpanded)}
          >
            <div className="blog-header-content">
              <h4>🤖 AI 레시피</h4>
            </div>
            <span className="collapse-icon">{isRecipeExpanded ? '−' : '+'}</span>
          </div>
          {isRecipeExpanded && (
            <div className="recipe-content" dangerouslySetInnerHTML={{ __html: formatRecipeContent(content) }}></div>
          )}
        </div>
      )}
      
      {naverBlogs && naverBlogs.length > 0 && (
        <div className="naver-blogs-section">
          <div 
            className="blog-section-header clickable"
            onClick={() => setIsBlogExpanded(!isBlogExpanded)}
          >
            <div className="blog-header-content">
              <h4>{blogMessage.title}</h4>
              <p className="blog-subtitle">{blogMessage.subtitle}</p>
            </div>
            <span className="collapse-icon">{isBlogExpanded ? '−' : '+'}</span>
          </div>
          {isBlogExpanded && (
            <>
              <div className="naver-blogs-list">
                {naverBlogs.slice(blogPage * BLOGS_PER_PAGE, (blogPage + 1) * BLOGS_PER_PAGE).map((blog, index) => (
                  <a 
                    key={index}
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="naver-blog-item"
                  >
                    <div className="blog-title">{removeHtmlTags(blog.title)}</div>
                    <div className="blog-description">{removeHtmlTags(blog.description)}</div>
                    <div className="blog-info">
                      <span className="blog-blogger">{blog.bloggername}</span>
                      <span className="blog-date">{blog.postdate}</span>
                    </div>
                  </a>
                ))}
              </div>
              {naverBlogs.length > BLOGS_PER_PAGE && (
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={() => setBlogPage(Math.max(0, blogPage - 1))}
                    disabled={blogPage === 0}
                  >
                    ◀ 이전
                  </button>
                  <span className="pagination-info">
                    {blogPage + 1} / {Math.ceil(naverBlogs.length / BLOGS_PER_PAGE)}
                  </span>
                  <button 
                    className="pagination-btn"
                    onClick={() => setBlogPage(Math.min(Math.ceil(naverBlogs.length / BLOGS_PER_PAGE) - 1, blogPage + 1))}
                    disabled={(blogPage + 1) * BLOGS_PER_PAGE >= naverBlogs.length}
                  >
                    다음 ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeResult;

