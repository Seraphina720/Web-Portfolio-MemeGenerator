// MemePop State Management
const STATE = {
  currentView: 'home',
  currentShortsId: null,
  activeCategory: 'all',
  searchQuery: '',
  theme: 'light',
  
  // Mock Database
  shorts: [
    {
      id: 'shorts-1',
      title: '뚱한 고양이의 하루 🐱',
      creator: '냥이대장',
      category: 'animal',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cute-cat-looking-intently-at-something-33924-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop',
      likes: 1240,
      isLiked: false,
      isSaved: false,
      views: '124K',
      hashtags: ['고양이', '귀요미', '캣스타그램'],
      captionFrame: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop'
    },
    {
      id: 'shorts-2',
      title: '지스타 최신 게임 플레이 대공개 🎮',
      creator: '겜스타Q',
      category: 'game',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-playing-a-video-game-in-a-dark-room-41982-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop',
      likes: 852,
      isLiked: false,
      isSaved: false,
      views: '88K',
      hashtags: ['지스타', '게임추천', '신작게임'],
      captionFrame: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop'
    },
    {
      id: 'shorts-3',
      title: '요즘 유행하는 뉴트로 댄스 챌린지 💃',
      creator: '댄싱클럽',
      category: 'music',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-front-of-a-neon-sign-41846-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop',
      likes: 4210,
      isLiked: false,
      isSaved: false,
      views: '350K',
      hashtags: ['댄스챌린지', '뉴트로', '릴스유행'],
      captionFrame: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop'
    },
    {
      id: 'shorts-4',
      title: '인공지능이 그린 강아지 캐릭터? 🐶🎨',
      creator: 'AI크리에이터',
      category: 'ai',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-digital-tablet-in-her-studio-41983-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop',
      likes: 540,
      isLiked: false,
      isSaved: false,
      views: '24K',
      hashtags: ['AI아트', '인공지능', '디지털아트'],
      captionFrame: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop'
    }
  ],
  
  comments: {
    'shorts-1': [
      { user: '집사1호', text: '뚱한 표정 너무 귀여운거 아님? ㅠㅠ' },
      { user: '냥이러버', text: '이거 진짜 소장각이다 ㅋㅋㅋ' }
    ],
    'shorts-2': [
      { user: '프로게이머', text: '와 비주얼 지렸다 바로 해봐야지' }
    ]
  },
  
  // Custom Memes created by users
  memes: [
    {
      id: 'meme-1',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop',
      text: '월요일 아침 출근하는 내 모습',
      creator: '민지짱',
      likes: 42,
      isLiked: false,
      sourceShortsId: 'shorts-1'
    }
  ],
  
  notifications: [
    { id: 1, type: 'like', text: '민지짱님이 당신의 밈에 좋아요를 눌렀습니다.', time: '5분 전', unread: true },
    { id: 2, type: 'follow', text: '박준우님이 당신을 팔로우하기 시작했습니다.', time: '1시간 전', unread: true },
    { id: 3, type: 'comment', text: '뚱냥이 러버님이 "고양이 귀여워..." 댓글을 남겼습니다.', time: '2시간 전', unread: false }
  ],
  
  // Stickers available for Editor
  stickers: [
    '🐱', '🐶', '🔥', '⚡', '💥', '✨', '🎉', '💡', '💬', '❤️', '👍', '😎', '🤣', '😭', '🤯', '🍕', '🎮', '🎨'
  ],
  
  // Editor Session variables
  editor: {
    backgroundImage: null,
    elements: [],
    selectedId: null,
    canvas: null,
    ctx: null
  }
};

// LocalStorage Sync helper
function initLocalStorage() {
  if (!localStorage.getItem('memepop_memes')) {
    localStorage.setItem('memepop_memes', JSON.stringify(STATE.memes));
  } else {
    STATE.memes = JSON.parse(localStorage.getItem('memepop_memes'));
  }
  
  if (!localStorage.getItem('memepop_shorts_saved')) {
    localStorage.setItem('memepop_shorts_saved', JSON.stringify([]));
  } else {
    const savedIds = JSON.parse(localStorage.getItem('memepop_shorts_saved'));
    STATE.shorts.forEach(s => {
      s.isSaved = savedIds.includes(s.id);
    });
  }
}

