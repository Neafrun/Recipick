// Recipick 전체 script.js 수정본 (캐싱 + 무한 캐러셀 적용)
// api 키 제거
// ============ 모달 ============
function toggleModal(id) {
  const modal = document.getElementById(id);
  if (modal.style.display === 'flex') {
    modal.style.opacity = 0;
    setTimeout(() => modal.style.display = 'none', 300);
  } else {
    modal.style.display = 'flex';
    setTimeout(() => modal.style.opacity = 1, 10);
  }
}

// ============ 로그인/회원가입 ============
function login() {
  const id = document.getElementById('username').value.trim();
  const pw = document.getElementById('password').value;
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (!id || !pw) return alert('아이디/비밀번호 입력!');
  if (!users[id] || users[id] !== pw) return alert('로그인 실패');
  currentUser = id;
  localStorage.setItem('loggedInUser', id);
  updateMenu();
  toggleModal('loginModal');
}

function signup() {
  const id = document.getElementById('signupUsername').value.trim();
  const pw = document.getElementById('signupPassword').value;
  const pw2 = document.getElementById('signupPasswordConfirm').value;
  if (!id || !pw || !pw2) return alert('모두 입력!');
  if (pw !== pw2) return alert('비밀번호 불일치!');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[id]) return alert('이미 존재하는 아이디!');
  users[id] = pw;
  localStorage.setItem('users', JSON.stringify(users));
  alert('회원가입 완료!');
  showLoginTab();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('loggedInUser');
  updateMenu();
}

function updateMenu() {
  const loginBtn = document.getElementById('loginMenu');
  const myBtn = document.getElementById('myRecipeBtn');
  loginBtn.innerHTML = currentUser
    ? `<i class="fas fa-sign-out-alt"></i> 로그아웃`
    : `<i class="fas fa-user"></i> 로그인`;
  myBtn.style.display = currentUser ? 'block' : 'none';
}

function showLoginTab() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginTabBtn").classList.add("active");
  document.getElementById("signupTabBtn").classList.remove("active");
}

function showSignupTab() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("signupTabBtn").classList.add("active");
  document.getElementById("loginTabBtn").classList.remove("active");
}

// ============ 추천 ============
async function recommendRecipe() {
  const ing = document.getElementById('ingredients').value.trim();
  const resultDiv = document.getElementById('result');
  const detailDiv = document.getElementById('recipeDetail');
  const videoDiv = document.getElementById('popularVideos');

  if (!ing) {
    resultDiv.innerHTML = '<p>재료를 입력해 주세요!</p>';
    return;
  }

  document.getElementById('popularSection').style.display = 'none';
  document.getElementById('popularTitle').style.display = 'none';

  showLoading(true);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENAI_KEY
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `입력한 재료만 사용해서 만들 수 있는 요리 3가지를 알려줘. 요리 이름만 나열해줘: ${ing}` }
      ],
      max_tokens: 100,
      temperature: 0.7
    })
  });

  const json = await res.json();
  const list = json.choices[0].message.content.split('\n').filter(v => v.trim());

  let html = '<h3>추천 요리 목록</h3><div class="recipe-button-list">';
  list.forEach(item => {
    const name = item.replace(/^\d+\.\s*/, '').trim();
    html += `<div class="recipe-item"><button class="recipe-btn-item" onclick="showRecipeStart('${name}')">${name}</button></div>`;
  });
  html += '</div>';

  resultDiv.innerHTML = html;
  detailDiv.innerHTML = '';
  videoDiv.innerHTML = '';
  showLoading(false);
}

function showRecipeStart(name) {
  const detailDiv = document.getElementById('recipeDetail');
  detailDiv.innerHTML = `
    <div class="recipe-detail">
      <div class="recipe-detail-header">
        <h4>${name}</h4>
        <div>
          <button class="recipe-btn" onclick="getRecipeContent('${name}', '재료')">재료 보기</button>
          <button class="recipe-btn" onclick="getRecipeContent('${name}', '레시피')">레시피 보기</button>
        </div>
      </div>
    </div>`;
}