// Router & View Loader
function router() {
  const hash = window.location.hash || '#home';
  const appView = document.getElementById('app-view');
  
  // Set Nav Active styles
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });

  // Extract params
  const [route, param] = hash.split('/');
  
  if (route === '#home') {
    renderHome(appView);
  } else if (route === '#explore') {
    renderExplore(appView);
  } else if (route === '#trending') {
    renderTrending(appView);
  } else if (route === '#editor') {
    renderEditor(appView, param); // param can be shortsId
  } else if (route === '#community') {
    renderCommunity(appView);
  } else if (route === '#profile') {
    renderProfile(appView);
  } else if (route === '#notifications') {
    renderNotifications(appView);
  } else if (route === '#settings') {
    renderSettings(appView);
  } else if (route === '#shorts' && param) {
    renderShortsDetail(appView, param);
  } else {
    render404(appView);
  }
}

// Render Views
function renderHome(container) {
  container.innerHTML = `
    <section class="home-section animate-bounce-in">
      <div class="home-section-header">
        <h2>🔥 오늘의 인기 숏폼</h2>
        <span class="badge-pop">TRENDING NOW</span>
      </div>
      <div class="shorts-grid" id="popular-shorts-grid"></div>
    </section>

    <section class="home-section">
      <div class="home-section-header">
        <h2>✨ 오늘의 추천 밈</h2>
        <a href="#community" class="btn-pop btn-accent">커뮤니티 전체보기</a>
      </div>
      <div class="meme-gallery" id="home-meme-gallery"></div>
    </section>
  `;
  
  // Render grid contents
  const popularGrid = document.getElementById('popular-shorts-grid');
  STATE.shorts.forEach(short => {
    popularGrid.appendChild(createShortsCard(short));
  });

  const homeMemeGallery = document.getElementById('home-meme-gallery');
  STATE.memes.slice(0, 3).forEach(meme => {
    homeMemeGallery.appendChild(createMemeCard(meme));
  });
}

function renderExplore(container) {
  container.innerHTML = `
    <section class="animate-bounce-in">
      <h2>🧭 탐색 피드</h2>
      <div class="category-scroller">
        <button class="btn-pop ${STATE.activeCategory === 'all' ? 'btn-primary' : ''}" data-cat="all">전체</button>
        <button class="btn-pop ${STATE.activeCategory === 'game' ? 'btn-primary' : ''}" data-cat="game">게임</button>
        <button class="btn-pop ${STATE.activeCategory === 'animal' ? 'btn-primary' : ''}" data-cat="animal">동물</button>
        <button class="btn-pop ${STATE.activeCategory === 'music' ? 'btn-primary' : ''}" data-cat="music">음악</button>
        <button class="btn-pop ${STATE.activeCategory === 'ai' ? 'btn-primary' : ''}" data-cat="ai">AI</button>
      </div>
      <div class="shorts-grid" id="explore-shorts-grid"></div>
    </section>
  `;
  
  const exploreGrid = document.getElementById('explore-shorts-grid');
  const filtered = STATE.activeCategory === 'all' 
    ? STATE.shorts 
    : STATE.shorts.filter(s => s.category === STATE.activeCategory);

  filtered.forEach(short => {
    exploreGrid.appendChild(createShortsCard(short));
  });

  // Add click listener for category switch
  container.querySelectorAll('.category-scroller button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      STATE.activeCategory = e.target.getAttribute('data-cat');
      renderExplore(container);
    });
  });
}

function renderTrending(container) {
  container.innerHTML = `
    <section class="animate-bounce-in">
      <h2 class="section-title">🏆 MemePop 실시간 랭킹</h2>
      <div class="steps-grid" style="margin-bottom: 40px;">
        <div class="card-neo step-card" style="background-color: var(--color-secondary);">
          <div class="step-number" style="background-color: var(--color-primary);">1</div>
          <h3>${STATE.memes[0]?.creator || '민지짱'}</h3>
          <p>금주의 밈 마스터</p>
        </div>
        <div class="card-neo step-card">
          <div class="step-number" style="background-color: var(--color-accent);">2</div>
          <h3>냥이대장</h3>
          <p>인기 영상 크리에이터</p>
        </div>
        <div class="card-neo step-card">
          <div class="step-number" style="background-color: var(--color-neon-purple); color: #fff;">3</div>
          <h3>태오마케터</h3>
          <p>신흥 드립 천재</p>
        </div>
      </div>

      <div class="card-neo">
        <h3 style="margin-bottom: 20px;">🔥 실시간 인기 키워드 TOP 5</h3>
        <ol style="margin-left: 20px; font-weight: 700; font-size: 1.1rem; display: flex; flex-direction: column; gap: 12px;">
          <li>1. 놀란 고양이 🐱</li>
          <li>2. 종강 챌린지 💃</li>
          <li>3. AI 디자이너 🎨</li>
          <li>4. 지스타 하이라이트 🎮</li>
          <li>5. 네오브루탈리즘 감성 ✨</li>
        </ol>
      </div>
    </section>
  `;
}

function renderShortsDetail(container, shortsId) {
  const short = STATE.shorts.find(s => s.id === shortsId);
  if (!short) {
    render404(container);
    return;
  }
  
  container.innerHTML = `
    <section class="animate-bounce-in">
      <div class="detail-layout">
        <!-- Video Section -->
        <div class="card-neo video-container-card">
          <div class="video-player-wrapper">
            <video src="${short.videoUrl}" autoplay loop controls muted></video>
          </div>
          <div class="shorts-card-info" style="border: none;">
            <h3>${short.title}</h3>
            <p style="color: var(--text-muted); font-weight: 700; margin-bottom: 12px;">@${short.creator}</p>
            <div style="display: flex; gap: 8px;">
              ${short.hashtags.map(tag => `<span class="badge-pop">#${tag}</span>`).join('')}
            </div>
          </div>
          <div class="detail-actions-panel">
            <button class="reaction-button ${short.isLiked ? 'active' : ''}" id="like-btn" aria-label="좋아요">❤️</button>
            <button class="reaction-button ${short.isSaved ? 'active' : ''}" id="save-btn" aria-label="저장">💾</button>
            <a href="#editor/${short.id}" class="btn-pop btn-primary btn-pill" style="font-size: 1.2rem;">🎨 Meme It! (밈 만들기)</a>
          </div>
        </div>

        <!-- Comments / Related Section -->
        <div class="card-neo comments-panel-card">
          <div class="comments-header">
            <h3>💬 댓글 (${(STATE.comments[short.id] || []).length})</h3>
          </div>
          <div class="comments-list" id="comments-list-box"></div>
          <div class="comment-input-box">
            <input type="text" id="new-comment-input" placeholder="드립을 쳐보세요..." aria-label="댓글 입력">
            <button class="btn-pop" id="send-comment-btn">전송</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Render comments
  const listBox = document.getElementById('comments-list-box');
  const commentList = STATE.comments[short.id] || [];
  listBox.innerHTML = '';
  commentList.forEach(cmt => {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
      <div class="comment-user">@${cmt.user}</div>
      <div class="comment-text">${cmt.text}</div>
    `;
    listBox.appendChild(item);
  });

  // Attach event handlers
  document.getElementById('like-btn').addEventListener('click', (e) => {
    short.isLiked = !short.isLiked;
    e.target.classList.toggle('active', short.isLiked);
  });

  document.getElementById('save-btn').addEventListener('click', (e) => {
    short.isSaved = !short.isSaved;
    e.target.classList.toggle('active', short.isSaved);
    let saved = JSON.parse(localStorage.getItem('memepop_shorts_saved')) || [];
    if (short.isSaved) {
      if (!saved.includes(short.id)) saved.push(short.id);
    } else {
      saved = saved.filter(id => id !== short.id);
    }
    localStorage.setItem('memepop_shorts_saved', JSON.stringify(saved));
  });

  document.getElementById('send-comment-btn').addEventListener('click', () => {
    const input = document.getElementById('new-comment-input');
    if (!input.value.trim()) return;
    if (!STATE.comments[short.id]) STATE.comments[short.id] = [];
    STATE.comments[short.id].push({
      user: 'MYPOP_CREATOR',
      text: input.value.trim()
    });
    input.value = '';
    renderShortsDetail(container, shortsId);
  });
}

// Canvas Meme Editor
function renderEditor(container, shortsId) {
  const short = STATE.shorts.find(s => s.id === shortsId) || STATE.shorts[0];
  
  container.innerHTML = `
    <section class="animate-bounce-in">
      <div class="editor-layout">
        <!-- Left: Asset list -->
        <div class="editor-sidebar">
          <div class="tool-tab-box">
            <button class="tool-tab active" id="tab-stickers">스티커</button>
            <button class="tool-tab" id="tab-texts">텍스트 추가</button>
          </div>
          <div class="editor-tools-content" id="editor-tools-content">
            <div class="sticker-grid" id="sticker-selector-grid"></div>
          </div>
        </div>

        <!-- Center: Canvas -->
        <div class="canvas-panel">
          <div class="canvas-wrapper">
            <canvas id="meme-canvas" width="500" height="500"></canvas>
          </div>
          <div class="editor-actions">
            <button class="btn-pop btn-accent" id="canvas-clear-btn">초기화</button>
            <button class="btn-pop btn-primary" id="canvas-download-btn">내 기기에 저장</button>
            <button class="btn-pop btn-purple" id="canvas-publish-btn">MemePop에 발행</button>
          </div>
        </div>

        <!-- Right: Properties panel -->
        <div class="card-neo properties-panel">
          <h3>🎨 스타일 제어</h3>
          <div class="property-group">
            <label for="text-input-field">선택 텍스트 내용</label>
            <input type="text" id="text-input-field" placeholder="글자를 입력하세요...">
          </div>
          <div class="property-group">
            <label for="font-family-select">폰트 스타일</label>
            <select id="font-family-select">
              <option value="Impact">Impact (볼드)</option>
              <option value="Outfit">Outfit</option>
              <option value="Arial">Arial</option>
              <option value="Comic Sans MS">Comic Sans</option>
            </select>
          </div>
          <div class="property-group">
            <label>글자 컬러</label>
            <div class="color-chips" id="text-color-chips">
              <div class="color-chip" style="background-color: #FFFFFF;" data-color="#FFFFFF"></div>
              <div class="color-chip" style="background-color: #FF3E6C;" data-color="#FF3E6C"></div>
              <div class="color-chip" style="background-color: #FFD200;" data-color="#FFD200"></div>
              <div class="color-chip" style="background-color: #00E5FF;" data-color="#00E5FF"></div>
              <div class="color-chip" style="background-color: #121212;" data-color="#121212"></div>
            </div>
          </div>
          <div class="property-group">
            <label>테두리 컬러</label>
            <div class="color-chips" id="stroke-color-chips">
              <div class="color-chip" style="background-color: #121212;" data-color="#121212"></div>
              <div class="color-chip" style="background-color: #FFFFFF;" data-color="#FFFFFF"></div>
              <div class="color-chip" style="background-color: #FF3E6C;" data-color="#FF3E6C"></div>
            </div>
          </div>
          <div class="property-group">
            <button class="btn-pop btn-accent" id="delete-element-btn" style="width: 100%; justify-content: center;">선택 요소 삭제</button>
          </div>
        </div>
      </div>
    </section>
  `;

  initCanvas(short.captionFrame);
  setupEditorUIHandlers();
}

function initCanvas(imageUrl) {
  const canvas = document.getElementById('meme-canvas');
  const ctx = canvas.getContext('2d');
  
  STATE.editor.canvas = canvas;
  STATE.editor.ctx = ctx;
  STATE.editor.elements = [];
  STATE.editor.selectedId = null;
  
  // Load background
  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";
  bgImg.src = imageUrl;
  bgImg.onload = () => {
    STATE.editor.backgroundImage = bgImg;
    drawCanvas();
  };

  // Add default top/bottom texts
  STATE.editor.elements.push({
    id: 'text-top',
    type: 'text',
    text: '이 순간',
    x: 250,
    y: 80,
    fontSize: 40,
    fontFamily: 'Impact',
    fillColor: '#FFFFFF',
    strokeColor: '#121212',
    width: 200,
    height: 50
  });

  STATE.editor.elements.push({
    id: 'text-bottom',
    type: 'text',
    text: '내 표정',
    x: 250,
    y: 420,
    fontSize: 40,
    fontFamily: 'Impact',
    fillColor: '#FFD200',
    strokeColor: '#121212',
    width: 200,
    height: 50
  });

  // Canvas Interactions
  let isDragging = false;
  let dragElement = null;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if clicked element
    dragElement = getElementAt(mouseX, mouseY);
    if (dragElement) {
      isDragging = true;
      STATE.editor.selectedId = dragElement.id;
      startX = mouseX - dragElement.x;
      startY = mouseY - dragElement.y;
      
      // Update property values in right panel
      if (dragElement.type === 'text') {
        document.getElementById('text-input-field').value = dragElement.text;
        document.getElementById('font-family-select').value = dragElement.fontFamily;
      }
    } else {
      STATE.editor.selectedId = null;
    }
    drawCanvas();
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging || !dragElement) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    dragElement.x = mouseX - startX;
    dragElement.y = mouseY - startY;
    drawCanvas();
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    dragElement = null;
  });

  // Touch support for Mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.touches[0].clientX - rect.left;
    const mouseY = e.touches[0].clientY - rect.top;
    
    dragElement = getElementAt(mouseX, mouseY);
    if (dragElement) {
      isDragging = true;
      STATE.editor.selectedId = dragElement.id;
      startX = mouseX - dragElement.x;
      startY = mouseY - dragElement.y;
      if (dragElement.type === 'text') {
        document.getElementById('text-input-field').value = dragElement.text;
      }
    }
    drawCanvas();
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || !dragElement || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.touches[0].clientX - rect.left;
    const mouseY = e.touches[0].clientY - rect.top;
    
    dragElement.x = mouseX - startX;
    dragElement.y = mouseY - startY;
    drawCanvas();
  });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
    dragElement = null;
  });
}

function getElementAt(x, y) {
  // Loop backwards to check top layer elements first
  for (let i = STATE.editor.elements.length - 1; i >= 0; i--) {
    const el = STATE.editor.elements[i];
    if (el.type === 'text') {
      const w = el.width || 150;
      const h = el.height || 40;
      if (x >= el.x - w/2 && x <= el.x + w/2 && y >= el.y - h/2 && y <= el.y + h/2) {
        return el;
      }
    } else if (el.type === 'sticker') {
      if (x >= el.x - 30 && x <= el.x + 30 && y >= el.y - 30 && y <= el.y + 30) {
        return el;
      }
    }
  }
  return null;
}

function drawCanvas() {
  const canvas = STATE.editor.canvas;
  const ctx = STATE.editor.ctx;
  if (!canvas || !ctx) return;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  if (STATE.editor.backgroundImage) {
    ctx.drawImage(STATE.editor.backgroundImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw Elements
  STATE.editor.elements.forEach(el => {
    if (el.type === 'text') {
      ctx.font = `900 ${el.fontSize}px ${el.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Calculate borders/stroke
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = 8;
      ctx.strokeText(el.text, el.x, el.y);
      
      ctx.fillStyle = el.fillColor;
      ctx.fillText(el.text, el.x, el.y);

      // Measure size for selection box
      const metrics = ctx.measureText(el.text);
      el.width = metrics.width;
      el.height = el.fontSize;
    } else if (el.type === 'sticker') {
      ctx.font = '50px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.text, el.x, el.y);
    }

    // Selection border
    if (STATE.editor.selectedId === el.id) {
      ctx.strokeStyle = 'var(--color-primary)';
      ctx.lineWidth = 3;
      if (el.type === 'text') {
        ctx.strokeRect(el.x - el.width/2 - 10, el.y - el.height/2 - 10, el.width + 20, el.height + 20);
      } else {
        ctx.strokeRect(el.x - 30, el.y - 30, 60, 60);
      }
    }
  });
}