function renderRecipe(name, mode, content) {
  const detailDiv = document.getElementById('recipeDetail');
  const opposite = mode === '재료' ? '레시피' : '재료';

  detailDiv.innerHTML = `
    <div class="recipe-detail">
      <div class="recipe-detail-header">
        <h4>${name} - ${mode}</h4>
        <div class="recipe-detail-actions">
          <button class="recipe-btn" onclick="getRecipeContent('${name}', '${opposite}')">${opposite} 보기</button>
          <button class="icon-btn" onclick="saveRecipe('${name}')" title="레시피 저장">
            <i class="fas fa-bookmark"></i>
          </button>
        </div>
      </div>
      <p>${content}</p>
    </div>`;
}

async function getRecipeContent(name, mode) {
  const detailDiv = document.getElementById('recipeDetail');
  const cacheKey = `cache_${name}_${mode}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    renderRecipe(name, mode, cached);
    if (mode === '레시피') loadYouTubeVideos(name);
    return;
  }

  detailDiv.innerHTML = '';
  showLoading(true);

  const prompt = (mode === '재료')
    ? `${name} 처음 요리를 하는 사람들도 쉽게 따라 할 수 있는 수준으로 레시피를 작성해줘 그리고 익힘의 정도나 써는 방법 재료의 양을 덧붙여줘 
    요리를 만들 때 들어가는 모든 재료를 '몇 인분 기준인지' 명확히 밝혀주고, 그리고 몇 인분인지 설명을 최상단에 배치해 줘 각 재료의 이름과 양(예: g, ml, 개 등 단위 포함)을 보기 좋게 줄바꿈 해서 알려줘. 
    그래프, 표는 쓰지 마 그리고 한국어로 작성해 주고 친절하게 작성해 줘 그리고 사람들이 모를 것 같은 전문용어나 단어는 설명해 주는 내용 덧붙여줘 
    그리고 "한 인분" "두 인분" 이런 식으로 작성하지 말고 1인분 이렇게 작성해 줘 그리고 상황에 맞는 이모티콘 넣어서 작성해 줘 
   그리고 진짜 사람들이 모를만한 정보만 추가적으로 출력해 줘 
   그리고 맞춤법 똑바로 지켜서 출력해 줘. 그리고 네가 명심해야 하는 건 레시피 보기에선 레시피만 깔끔하게 정리돼서 나오게 만들어줘야 해 
   그리고 많은 재료 입력해서 적합한 요리가 없어도 너가 알아서 요리를 창조해서 맛있게 만들어줘 재료를 많이 입력해서 없는 요리여도 너가 적합한 요리를 만들어줘 
   그리고 만약에 내가 입력한 재료가 아닌 재료를 출력해줄 거면 따로 입력하지 않은 재료 이렇게 출력을 해줄래 그리고 내가 입력한 재료랑 내가 입력하지 않은 재료 구분해서 작성해주라 
   그리고 사람들이 보면서 웃을 수 있게 Tmi를 넣어서 작성해줘`
    : `${name}의 조리법을 순서대로 알려줘 .`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENAI_KEY
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7
    })
  });

  const json = await res.json();
  const content = json.choices[0].message.content.replace(/\n/g, '<br>');
  localStorage.setItem(cacheKey, content);
  renderRecipe(name, mode, content);
  if (mode === '레시피') loadYouTubeVideos(name);
  showLoading(false);
}

function saveRecipe(name) {
  if (!currentUser) return alert('로그인해야 저장 가능합니다!');
  const key = `savedRecipes_${currentUser}`;
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  if (arr.includes(name)) return alert('이미 저장된 레시피입니다!');
  arr.push(name);
  localStorage.setItem(key, JSON.stringify(arr));
  alert('⭐ 저장되었습니다!');
}

function loadSavedList() {
  const listUl = document.getElementById('savedList');
  const noneTxt = document.getElementById('noSaved');
  listUl.innerHTML = '';
  if (!currentUser) return;
  const arr = JSON.parse(localStorage.getItem(`savedRecipes_${currentUser}`) || '[]');
  if (arr.length === 0) {
    noneTxt.style.display = 'block';
    return;
  }
  noneTxt.style.display = 'none';
  arr.forEach(n => {
    const li = document.createElement('li');
    li.innerHTML = `<span onclick="loadSavedRecipe('${n}')" style="cursor:pointer;color:#d25644">${n}</span>
      <button onclick="deleteSavedRecipe('${n}')" style="margin-left:10px;color:#888;font-size:14px;background:none;border:none;cursor:pointer;">❌</button>`;
    listUl.appendChild(li);
  });
}

function loadSavedRecipe(name) {
  document.getElementById('recipeDetail').innerHTML = '';
  getRecipeContent(name, '재료');
  // 내 레시피 모달 자동으로 닫기
  const modal = document.getElementById('savedRecipeModal');
  modal.style.opacity = 0;
  setTimeout(() => modal.style.display = 'none', 300);
}


function deleteSavedRecipe(name) {
  const key = `savedRecipes_${currentUser}`;
  let arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr = arr.filter(n => n !== name);
  localStorage.setItem(key, JSON.stringify(arr));
  loadSavedList();
}

async function loadYouTubeVideos(query) {
  const div = document.getElementById('popularVideos');
  div.innerHTML = '<p>영상을 불러오는 중...</p>';
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&q=${encodeURIComponent(query + ' 레시피')}&key=${YOUTUBE_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      div.innerHTML = '<p>영상 없음</p>';
      return;
    }
    div.innerHTML = data.items.map(v => `
      <div class="video-item">
        <iframe width="300" height="200" src="https://www.youtube.com/embed/${v.id.videoId}" frameborder="0" allowfullscreen></iframe>
        <p>${v.snippet.title}</p>
      </div>`).join('');
  } catch (err) {
    div.innerHTML = '<p>영상 로드 실패</p>';
  }
}

function showLoading(flag) {
  document.getElementById('loading').style.display = flag ? 'flex' : 'none';
}

const popularRecipeNames = [
  '김치찌개', '불고기', '잡채', '마라탕', '소고기 미역국',
  '떡볶이', '갈비찜', '순두부찌개', '닭볶음탕', '참치김밥', '부대찌개'
];

const popularRecipes = popularRecipeNames.map(name => ({
  name,
  image: `assets/images/popular/${name}.jpg`
}));

function loadPopularRecipes() {
  const container = document.getElementById('popularCarousel');
  const extendedList = [...popularRecipes, ...popularRecipes];

  container.innerHTML = extendedList.map(r => `
    <div class="popular-item" onclick="showRecipeStart('${r.name}')">
      <img src="${r.image}" alt="${r.name}">
      <p>${r.name}</p>
    </div>`).join('');

  startInfiniteScroll();
}

function startInfiniteScroll() {
  const carousel = document.getElementById('popularCarousel');
  let position = 0;
  let paused = false;
  const itemWidth = 220;
  const totalItems = carousel.children.length;

  carousel.addEventListener('mouseenter', () => paused = true);
  carousel.addEventListener('mouseleave', () => paused = false);

  function scroll() {
    if (!paused) {
      position += 1;
      if (position >= itemWidth * (totalItems / 2)) {
        position = 0;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(0px)`;
      } else {
        carousel.style.transition = 'transform 0.03s linear';
        carousel.style.transform = `translateX(-${position}px)`;
      }
    }
    requestAnimationFrame(scroll);
  }

  scroll();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginMenu')?.addEventListener('click', () => {
    currentUser ? logout() : toggleModal('loginModal');
  });
  document.getElementById('myRecipeBtn')?.addEventListener('click', () => {
    if (!currentUser) return alert('로그인 후 이용하세요!');
    loadSavedList();
    toggleModal('savedRecipeModal');
  });
  document.querySelector('.company-name')?.addEventListener('click', () => toggleModal('creatorModal'));
  document.querySelector('.logo')?.addEventListener('click', () => {
    document.getElementById('ingredients').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('recipeDetail').innerHTML = '';
    document.getElementById('popularVideos').innerHTML = '';
    document.getElementById('popularSection').style.display = 'flex';
    document.getElementById('popularTitle').style.display = 'block';
  });

  document.getElementById('recommendBtn')?.addEventListener('click', recommendRecipe);
  document.getElementById('loginBtn')?.addEventListener('click', login);
  document.getElementById('signupBtn')?.addEventListener('click', signup);
  document.getElementById('loginTabBtn')?.addEventListener('click', showLoginTab);
  document.getElementById('signupTabBtn')?.addEventListener('click', showSignupTab);

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      modal.style.opacity = 0;
      setTimeout(() => modal.style.display = 'none', 300);
    });
  });

  document.getElementById('ingredients').addEventListener('keypress', e => {
    if (e.key === 'Enter') recommendRecipe();
  });

  updateMenu();
  loadPopularRecipes();
});