function setupEditorUIHandlers() {
  // Stickers Sidebar Grid
  const stickerGrid = document.getElementById('sticker-selector-grid');
  stickerGrid.innerHTML = '';
  STATE.stickers.forEach(sticker => {
    const item = document.createElement('button');
    item.className = 'sticker-item';
    item.innerText = sticker;
    item.addEventListener('click', () => {
      STATE.editor.elements.push({
        id: 'sticker-' + Date.now(),
        type: 'sticker',
        text: sticker,
        x: 250,
        y: 250
      });
      drawCanvas();
    });
    stickerGrid.appendChild(item);
  });

  // Tabs
  const tabStickers = document.getElementById('tab-stickers');
  const tabTexts = document.getElementById('tab-texts');
  
  tabStickers.addEventListener('click', () => {
    tabStickers.classList.add('active');
    tabTexts.classList.remove('active');
    document.getElementById('editor-tools-content').innerHTML = `<div class="sticker-grid" id="sticker-selector-grid"></div>`;
    setupEditorUIHandlers();
  });

  tabTexts.addEventListener('click', () => {
    tabStickers.classList.remove('active');
    tabTexts.classList.add('active');
    document.getElementById('editor-tools-content').innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <button class="btn-pop btn-primary" id="add-new-text-btn" style="width: 100%; justify-content: center;">📝 텍스트 추가하기</button>
        <p style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700;">추가된 글씨를 마우스로 잡아서 움직일 수 있습니다.</p>
      </div>
    `;
    
    document.getElementById('add-new-text-btn').addEventListener('click', () => {
      STATE.editor.elements.push({
        id: 'text-' + Date.now(),
        type: 'text',
        text: '여기에 입력',
        x: 250,
        y: 250,
        fontSize: 32,
        fontFamily: 'Impact',
        fillColor: '#FFFFFF',
        strokeColor: '#121212',
        width: 150,
        height: 40
      });
      drawCanvas();
    });
  });

  // Text Property Input
  const textInput = document.getElementById('text-input-field');
  textInput.addEventListener('input', (e) => {
    const selected = STATE.editor.elements.find(el => el.id === STATE.editor.selectedId);
    if (selected && selected.type === 'text') {
      selected.text = e.target.value;
      drawCanvas();
    }
  });

  // Font family selector
  const fontSelect = document.getElementById('font-family-select');
  fontSelect.addEventListener('change', (e) => {
    const selected = STATE.editor.elements.find(el => el.id === STATE.editor.selectedId);
    if (selected && selected.type === 'text') {
      selected.fontFamily = e.target.value;
      drawCanvas();
    }
  });

  // Color chips
  document.getElementById('text-color-chips').addEventListener('click', (e) => {
    if (!e.target.classList.contains('color-chip')) return;
    const color = e.target.getAttribute('data-color');
    const selected = STATE.editor.elements.find(el => el.id === STATE.editor.selectedId);
    if (selected && selected.type === 'text') {
      selected.fillColor = color;
      drawCanvas();
    }
  });

  document.getElementById('stroke-color-chips').addEventListener('click', (e) => {
    if (!e.target.classList.contains('color-chip')) return;
    const color = e.target.getAttribute('data-color');
    const selected = STATE.editor.elements.find(el => el.id === STATE.editor.selectedId);
    if (selected && selected.type === 'text') {
      selected.strokeColor = color;
      drawCanvas();
    }
  });

  // Delete Element
  document.getElementById('delete-element-btn').addEventListener('click', () => {
    if (!STATE.editor.selectedId) return;
    STATE.editor.elements = STATE.editor.elements.filter(el => el.id !== STATE.editor.selectedId);
    STATE.editor.selectedId = null;
    drawCanvas();
  });

  // Clear Canvas
  document.getElementById('canvas-clear-btn').addEventListener('click', () => {
    STATE.editor.elements = [];
    STATE.editor.selectedId = null;
    drawCanvas();
  });

  // Download Image
  document.getElementById('canvas-download-btn').addEventListener('click', () => {
    // temporarily unselect to avoid selection borders on output
    const selId = STATE.editor.selectedId;
    STATE.editor.selectedId = null;
    drawCanvas();

    const link = document.createElement('a');
    link.download = `memepop_${Date.now()}.png`;
    link.href = STATE.editor.canvas.toDataURL();
    link.click();

    STATE.editor.selectedId = selId;
    drawCanvas();
  });

  // Publish to Community
  document.getElementById('canvas-publish-btn').addEventListener('click', () => {
    const selId = STATE.editor.selectedId;
    STATE.editor.selectedId = null;
    drawCanvas();

    const dataUrl = STATE.editor.canvas.toDataURL();
    
    // Add to state and storage
    const newMeme = {
      id: 'meme-' + Date.now(),
      imageUrl: dataUrl,
      text: '내가 제작한 크리에이티브 밈',
      creator: 'MYPOP_CREATOR',
      likes: 0,
      isLiked: false
    };

    STATE.memes.unshift(newMeme);
    localStorage.setItem('memepop_memes', JSON.stringify(STATE.memes));

    alert('커뮤니티 피드에 밈이 성공적으로 발행되었습니다! 🎉');
    window.location.hash = '#community';
  });
}

function renderCommunity(container) {
  container.innerHTML = `
    <section class="animate-bounce-in">
      <div class="home-section-header">
        <h2>💬 밈 커뮤니티 피드</h2>
        <span class="badge-pop">POP MEMES</span>
      </div>
      <div class="meme-gallery" id="community-meme-gallery"></div>
    </section>
  `;
  
  const gallery = document.getElementById('community-meme-gallery');
  STATE.memes.forEach(meme => {
    gallery.appendChild(createMemeCard(meme));
  });
}

function renderProfile(container) {
  const userMemes = STATE.memes.filter(m => m.creator === 'MYPOP_CREATOR');
  const savedShorts = STATE.shorts.filter(s => s.isSaved);

  container.innerHTML = `
    <section class="animate-bounce-in">
      <div class="profile-card">
        <div class="profile-avatar">😎</div>
        <div class="profile-info">
          <h2>@MYPOP_CREATOR</h2>
          <p>MemePop 플레이어 & 크리에이터 🚀</p>
          <div class="profile-stats">
            <div class="stat-item">발행 밈 <span>${userMemes.length}</span></div>
            <div class="stat-item">저장 쇼츠 <span>${savedShorts.length}</span></div>
            <div class="stat-item">팔로워 <span>12</span></div>
            <div class="stat-item">팔로잉 <span>24</span></div>
          </div>
        </div>
      </div>

      <div class="profile-tabs">
        <button class="tab-btn active" id="btn-tab-mymemes">내가 만든 밈 (${userMemes.length})</button>
        <button class="tab-btn" id="btn-tab-savedshorts">저장한 쇼츠 (${savedShorts.length})</button>
      </div>

      <div class="shorts-grid" id="profile-tab-content"></div>
    </section>
  `;

  const tabContent = document.getElementById('profile-tab-content');
  
  const showMyMemes = () => {
    tabContent.className = 'meme-gallery';
    tabContent.innerHTML = '';
    if (userMemes.length === 0) {
      tabContent.innerHTML = '<p style="padding: 24px; font-weight: 700;">아직 제작하여 커뮤니티에 올린 밈이 없습니다. 에디터에서 첫 밈을 발행해보세요!</p>';
      return;
    }
    userMemes.forEach(meme => {
      tabContent.appendChild(createMemeCard(meme));
    });
  };

  const showSavedShorts = () => {
    tabContent.className = 'shorts-grid';
    tabContent.innerHTML = '';
    if (savedShorts.length === 0) {
      tabContent.innerHTML = '<p style="padding: 24px; font-weight: 700;">저장한 쇼츠 영상이 없습니다. 마음에 드는 쇼츠를 보고 북마크를 눌러 저장해보세요!</p>';
      return;
    }
    savedShorts.forEach(short => {
      tabContent.appendChild(createShortsCard(short));
    });
  };

  showMyMemes();

  document.getElementById('btn-tab-mymemes').addEventListener('click', (e) => {
    document.getElementById('btn-tab-mymemes').classList.add('active');
    document.getElementById('btn-tab-savedshorts').classList.remove('active');
    showMyMemes();
  });

  document.getElementById('btn-tab-savedshorts').addEventListener('click', (e) => {
    document.getElementById('btn-tab-mymemes').classList.remove('active');
    document.getElementById('btn-tab-savedshorts').classList.add('active');
    showSavedShorts();
  });
}

function renderNotifications(container) {
  container.innerHTML = `
    <section class="animate-bounce-in">
      <div class="home-section-header">
        <h2>🔔 실시간 알림 피드</h2>
        <button class="btn-pop btn-accent" id="clear-all-notifs">알림 지우기</button>
      </div>
      <div class="notif-list" id="notif-list-box"></div>
    </section>
  `;

  const box = document.getElementById('notif-list-box');
  STATE.notifications.forEach(notif => {
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `
      <div class="notif-left">
        <span class="notif-icon">${notif.type === 'like' ? '❤️' : notif.type === 'follow' ? '👤' : '💬'}</span>
        <span class="notif-text">${notif.text}</span>
      </div>
      <span class="notif-time">${notif.time}</span>
    `;
    box.appendChild(item);
  });

  document.getElementById('clear-all-notifs').addEventListener('click', () => {
    STATE.notifications = [];
    document.getElementById('notif-badge').style.display = 'none';
    renderNotifications(container);
  });
}

function renderSettings(container) {
  container.innerHTML = `
    <section class="animate-bounce-in">
      <h2>⚙️ 설정 및 테마</h2>
      <div class="settings-grid" style="margin-top: 24px;">
        <div class="settings-menu">
          <div class="settings-menu-item active">일반 설정</div>
        </div>
        <div class="settings-pane">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
              <h3 style="margin-bottom: 4px;">다크 팝 모드</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); font-weight: 700;">네오 브루탈리즘 감성의 야간 테마를 활성화합니다.</p>
            </div>
            <label class="switch">
              <input type="checkbox" id="darkmode-toggle" ${STATE.theme === 'dark' ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin-bottom: 4px;">알림 수신 동의</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); font-weight: 700;">내 밈에 좋아요, 댓글, 팔로우 리액션 발생 시 푸시알림을 받습니다.</p>
            </div>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('darkmode-toggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      STATE.theme = 'dark';
      document.body.style.backgroundColor = '#1e1e1e';
      document.body.style.color = '#ffffff';
    } else {
      STATE.theme = 'light';
      document.body.style.backgroundColor = 'var(--bg-primary)';
      document.body.style.color = 'var(--text-dark)';
    }
  });
}

function render404(container) {
  container.innerHTML = `
    <section style="text-align: center; padding: 64px 24px;" class="animate-bounce-in">
      <h1 style="font-size: 6rem; color: var(--color-primary);">404</h1>
      <h2 style="margin-bottom: 16px;">길을 잃으셨나요? 🐱💥</h2>
      <p style="margin-bottom: 32px; font-weight: 700; color: var(--text-muted);">찾으시는 페이지가 날아가 버렸거나 존재하지 않습니다.</p>
      <a href="#home" class="btn-pop btn-primary">홈으로 돌아가기</a>
    </section>
  `;
}

// DOM Creators
function createShortsCard(short) {
  const article = document.createElement('article');
  article.className = 'shorts-card';
  article.innerHTML = `
    <div class="shorts-thumbnail">
      <img src="${short.thumbnailUrl}" alt="${short.title}">
      <div class="shorts-card-overlay">
        <span class="badge-pop" style="background-color: var(--color-primary); color: #fff;">▶ PLAY</span>
        <span class="badge-pop" style="background-color: var(--color-secondary);">${short.views}</span>
      </div>
    </div>
    <div class="shorts-card-info">
      <h3 class="shorts-card-title">${short.title}</h3>
      <div class="shorts-creator">
        <span class="creator-name">@${short.creator}</span>
        <span style="font-weight: bold; color: var(--color-primary);">❤️ ${short.likes}</span>
      </div>
    </div>
  `;
  
  article.addEventListener('click', () => {
    window.location.hash = `#shorts/${short.id}`;
  });

  return article;
}

function createMemeCard(meme) {
  const article = document.createElement('article');
  article.className = 'meme-card';
  article.innerHTML = `
    <div class="meme-image-wrapper">
      <img src="${meme.imageUrl}" alt="${meme.text}">
    </div>
    <div class="meme-card-body">
      <p style="font-weight: 900; font-size: 1.05rem;">${meme.text}</p>
      <div class="meme-card-footer">
        <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-muted);">By @${meme.creator}</span>
        <button class="btn-pop btn-pill" style="font-size: 0.8rem; padding: 4px 10px;" id="meme-like-${meme.id}">
          ❤️ ${meme.likes}
        </button>
      </div>
    </div>
  `;

  article.querySelector(`#meme-like-${meme.id}`).addEventListener('click', (e) => {
    e.stopPropagation();
    meme.isLiked = !meme.isLiked;
    meme.likes += meme.isLiked ? 1 : -1;
    localStorage.setItem('memepop_memes', JSON.stringify(STATE.memes));
    e.target.innerHTML = `❤️ ${meme.likes}`;
    e.target.classList.toggle('btn-primary', meme.isLiked);
  });

  return article;
}

// Global search handler
document.getElementById('global-search-btn').addEventListener('click', performSearch);
document.getElementById('global-search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

function performSearch() {
  const query = document.getElementById('global-search-input').value.trim().toLowerCase();
  if (!query) return;
  
  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <section class="animate-bounce-in">
      <h2>🔍 "${query}" 검색 결과</h2>
      <div class="shorts-grid" id="search-results-grid"></div>
    </section>
  `;
  
  const resultsGrid = document.getElementById('search-results-grid');
  const filtered = STATE.shorts.filter(s => 
    s.title.toLowerCase().includes(query) || 
    s.creator.toLowerCase().includes(query) ||
    s.hashtags.some(tag => tag.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    resultsGrid.innerHTML = '<p style="padding: 24px; font-weight: 700;">일치하는 숏폼을 찾을 수 없습니다.</p>';
  } else {
    filtered.forEach(short => {
      resultsGrid.appendChild(createShortsCard(short));
    });
  }
}

// Global Listeners
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  initLocalStorage();
  router();
});
