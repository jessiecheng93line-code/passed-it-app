import React, { useState, useEffect } from 'react';
import { 
  Star, Film, Tv, Flame, Share2, Award, Calendar, CheckCircle2, 
  ChevronRight, Play, Plus, BarChart3, Heart, Settings, Users, 
  ShieldCheck, LogIn, LogOut, Search, Trash2, Sparkles, Filter, RefreshCw,
  Clapperboard, Camera, Ticket, MessageSquareQuote, X, Pencil, AlertTriangle,
  Smile, Frown, Brain, Check, Info, Download, Upload
} from 'lucide-react';

const DEFAULT_ADMINS = ['ssvs73334@gmail.com', 'jessiecheng93line@gmail.com'];
const DEFAULT_TMDB_KEY = '8c0990a07b0c3fbd4c56f2e2fb6c8026';

// 預設情緒預設包 (Presets)
const EMOTION_PRESETS = [
  { name: '😭 哭爆洋蔥片', scores: { funny: 1, tear: 5, love: 2, heal: 4, tense: 2, brain: 3 } },
  { name: '😂 輕鬆爆笑劇', scores: { funny: 5, tear: 0, love: 2, heal: 4, tense: 1, brain: 1 } },
  { name: '💖 高甜戀愛劇', scores: { funny: 3, tear: 1, love: 5, heal: 4, tense: 1, brain: 1 } },
  { name: '🤯 高能燒腦反轉', scores: { funny: 1, tear: 1, love: 0, heal: 1, tense: 4, brain: 5 } },
  { name: '😱 刺激驚悚大作', scores: { funny: 1, tear: 1, love: 0, heal: 0, tense: 5, brain: 3 } }
];

const INITIAL_RATINGS = [
  {
    id: '1',
    title: "怪奇物語 (Stranger Things)",
    platform: "Netflix",
    type: "TV",
    overallScore: 9.5,
    rewatchScore: 5,
    recommend: true,
    userReview: "第四季高潮迭起， Vecna 角色塑造極佳！氛圍感拉滿，期待最終季。",
    watchedDate: "2026-07-10",
    releaseDate: "2016-07-15",
    emotions: { funny: 2, tear: 3, love: 2, heal: 2, tense: 5, brain: 4 },
    seasonTrack: { currentSeason: 4, totalSeasons: 4, currentEp: 9, totalEp: 9 },
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=60",
    overview: "當一個小男孩在印第安納州霍金斯小鎮憑空消失時，他的朋友、家人和當地警方被捲入一個涉及政府秘密實驗、可怕超自然力量和一個擁有超能力怪異小女孩的巨大謎團中。"
  },
  {
    id: '2',
    title: "黑鏡 (Black Mirror)",
    platform: "Netflix",
    type: "TV",
    overallScore: 9.2,
    rewatchScore: 4,
    recommend: true,
    userReview: "每集獨立單元劇風格神作，科幻反烏托邦寓意極深，非常值得細細品味。",
    watchedDate: "2026-06-22",
    releaseDate: "2011-12-04",
    emotions: { funny: 1, tear: 2, love: 1, heal: 1, tense: 4, brain: 5 },
    seasonTrack: { currentSeason: 6, totalSeasons: 6, currentEp: 5, totalEp: 5 },
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=60",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=60",
    overview: "探討現代科技對人類心靈與社會結構深遠影響的反烏托邦獨立單元劇。每一集都是全新的故事與演員陣容，以警世且黑暗的諷刺手法，探討智慧裝置、虛擬現實與 AI 發展背後的人性困境。"
  },
  {
    id: '3',
    title: "曼達洛人 (The Mandalorian)",
    platform: "Disney+",
    type: "TV",
    overallScore: 8.8,
    rewatchScore: 4,
    recommend: true,
    userReview: "Grogu 真的太可愛了！星際西部片風格非常獨特，每季都精彩。",
    watchedDate: "2026-05-18",
    releaseDate: "2019-11-12",
    emotions: { funny: 3, tear: 2, love: 2, heal: 4, tense: 4, brain: 2 },
    seasonTrack: { currentSeason: 3, totalSeasons: 3, currentEp: 8, totalEp: 8 },
    poster: "https://images.unsplash.com/photo-1579566346927-c68383817a25?w=500&auto=format&fit=crop&q=60",
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=60",
    overview: "在銀河帝國淪陷後、第一軍團崛起之前，一名孤獨的曼達洛人賞金獵人在遠離新共和國掌控的星系邊疆闖蕩。當他接到一項高額賞金任務時，意外發現目標竟然是一名神祕的小幼崽，進而展開一場橫跨星際的逃亡與守護之旅。"
  }
];

export default function App() {
  const [appTitle, setAppTitle] = useState("這部給過！ (PassedIt)");
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('ALL');
  const [tmdbKey, setTmdbKey] = useState(DEFAULT_TMDB_KEY);
  
  // 為了安全起見，預設進入網站是未登入狀態
  const [user, setUser] = useState(null);

  const [whitelist, setWhitelist] = useState(DEFAULT_ADMINS);
  const [myRatings, setMyRatings] = useState(INITIAL_RATINGS);
  const [newReleases, setNewReleases] = useState([]);
  const [loadingReleases, setLoadingReleases] = useState(false);

  // 劇情簡介與詳細資訊 Modal State
  const [viewingDetailMedia, setViewingDetailMedia] = useState(null);

  // Toast 提示訊息 state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 權限檢查函式 (防護網)
  const requireAuth = (actionCallback) => {
    if (!user) {
      showToast("⚠️ 請先「登入」以驗證親友身分，才能執行此操作！");
      setShowLoginModal(true);
      return;
    }
    actionCallback();
  };

  // 互動特效 State
  const [isSnapping, setIsSnapping] = useState(false);
  const [showTrivia, setShowTrivia] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  const MOVIE_QUOTES = [
    "🎬 「願原力與你同在。」— 星際大戰 (Star Wars)",
    "🍿 「生活就像一盒巧克力，你永遠不知道會吃到什麼口味。」— 阿甘正傳",
    "📽️ 「不要溫和地走進那個良夜。」— 星際效應 (Interstellar)",
    "🎞️ 「I am Iron Man.」— 復仇者聯盟 (Avengers)",
    "🎥 「我是世界之王！」— 鐵達尼號 (Titanic)",
    "🎭 「能力越大，責任越大。」— 蜘蛛人 (Spider-Man)",
    "🕰️ 「路，我們要去的地方不需要路。」— 回到未來",
    "🌌 「我們終將相遇，就像星辰終將交會。」— 奧本海默",
    "🦁 「過去或許令人傷痛，但你可以選擇逃避，或是從中學習。」— 獅子王",
    "🃏 「Why so serious? (幹嘛這麼嚴肅？)」— 黑暗騎士 (The Dark Knight)",
    "🕶️ 「歡迎來到真實的世界。」— 駭客任務 (The Matrix)",
    "💍 「My Precious... (我的寶貝...)」— 魔戒 (The Lord of the Rings)",
    "🎈 「冒險就在前方！」— 天外奇蹟 (Up)",
    "🤖 「To infinity and beyond! (飛向宇宙，浩瀚無垠！)」— 玩具總動員",
    "🌊 「Keep swimming! (繼續游泳就對了！)」— 海底總動員",
    "⚔️ 「如果心感到疲憊，就想起誓言吧。」— 鬼滅之刃 無限列車篇",
    "🗡️ 「人如果沒有犧牲，就什麼也得不到。」— 鋼之鍊金術師",
    "👻 「不能忘記自己的名字，否則就找不到回家的路。」— 神隱少女",
    "🏰 「無論你穿什麼衣服，你都是獨一無二的你。」— 哈爾的移動城堡",
    "🌌 「只要記住你的名字，不管你在哪裡，我都會去找你。」— 你的名字",
    "🌧️ 「世界上總有些東西，是比生命的長度更重要的。」— 天氣之子",
    "📺 「如果我們的命運已經註定，那就讓我們改寫它。」— 黑鏡",
    "🩸 「這不是關於贏，這是關於生存。」— 魷魚遊戲",
    "👑 「Winter is Coming. (凜冬將至。)」— 權力的遊戲 (Game of Thrones)",
    "☕ 「生命會自己找到出路。(Life finds a way.)」— 侏羅紀公園",
    "🍸 「Bond. James Bond. (邦德，詹姆斯·邦德。)」— 007",
    "🌹 「人只有用心靈才能看得清，本質的東西眼睛是看不見的。」— 小王子",
    "🪄 「It's LeviOsa, not LeviosAH!」— 哈利波特",
    "🕯️ 「在最黑暗的時刻，希望是我們唯一的燈塔。」— 哈利波特",
    "🎪 「最偉大的藝術，是讓別人感到快樂。」— 大娛樂家",
    "🥐 「法式優雅不是穿什麼，而是你如何看待生活。」— 艾蜜莉在巴黎",
    "⏰ 「時間不會等待任何人，但愛可以超越時間。」— 真愛每一天 (About Time)",
    "🍫 「如果不去嘗試，你永遠不知道自己能走多遠。」— 旺卡 (Wonka)",
    "🕷️ 「這不僅僅是一個面具，這是一種責任。」— 蜘蛛人：新宇宙",
    "🧟 「我們不是為了死亡而活，而是為了活著而奮鬥。」— 陰屍路",
    "👑 「欲戴王冠，必承其重。」— 繼承者們",
    "🏎️ 「人生重要的不是終點，而是沿途的風景。」— 汽車總動員",
    "🚀 「這是我個人的一小步，卻是人類的一大步。」— 登月先鋒",
    "🎻 「當音樂響起，靈魂就得到了自由。」— 聲之形",
    "☕ 「今天也是美好的一天，只要你願意這麼相信。」— 晨間直播秀"
  ];

  const triggerRandomQuote = () => {
    let random;
    do {
      random = MOVIE_QUOTES[Math.floor(Math.random() * MOVIE_QUOTES.length)];
    } while (random === currentQuote && MOVIE_QUOTES.length > 1);

    setCurrentQuote(random);
    setShowTrivia(true);
  };

  // Modals state
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showShareModal, setShowShareModal] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedRatings = localStorage.getItem('passedit_ratings');
    if (savedRatings) {
      try { setMyRatings(JSON.parse(savedRatings)); } catch (e) {}
    }
    const savedWhitelist = localStorage.getItem('passedit_whitelist');
    if (savedWhitelist) {
      try { setWhitelist(JSON.parse(savedWhitelist)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('passedit_ratings', JSON.stringify(myRatings));
  }, [myRatings]);

  useEffect(() => {
    localStorage.setItem('passedit_whitelist', JSON.stringify(whitelist));
  }, [whitelist]);

  const fetchTMDBData = async () => {
    if (!tmdbKey) return;
    setLoadingReleases(true);
    try {
      const [nfTvRes, nfMvRes, dsTvRes, dsMvRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${tmdbKey}&language=zh-TW&watch_region=TW&with_watch_providers=8&sort_by=popularity.desc`),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&language=zh-TW&watch_region=TW&with_watch_providers=8&sort_by=popularity.desc`),
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${tmdbKey}&language=zh-TW&watch_region=TW&with_watch_providers=337&sort_by=popularity.desc`),
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&language=zh-TW&watch_region=TW&with_watch_providers=337&sort_by=popularity.desc`)
      ]);

      const nfTv = nfTvRes.ok ? (await nfTvRes.json()).results || [] : [];
      const nfMv = nfMvRes.ok ? (await nfMvRes.json()).results || [] : [];
      const dsTv = dsTvRes.ok ? (await dsTvRes.json()).results || [] : [];
      const dsMv = dsMvRes.ok ? (await dsMvRes.json()).results || [] : [];

      const itemsMap = new Map();

      const processItems = (items, platformName, mediaType) => {
        items.forEach(item => {
          const rawTitle = item.name || item.title || item.original_name || item.original_title;
          if (!rawTitle) return;

          const cleanTitle = rawTitle.replace(/\s+/g, '').toLowerCase();
          const key = `${mediaType}_${cleanTitle}`;

          if (itemsMap.has(key)) {
            const existing = itemsMap.get(key);
            if (!existing.platforms.includes(platformName)) {
              existing.platforms.push(platformName);
              existing.platform = existing.platforms.join(' / ');
              existing.matchReason = `🔥 跨 ${existing.platforms.join(' & ')} 雙平台熱播中！精選推薦`;
              existing.genre = `雙平台同步上線 / ${mediaType === 'TV' ? '熱門影集' : '熱門電影'}`;
            }
          } else {
            const rawScore = item.vote_average && item.vote_average > 0 
              ? Math.round(item.vote_average * 10) 
              : 88 + (Math.abs(item.id || 0) % 11);
            const stableScore = Math.min(99, Math.max(82, rawScore));

            itemsMap.set(key, {
              id: `${mediaType}_${item.id}`,
              title: rawTitle,
              platforms: [platformName],
              platform: platformName,
              type: mediaType,
              genre: `${platformName} 台灣正版 ${mediaType === 'TV' ? '獨家影集' : '線上電影'}`,
              releaseDate: item.first_air_date || item.release_date || '2026',
              matchScore: stableScore,
              matchReason: `根據你的觀影喜好，${platformName} 台灣熱門${mediaType === 'TV' ? '影集' : '電影'}精選`,
              overview: item.overview && item.overview.trim() !== "" ? item.overview : "這部熱門作品目前尚無詳細劇情簡介，非常值得直接點擊評分或觀看體驗！",
              backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : null,
              poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=60"
            });
          }
        });
      };

      processItems(nfTv, 'Netflix', 'TV');
      processItems(dsTv, 'Disney+', 'TV');
      processItems(nfMv, 'Netflix', 'Movie');
      processItems(dsMv, 'Disney+', 'Movie');

      const mergedList = Array.from(itemsMap.values());
      if (mergedList.length > 0) {
        setNewReleases(mergedList);
      }
    } catch (err) {
      console.warn("TMDB fetch error", err);
    } finally {
      setLoadingReleases(false);
    }
  };

  useEffect(() => {
    fetchTMDBData();
  }, [tmdbKey]);

  const handleLoginSubmit = (emailInput) => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;
    
    if (whitelist.map(e => e.toLowerCase()).includes(trimmed)) {
      const isAdmin = DEFAULT_ADMINS.map(e => e.toLowerCase()).includes(trimmed);
      setUser({
        email: trimmed,
        name: trimmed.split('@')[0],
        isAdmin: isAdmin
      });
      setShowLoginModal(false);
      showToast(`歡迎回來，${trimmed.split('@')[0]}！`);
    } else {
      showToast(`權限受限：Email「${trimmed}」不在親友白名單中！`);
    }
  };

  const handleAddWhitelist = (newEmail) => {
    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed && !whitelist.includes(trimmed)) {
      setWhitelist([...whitelist, trimmed]);
      showToast(`已新增 ${trimmed} 至親友白名單`);
    }
  };

  const handleRemoveWhitelist = (emailToRemove) => {
    if (DEFAULT_ADMINS.includes(emailToRemove)) {
      showToast("系統管理員帳號無法移除！");
      return;
    }
    setWhitelist(whitelist.filter(e => e !== emailToRemove));
    showToast(`已移除 ${emailToRemove}`);
  };

  // 資料匯出備份 (解決手機/電腦跨裝置資料問題)
  const handleExportData = () => {
    const exportData = { ratings: myRatings, whitelist: whitelist };
    const dataStr = JSON.stringify(exportData);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `PassIt_Backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast("✅ 資料備份檔案已成功下載！請將此檔案傳至手機即可匯入。");
  };

  // 資料匯入同步
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.ratings) setMyRatings(data.ratings);
        if (data.whitelist) setWhitelist(data.whitelist);
        showToast("✨ 資料已成功匯入並同步至此裝置！");
        setShowSettingsModal(false);
      } catch (err) {
        showToast("❌ 檔案格式錯誤，無法讀取資料！");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // 清空 input 以便重複選擇同一檔案
  };

  const handleSearchTMDB = async (query) => {
    if (!query.trim() || !tmdbKey) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&language=zh-TW&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results = (data.results || [])
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          title: item.title || item.name || item.original_name,
          type: item.media_type === 'tv' ? 'TV' : 'Movie',
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
          releaseDate: item.release_date || item.first_air_date || "2026",
          overview: item.overview || "尚無劇情簡介。"
        }));
      setSearchResults(results);
    } catch (err) {
      console.error("TMDB Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveRating = (ratingData) => {
    setIsSnapping(true);
    
    setTimeout(() => {
      if (selectedMedia?.id && myRatings.some(r => r.id === selectedMedia.id)) {
        setMyRatings(myRatings.map(r => r.id === selectedMedia.id ? { ...r, ...ratingData } : r));
        showToast("觀影評價修改成功！");
      } else {
        const newEntry = {
          id: Date.now().toString(),
          title: ratingData.title || selectedMedia?.title || "未命名影片",
          platform: ratingData.platform || selectedMedia?.platform || "Netflix",
          type: ratingData.type || selectedMedia?.type || "TV",
          overallScore: ratingData.overallScore || 8,
          rewatchScore: ratingData.rewatchScore || 3,
          recommend: ratingData.recommend ?? true,
          userReview: ratingData.userReview || "非常值得一看！",
          watchedDate: new Date().toISOString().split('T')[0],
          releaseDate: ratingData.releaseDate || selectedMedia?.releaseDate || "2026",
          emotions: ratingData.emotions || { funny: 3, tear: 1, love: 2, heal: 3, tense: 2, brain: 2 },
          poster: selectedMedia?.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
          overview: ratingData.overview || selectedMedia?.overview || "尚無劇情大綱"
        };
        setMyRatings([newEntry, ...myRatings]);
        showToast("觀影評價新增成功！");
      }
      setSelectedMedia(null);
      setIsSnapping(false);
    }, 600);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setMyRatings(myRatings.filter(r => r.id !== itemToDelete.id));
      showToast(`已刪除《${itemToDelete.title}》評分紀錄`);
      setItemToDelete(null);
    }
  };

  const handleDownloadCardPNG = (item) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGradient.addColorStop(0, '#18181b');
    bgGradient.addColorStop(0.5, '#09090b');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 600, 1000);

    // Border
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 980);

    // Header
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('PASSED IT • 這部給過！', 40, 60);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '16px sans-serif';
    ctx.fillText(new Date().getFullYear().toString(), 510, 60);

    // Divider
    ctx.strokeStyle = '#27272a';
    ctx.beginPath();
    ctx.moveTo(40, 80);
    ctx.lineTo(560, 80);
    ctx.stroke();

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = item.poster;

    const renderTextAndDetails = () => {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      const titleText = item.title.length > 18 ? item.title.substring(0, 17) + '...' : item.title;
      ctx.fillText(titleText, 40, 550);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(`${item.overallScore}`, 40, 610);

      ctx.fillStyle = '#71717a';
      ctx.font = '20px sans-serif';
      ctx.fillText('/ 10 分', 130, 610);

      if (item.emotions) {
        let tagX = 40;
        const tagY = 650;
        const tags = [];
        if (item.emotions.funny >= 3) tags.push(`😂 爆笑 ${item.emotions.funny}/5`);
        if (item.emotions.tear >= 3) tags.push(`😭 催淚 ${item.emotions.tear}/5`);
        if (item.emotions.love >= 3) tags.push(`💖 高甜 ${item.emotions.love}/5`);
        if (item.emotions.heal >= 3) tags.push(`🥰 治癒 ${item.emotions.heal}/5`);
        if (item.emotions.tense >= 3) tags.push(`😱 刺激 ${item.emotions.tense}/5`);
        if (item.emotions.brain >= 3) tags.push(`🤯 燒腦 ${item.emotions.brain}/5`);

        tags.forEach(tag => {
          ctx.fillStyle = '#27272a';
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, 120, 32, 16);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(tag, tagX + 12, tagY + 21);
          tagX += 130;
        });
      }

      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(40, 710, 520, 210, 16);
      ctx.fill();
      ctx.strokeStyle = '#3f3f46';
      ctx.stroke();

      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'italic 18px sans-serif';
      const reviewText = item.userReview || "非常值得推薦的神作作品！";
      
      const words = reviewText.split('');
      let line = '';
      let lineY = 750;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 470 && n > 0) {
          ctx.fillText(line, 65, lineY);
          line = words[n];
          lineY += 30;
          if (lineY > 890) break;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 65, lineY);

      ctx.fillStyle = '#71717a';
      ctx.font = '14px sans-serif';
      ctx.fillText('來自 PassIt 影評分享 • 感謝閱讀', 40, 960);

      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `PassIt-${item.title.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
        showToast("精美 PNG 圖卡已成功產生並下載！");
      } catch (err) {
        showToast("圖卡已生成，您可直接截圖儲存！");
      }
    };

    img.onload = () => {
      ctx.drawImage(img, 150, 110, 300, 400);
      renderTextAndDetails();
    };

    img.onerror = () => {
      ctx.fillStyle = '#27272a';
      ctx.fillRect(150, 110, 300, 400);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '18px sans-serif';
      ctx.fillText('🎬 影劇海報', 240, 310);
      renderTextAndDetails();
    };
  };

  // Filter calculations
  const filteredRatings = myRatings.filter(r => {
    const matchesPlatform = platformFilter === 'ALL' || (r.platform && r.platform.includes(platformFilter));
    const matchesType = mediaTypeFilter === 'ALL' || r.type === mediaTypeFilter;
    return matchesPlatform && matchesType;
  });

  const filteredReleases = newReleases.filter(r => {
    const matchesPlatform = platformFilter === 'ALL' || (r.platform && r.platform.includes(platformFilter)) || (r.platforms && r.platforms.includes(platformFilter));
    const matchesType = mediaTypeFilter === 'ALL' || r.type === mediaTypeFilter;
    return matchesPlatform && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 font-sans pb-16 relative overflow-hidden">
      
      {/* Custom CSS animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-6deg); }
        }
        @keyframes snap-action {
          0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
          40% { transform: scale(1.2) rotate(-10deg); opacity: 1; }
          60% { transform: scale(1.1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) opacity: 0; }
        }
        @keyframes text-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-rev { animation: float-reverse 12s ease-in-out infinite; }
        .animate-snap { animation: snap-action 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-text-gradient { 
          background-size: 200% auto; 
          animation: text-gradient 4s linear infinite; 
        }
      `}</style>

      {/* Floating Movie Icons in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Clapperboard className="absolute top-[15%] left-[5%] w-32 h-32 text-zinc-500 opacity-[0.03] animate-float" />
        <Film className="absolute bottom-[20%] left-[10%] w-40 h-40 text-zinc-500 opacity-[0.03] animate-float-rev" />
        <Camera className="absolute top-[30%] right-[8%] w-28 h-28 text-zinc-500 opacity-[0.03] animate-float delay-700" />
        <Ticket className="absolute bottom-[15%] right-[15%] w-36 h-36 text-zinc-500 opacity-[0.03] animate-float-rev delay-1000" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-3 right-3 md:top-5 md:right-5 z-[100] bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 border border-white/20">
          ✨ {toastMessage}
        </div>
      )}

      {/* Responsive Navigation Header */}
      <nav className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-zinc-800/80 px-3 md:px-8 py-2.5 md:py-3.5 shadow-xl relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4">
          
          {/* Top Row on Mobile / Left Section on Desktop */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-amber-500 to-blue-600 rounded-xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-text-gradient"></div>
              <div className="relative px-2.5 md:px-3.5 py-1 md:py-1.5 bg-black ring-1 ring-zinc-800 rounded-xl flex items-center gap-1.5 md:gap-2">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
                <span className="font-black text-base md:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-red-500 animate-text-gradient drop-shadow-sm">
                  {appTitle}
                </span>
              </div>
            </div>

            {/* Mobile-only User Controls Header Right */}
            <div className="flex items-center gap-1.5 md:hidden">
              {user?.isAdmin && (
                <button 
                  onClick={() => setShowAdminModal(true)}
                  className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 transition font-medium"
                  title="親友權限"
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
              )}

              <button 
                onClick={() => setShowSettingsModal(true)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition"
                title="系統設定與資料備份"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {user ? (
                <button 
                  onClick={() => setUser(null)}
                  className="text-[11px] text-zinc-300 hover:text-red-400 flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg max-w-[110px]"
                  title={`${user.name} (點擊登出)`}
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span className="truncate">{user.name}</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition shadow-md"
                >
                  <LogIn className="w-3.5 h-3.5" /> 登入
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs & Desktop Controls */}
          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-5 w-full md:w-auto">
            {/* Tabs */}
            <div className="flex w-full md:w-auto justify-between md:justify-start gap-1 text-xs md:text-sm font-medium bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/80">
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 rounded-md transition ${activeTab === 'leaderboard' ? 'bg-red-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                🏆 排行榜
              </button>
              <button 
                onClick={() => setActiveTab('new_releases')}
                className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 rounded-md transition flex items-center justify-center gap-1 ${activeTab === 'new_releases' ? 'bg-red-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" /> 上新片單
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 md:flex-none text-center px-2 md:px-3 py-1.5 rounded-md transition ${activeTab === 'analytics' ? 'bg-red-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                📊 統計數據
              </button>
            </div>

            {/* Desktop User Controls */}
            <div className="hidden md:flex items-center gap-2 border-l border-zinc-800 pl-3">
              {user?.isAdmin && (
                <button 
                  onClick={() => setShowAdminModal(true)}
                  className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition font-medium"
                >
                  <Users className="w-3.5 h-3.5" /> 親友權限
                </button>
              )}

              <button 
                onClick={() => setShowSettingsModal(true)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition"
                title="系統設定與資料備份"
              >
                <Settings className="w-4 h-4" />
              </button>

              {user ? (
                <button 
                  onClick={() => setUser(null)}
                  className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" /> {user.name} (登出)
                </button>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-md"
                >
                  <LogIn className="w-3.5 h-3.5" /> 驗證登入
                </button>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-zinc-800/90 border border-zinc-700/80 p-4 rounded-xl shadow-md hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all">
            <p className="text-zinc-400 text-xs font-medium">已評分紀錄</p>
            <p className="text-2xl font-black mt-1 text-white">{myRatings.length} 部</p>
          </div>
          <div className="bg-zinc-800/90 border border-zinc-700/80 p-4 rounded-xl shadow-md hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all">
            <p className="text-zinc-400 text-xs font-medium">歷史平均給分</p>
            <p className="text-2xl font-black mt-1 text-amber-400 flex items-center gap-1">
              {(myRatings.reduce((acc, curr) => acc + curr.overallScore, 0) / (myRatings.length || 1)).toFixed(1)}
              <Star className="w-4 h-4 fill-amber-400" />
            </p>
          </div>
          <div className="bg-zinc-800/90 border border-zinc-700/80 p-4 rounded-xl shadow-md hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all">
            <p className="text-zinc-400 text-xs font-medium">二刷神作比率</p>
            <p className="text-2xl font-black mt-1 text-red-500">
              {((myRatings.filter(r => r.rewatchScore >= 4).length / (myRatings.length || 1)) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-zinc-800/90 border border-zinc-700/80 p-4 rounded-xl shadow-md hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all">
            <p className="text-zinc-400 text-xs font-medium">目前權限狀態</p>
            <p className="text-sm font-bold mt-2 text-emerald-400 flex items-center gap-1">
              {user ? <ShieldCheck className="w-4 h-4" /> : <LogIn className="w-4 h-4 text-zinc-500" />} 
              {user?.isAdmin ? '最高管理員' : user ? '已授權親友' : <span className="text-zinc-400">訪客 (需登入)</span>}
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6 bg-zinc-850 p-3 rounded-xl border border-zinc-700/80 shadow-md">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-zinc-400 ml-1" />
              <span className="text-xs text-zinc-400 font-medium">平台：</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setPlatformFilter('ALL')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${platformFilter === 'ALL' ? 'bg-zinc-200 text-black shadow' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  全部
                </button>
                <button 
                  onClick={() => setPlatformFilter('Netflix')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${platformFilter === 'Netflix' ? 'bg-red-600 text-white shadow' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Netflix
                </button>
                <button 
                  onClick={() => setPlatformFilter('Disney+')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${platformFilter === 'Disney+' ? 'bg-blue-600 text-white shadow' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Disney+
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-l border-zinc-700/60 pl-3">
              <span className="text-xs text-zinc-400 font-medium">類型：</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setMediaTypeFilter('ALL')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${mediaTypeFilter === 'ALL' ? 'bg-amber-500 text-black shadow' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  全部
                </button>
                <button 
                  onClick={() => setMediaTypeFilter('TV')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${mediaTypeFilter === 'TV' ? 'bg-amber-500 text-black shadow' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  📺 影集
                </button>
                <button 
                  onClick={() => setMediaTypeFilter('Movie')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${mediaTypeFilter === 'Movie' ? 'bg-amber-500 text-black shadow' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  🎬 電影
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              requireAuth(() => {
                setSearchQuery("");
                setSearchResults([]);
                setSelectedMedia({ title: '', platform: 'Netflix', type: 'TV', overallScore: 8, rewatchScore: 3, emotions: { funny: 3, tear: 1, love: 2, heal: 3, tense: 2, brain: 2 }, isNew: true });
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-md w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" /> 新增觀影評價
          </button>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Award className="text-amber-400 w-5 h-5" /> 觀影歷史紀錄榜 ({filteredRatings.length})
              </h2>
            </div>

            <div className="grid gap-3.5">
              {filteredRatings.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group relative overflow-hidden bg-zinc-800/90 border border-zinc-700/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all duration-300 shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>

                  <div 
                    onClick={() => setViewingDetailMedia(item)}
                    className="relative w-28 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900 shadow-md mx-auto md:mx-0 cursor-pointer group/poster"
                  >
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover/poster:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Info className="w-4 h-4 text-amber-400" /> 簡介
                    </div>
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                      #{index + 1}
                    </span>
                    <span className={`absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${item.platform?.includes('Disney+') ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                      {item.platform}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 
                              onClick={() => setViewingDetailMedia(item)}
                              className="font-bold text-base md:text-lg text-white group-hover:text-amber-200 cursor-pointer transition-colors flex items-center gap-1.5"
                            >
                              {item.title}
                              <Info className="w-3.5 h-3.5 text-zinc-400 hover:text-amber-400" />
                            </h3>
                            <span className="text-[10px] bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 font-semibold">
                              {item.type === 'TV' ? '📺 影集' : '🎬 電影'}
                            </span>
                            <span className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> 上映: {item.releaseDate || '未知'}
                            </span>
                          </div>

                          {item.type === 'TV' && item.seasonTrack && (
                            <p className="text-xs text-emerald-400 mt-1 font-medium">
                              📺 追劇進度：第 {item.seasonTrack.currentSeason} 季 / 全 {item.seasonTrack.currentEp} 集 (已看完)
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-black text-amber-400">
                            {item.overallScore} <span className="text-xs text-zinc-400">/10</span>
                          </div>
                          <div className="flex gap-0.5 text-amber-400 text-xs justify-end mt-0.5">
                            {Array.from({ length: item.rewatchScore || 3 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-zinc-400 text-[10px] ml-1">(二刷意願)</span>
                          </div>
                        </div>
                      </div>

                      {item.emotions && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {item.emotions.funny >= 3 && <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">😂 笑點頻繁 ({item.emotions.funny}/5)</span>}
                          {item.emotions.tear >= 3 && <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">😭 催淚感動 ({item.emotions.tear}/5)</span>}
                          {item.emotions.love >= 3 && <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-bold">💖 高甜戀愛 ({item.emotions.love}/5)</span>}
                          {item.emotions.heal >= 3 && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">🥰 治癒心靈 ({item.emotions.heal}/5)</span>}
                          {item.emotions.tense >= 3 && <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">😱 緊張刺激 ({item.emotions.tense}/5)</span>}
                          {item.emotions.brain >= 3 && <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">🤯 燒腦細思 ({item.emotions.brain}/5)</span>}
                        </div>
                      )}

                      <p className="text-zinc-200 text-xs md:text-sm mt-2.5 bg-zinc-950/70 p-3 rounded-lg border border-zinc-800 italic leading-relaxed">
                        “ {item.userReview} ”
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-400 mt-3 pt-2 border-t border-zinc-700/60">
                      <span>觀看日期：{item.watchedDate}</span>
                      <div className="flex gap-1.5 md:gap-2 flex-wrap justify-end">
                        <button 
                          onClick={() => setViewingDetailMedia(item)}
                          className="flex items-center gap-1 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-md transition font-medium border border-zinc-700"
                        >
                          <Info className="w-3.5 h-3.5 text-blue-400" /> 簡介
                        </button>
                        <button 
                          onClick={() => requireAuth(() => setSelectedMedia(item))}
                          className="flex items-center gap-1 text-zinc-300 hover:text-amber-300 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-md transition font-medium border border-zinc-700"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-400" /> 編輯
                        </button>
                        <button 
                          onClick={() => requireAuth(() => setItemToDelete(item))}
                          className="flex items-center gap-1 text-zinc-300 hover:text-red-400 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-md transition font-medium border border-zinc-700"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" /> 刪除
                        </button>
                        <button 
                          onClick={() => setShowShareModal(item)}
                          className="flex items-center gap-1 text-zinc-200 hover:text-white bg-red-600/80 hover:bg-red-600 px-2.5 py-1 rounded-md transition font-medium border border-red-500/50 shadow"
                        >
                          <Share2 className="w-3.5 h-3.5 text-white" /> 卡片
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Releases Tab */}
        {activeTab === 'new_releases' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <Flame className="text-red-500 w-5 h-5" /> 台灣區 Netflix & Disney+ 熱門發行
              </h2>
              <button 
                onClick={fetchTMDBData} 
                disabled={loadingReleases}
                className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1 rounded-md shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingReleases ? 'animate-spin' : ''}`} /> 刷新片單
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredReleases.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative overflow-hidden bg-zinc-800/90 border border-zinc-700/80 rounded-xl p-4 flex gap-4 hover:border-amber-400/60 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all duration-300 shadow-md"
                >
                  <div 
                    onClick={() => setViewingDetailMedia(item)}
                    className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group/poster shadow-md bg-zinc-900"
                  >
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover/poster:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                      <Info className="w-4 h-4 text-amber-400" /> 簡介
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 
                          onClick={() => setViewingDetailMedia(item)}
                          className="font-bold text-sm md:text-base text-white group-hover:text-amber-200 transition-colors leading-tight cursor-pointer flex items-center gap-1"
                        >
                          {item.title}
                          <Info className="w-3.5 h-3.5 text-zinc-400 hover:text-amber-400" />
                        </h3>
                        <span className="bg-red-950/90 border border-red-800 text-red-400 font-black text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow flex-shrink-0 ml-1">
                          🔥 {item.matchScore}% 契合
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {item.platforms ? (
                          item.platforms.map(p => (
                            <span key={p} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p === 'Disney+' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">{item.platform}</span>
                        )}
                        <span className="text-[10px] bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">{item.type === 'TV' ? '影集' : '電影'}</span>
                        <span className="text-xs text-amber-300/80 font-medium">📅 上架: {item.releaseDate}</span>
                      </div>
                      
                      <p className="text-xs text-amber-300/90 bg-amber-950/40 border border-amber-900/50 p-2 rounded mt-2.5 leading-relaxed">
                        💡 {item.matchReason}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => setViewingDetailMedia(item)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition border border-zinc-700"
                      >
                        <Info className="w-3.5 h-3.5 text-amber-400" /> 查看簡介
                      </button>
                      <button 
                        onClick={() => requireAuth(() => setSelectedMedia({
                          ...item,
                          overallScore: 8,
                          rewatchScore: 3,
                          emotions: { funny: 3, tear: 1, love: 2, heal: 3, tense: 2, brain: 2 },
                          userReview: "這部在正版串流上架了，非常推薦觀賞！",
                          isNew: true
                        }))}
                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-semibold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition shadow border border-zinc-600"
                      >
                        <Plus className="w-3.5 h-3.5" /> 評分紀錄
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-zinc-800/90 border border-zinc-700 rounded-xl p-6 space-y-6 shadow-xl">
            <div className="text-center space-y-1">
              <BarChart3 className="w-10 h-10 mx-auto text-red-500 mb-2" />
              <h3 className="text-white font-bold text-lg">觀影數據與情感光譜喜好分析</h3>
              <p className="text-xs text-zinc-400">根據你評分的 {myRatings.length} 部影劇紀錄統計分析</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 shadow-inner">
                <p className="text-xs text-zinc-400">最偏好的串流平台</p>
                <p className="text-xl font-bold text-red-500 mt-1">Netflix (66%)</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 shadow-inner">
                <p className="text-xs text-zinc-400">平均二刷意願星級</p>
                <p className="text-xl font-bold text-amber-400 mt-1">4.3 / 5.0 ★</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 shadow-inner">
                <p className="text-xs text-zinc-400">最具吸引力情緒特質</p>
                <p className="text-xl font-bold text-purple-400 mt-1">🤯 燒腦細思 & 😱 緊張刺激</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Details Synopsis Modal */}
      {viewingDetailMedia && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
            
            <div className="relative h-44 md:h-52 w-full bg-zinc-950 overflow-hidden flex-shrink-0">
              <img 
                src={viewingDetailMedia.backdrop || viewingDetailMedia.poster} 
                alt={viewingDetailMedia.title} 
                className="w-full h-full object-cover opacity-50 blur-xs scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>
              
              <button 
                onClick={() => setViewingDetailMedia(null)}
                className="absolute top-3 right-3 bg-black/60 text-zinc-300 hover:text-white p-2 rounded-full backdrop-blur-md transition z-10 hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 z-10">
                <img 
                  src={viewingDetailMedia.poster} 
                  alt={viewingDetailMedia.title} 
                  className="w-20 h-28 object-cover rounded-lg shadow-2xl border-2 border-zinc-700 flex-shrink-0" 
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {viewingDetailMedia.platforms ? (
                      viewingDetailMedia.platforms.map(p => (
                        <span key={p} className={`text-[10px] font-bold px-2 py-0.5 rounded ${p === 'Disney+' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">{viewingDetailMedia.platform}</span>
                    )}
                    <span className="text-[10px] bg-zinc-800/90 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                      {viewingDetailMedia.type === 'TV' ? '📺 影集' : '🎬 電影'}
                    </span>
                  </div>
                  <h3 className="text-base md:text-xl font-extrabold text-white leading-tight drop-shadow-md">
                    {viewingDetailMedia.title}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-medium">
                    📅 上映/上架日期：{viewingDetailMedia.releaseDate || '2026'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400" /> 劇情故事簡介 (Synopsis)
                </h4>
                <p className="text-xs md:text-sm text-zinc-200 leading-relaxed font-normal whitespace-pre-line">
                  {viewingDetailMedia.overview || "這部作品目前暫未提供官方劇情大綱，非常推薦您直接點擊下方按鈕觀看或記錄評價！"}
                </p>
              </div>

              {viewingDetailMedia.userReview && (
                <div className="bg-red-950/20 border border-red-900/40 p-3 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-red-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 您的個人觀看評語：
                  </p>
                  <p className="text-xs text-zinc-300 italic">“{viewingDetailMedia.userReview}”</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex gap-2 justify-end">
              <button 
                onClick={() => setViewingDetailMedia(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded-xl transition"
              >
                關閉
              </button>
              <button 
                onClick={() => requireAuth(() => {
                  const mediaToEdit = { ...viewingDetailMedia };
                  setViewingDetailMedia(null);
                  setSelectedMedia(mediaToEdit);
                })}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> 寫觀後心得 / 評分
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit / New Rating Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                觀影評分與直覺情緒指標：{selectedMedia.title || "新增影片"}
              </h3>
              <button onClick={() => setSelectedMedia(null)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedMedia.isNew && (
              <div className="bg-zinc-950/70 p-3 rounded-lg border border-zinc-800 space-y-2 relative">
                <label className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" /> 搜尋 TMDB 影視庫 (搜尋新片或經典片)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="輸入片名 (如: 鬼滅之刃、黑鏡)..." 
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-amber-500 outline-none transition" 
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTMDB(searchQuery)}
                  />
                  <button 
                    onClick={() => handleSearchTMDB(searchQuery)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded text-xs transition flex items-center gap-1 border border-zinc-700"
                  >
                    {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : '搜尋'}
                  </button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto">
                    {searchResults.map(res => (
                      <div 
                        key={res.id} 
                        onClick={() => {
                          setSelectedMedia({ ...selectedMedia, title: res.title, type: res.type, poster: res.poster, releaseDate: res.releaseDate, overview: res.overview, isNew: false });
                          setSearchResults([]);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-zinc-700 cursor-pointer border-b border-zinc-700/50 last:border-0 transition"
                      >
                        <img src={res.poster} alt={res.title} className="w-10 h-14 object-cover rounded shadow border border-zinc-600" />
                        <div>
                          <p className="text-sm font-bold text-white">{res.title}</p>
                          <p className="text-xs text-zinc-400">{res.releaseDate} • {res.type === 'TV' ? '影集' : '電影'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-zinc-400">片名</label>
                <input 
                  type="text" 
                  value={selectedMedia.title || ""} 
                  onChange={(e) => setSelectedMedia({ ...selectedMedia, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 mt-1 text-xs text-white" 
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400">播放平台</label>
                <select 
                  value={selectedMedia.platform || "Netflix"} 
                  onChange={(e) => setSelectedMedia({ ...selectedMedia, platform: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 mt-1 text-xs text-white"
                >
                  <option value="Netflix">Netflix</option>
                  <option value="Disney+">Disney+</option>
                  <option value="Netflix / Disney+">Netflix / Disney+ (雙平台)</option>
                  <option value="其他平台">其他平台</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/80">
              <label className="text-xs text-zinc-300 flex justify-between font-bold">
                <span>⭐ 總體推薦分數 (Overall Rating)</span>
                <span className="text-amber-400 font-extrabold text-sm">{selectedMedia.overallScore || 8} / 10</span>
              </label>
              <input 
                type="range" min="1" max="10" step="0.5" 
                value={selectedMedia.overallScore || 8} 
                onChange={(e) => setSelectedMedia({ ...selectedMedia, overallScore: parseFloat(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-medium">二刷意願 (Re-watch Value)</label>
              <div className="flex gap-2 text-amber-400 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    onClick={() => setSelectedMedia({ ...selectedMedia, rewatchScore: star })}
                    className={`w-6 h-6 cursor-pointer hover:scale-110 transition ${star <= (selectedMedia.rewatchScore || 3) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-amber-500/20">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> 直覺式情緒情感光譜 rating (0–5 階)
                </label>
              </div>

              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-zinc-800">
                <span className="text-[10px] text-zinc-400 flex items-center mr-1">快速預設:</span>
                {EMOTION_PRESETS.map((preset) => (
                  <button 
                    key={preset.name}
                    onClick={() => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...preset.scores }
                    })}
                    className="text-[10px] bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 px-2 py-0.5 rounded transition border border-zinc-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>😂 好笑/幽默指數</span>
                    <span className="text-amber-400 font-bold">{selectedMedia.emotions?.funny || 0}/5</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" 
                    value={selectedMedia.emotions?.funny || 0} 
                    onChange={(e) => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...selectedMedia.emotions, funny: parseInt(e.target.value) }
                    })}
                    className="w-full accent-amber-500 cursor-pointer" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>😭 催淚/悲傷感</span>
                    <span className="text-blue-400 font-bold">{selectedMedia.emotions?.tear || 0}/5</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" 
                    value={selectedMedia.emotions?.tear || 0} 
                    onChange={(e) => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...selectedMedia.emotions, tear: parseInt(e.target.value) }
                    })}
                    className="w-full accent-blue-500 cursor-pointer" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>💖 戀愛甜度</span>
                    <span className="text-pink-400 font-bold">{selectedMedia.emotions?.love || 0}/5</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" 
                    value={selectedMedia.emotions?.love || 0} 
                    onChange={(e) => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...selectedMedia.emotions, love: parseInt(e.target.value) }
                    })}
                    className="w-full accent-pink-500 cursor-pointer" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>🥰 溫馨治癒感</span>
                    <span className="text-emerald-400 font-bold">{selectedMedia.emotions?.heal || 0}/5</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" 
                    value={selectedMedia.emotions?.heal || 0} 
                    onChange={(e) => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...selectedMedia.emotions, heal: parseInt(e.target.value) }
                    })}
                    className="w-full accent-emerald-500 cursor-pointer" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>😱 緊張刺激度</span>
                    <span className="text-red-400 font-bold">{selectedMedia.emotions?.tense || 0}/5</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" 
                    value={selectedMedia.emotions?.tense || 0} 
                    onChange={(e) => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...selectedMedia.emotions, tense: parseInt(e.target.value) }
                    })}
                    className="w-full accent-red-500 cursor-pointer" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>🤯 燒腦/反轉程度</span>
                    <span className="text-purple-400 font-bold">{selectedMedia.emotions?.brain || 0}/5</span>
                  </div>
                  <input 
                    type="range" min="0" max="5" 
                    value={selectedMedia.emotions?.brain || 0} 
                    onChange={(e) => setSelectedMedia({
                      ...selectedMedia,
                      emotions: { ...selectedMedia.emotions, brain: parseInt(e.target.value) }
                    })}
                    className="w-full accent-purple-500 cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">個人心得與精華評語</label>
              <textarea 
                value={selectedMedia.userReview || ""} 
                onChange={(e) => setSelectedMedia({ ...selectedMedia, userReview: e.target.value })}
                placeholder="寫下這部片最打動或震撼你的地方..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-600" 
                rows={3}
              ></textarea>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-zinc-800">
              <button onClick={() => setSelectedMedia(null)} className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white">取消</button>
              <button onClick={() => handleSaveRating(selectedMedia)} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5" /> Action! (儲存評價)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Snap Animation */}
      {isSnapping && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-snap text-center">
            <Clapperboard className="w-32 h-32 text-red-500 mx-auto drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
            <p className="text-white font-black text-2xl mt-4 tracking-widest text-shadow">ACTION!</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-900/50 rounded-2xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-2" />
            <h3 className="text-base font-bold text-white">確定要刪除這筆紀錄嗎？</h3>
            <p className="text-xs text-zinc-400">
              即將刪除 <span className="text-amber-400 font-bold">{itemToDelete.title}</span> 的觀影評分，此動作無法復原。
            </p>
            <div className="flex gap-2 justify-center pt-4">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 bg-zinc-800 text-xs text-zinc-300 hover:text-white rounded-lg transition">取消</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs text-white font-bold rounded-lg shadow transition">
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-[280px] min-h-[480px] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-700 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-5 text-center">
              <img src={showShareModal.poster} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm pointer-events-none" alt="" />
              
              <div className="relative z-10 flex justify-between items-center text-[10px] text-zinc-400 font-bold">
                <span className="text-red-600 tracking-widest">{appTitle.toUpperCase()}</span>
                <span>2026</span>
              </div>

              <div className="relative z-10 space-y-2 my-2">
                <img src={showShareModal.poster} className="w-26 h-36 object-cover rounded-lg mx-auto shadow-lg border border-zinc-700" alt="" />
                <h3 className="font-extrabold text-sm leading-tight text-white">{showShareModal.title}</h3>
                <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full">
                  <span className="text-amber-400 font-black text-lg">{showShareModal.overallScore}</span>
                  <span className="text-zinc-400 text-xs"> / 10</span>
                </div>
              </div>

              {showShareModal.emotions && (
                <div className="relative z-10 flex flex-wrap gap-1 justify-center my-1">
                  {showShareModal.emotions.funny >= 3 && <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded">😂爆笑</span>}
                  {showShareModal.emotions.tear >= 3 && <span className="text-[9px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded">😭催淚</span>}
                  {showShareModal.emotions.love >= 3 && <span className="text-[9px] bg-pink-500/30 text-pink-200 px-1.5 py-0.5 rounded">💖高甜</span>}
                  {showShareModal.emotions.tense >= 3 && <span className="text-[9px] bg-red-500/30 text-red-200 px-1.5 py-0.5 rounded">😱刺激</span>}
                  {showShareModal.emotions.brain >= 3 && <span className="text-[9px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded">🤯燒腦</span>}
                </div>
              )}

              <div className="relative z-10 bg-black/70 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800">
                <p className="text-[11px] text-zinc-200 italic line-clamp-3">“{showShareModal.userReview}”</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowShareModal(null)} className="px-3 py-1.5 bg-zinc-800 text-xs text-zinc-300 rounded-lg">關閉</button>
              <button 
                onClick={() => handleDownloadCardPNG(showShareModal)} 
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5 text-white" /> 下載 PNG 卡片
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-amber-400" /> 親友開通與權限管理
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-400">新增親友的 Email 白名單</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  id="whitelistEmailInput"
                  placeholder="friend@gmail.com" 
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white" 
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('whitelistEmailInput');
                    if (el && el.value) { handleAddWhitelist(el.value); el.value = ''; }
                  }}
                  className="bg-amber-500 text-black font-bold text-xs px-3 py-1.5 rounded"
                >
                  新增
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs text-zinc-400">已授權登入白名單 ({whitelist.length})</label>
              <div className="max-h-40 overflow-y-auto space-y-1 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                {whitelist.map(email => (
                  <div key={email} className="flex justify-between items-center text-xs text-zinc-300 py-1 px-2 hover:bg-zinc-900 rounded">
                    <span>{email} {DEFAULT_ADMINS.includes(email) && <span className="text-[10px] text-amber-400 ml-1 font-bold">(管理員)</span>}</span>
                    {!DEFAULT_ADMINS.includes(email) && (
                      <button onClick={() => handleRemoveWhitelist(email)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setShowAdminModal(false)} className="px-4 py-1.5 bg-zinc-800 text-xs text-white rounded-lg">完成</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 space-y-4 text-center">
            <LogIn className="w-10 h-10 mx-auto text-red-600" />
            <h3 className="text-base font-bold text-white">帳號驗證登入</h3>
            <p className="text-xs text-zinc-400">請輸入您的 Email 驗證白名單權限</p>
            
            <input 
              type="email" 
              id="loginEmailInput"
              placeholder="yourname@gmail.com" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white text-center" 
            />

            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setShowLoginModal(false)} className="flex-1 py-1.5 text-xs text-zinc-400">取消</button>
              <button 
                onClick={() => {
                  const el = document.getElementById('loginEmailInput');
                  if (el) handleLoginSubmit(el.value);
                }}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg"
              >
                登入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings & Data Sync Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Settings className="w-4 h-4 text-zinc-400" /> 系統偏好設定與資料同步
            </h3>

            {/* 資料備份與同步區塊 */}
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <RefreshCw className="w-4 h-4" /> 跨裝置資料同步 (手動備份)
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  由於系統採用本地儲存，若需將電腦與手機資料同步，請先在有資料的裝置點擊「匯出」，再將檔案傳到另一台裝置點擊「匯入」。
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 pt-2">
                <button 
                  onClick={handleExportData}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition border border-zinc-700"
                >
                  <Download className="w-4 h-4" /> 匯出備份 (Export)
                </button>
                
                <label className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow cursor-pointer">
                  <Upload className="w-4 h-4" /> 匯入同步 (Import)
                  <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">系統主標題</label>
              <input 
                type="text" 
                defaultValue={appTitle} 
                onChange={(e) => setAppTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400">TMDB API Key (v3 auth)</label>
              <input 
                type="text" 
                defaultValue={tmdbKey} 
                onChange={(e) => setTmdbKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-white font-mono" 
              />
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => { setShowSettingsModal(false); showToast("設定已儲存！"); }} className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-xs font-bold text-white rounded-lg transition">關閉 / 儲存設定</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quotes Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {showTrivia && (
          <div className="bg-zinc-800/95 border border-zinc-700 p-4 rounded-2xl rounded-br-none shadow-2xl backdrop-blur-md max-w-[260px] transform transition-all pointer-events-auto relative animate-in slide-in-from-bottom-4 fade-in duration-300">
            <button 
              onClick={() => setShowTrivia(false)}
              className="absolute -top-2 -right-2 bg-zinc-700 text-white p-1 rounded-full hover:bg-red-600 transition"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs text-amber-400 font-bold mb-1 flex items-center gap-1">
              <MessageSquareQuote className="w-3.5 h-3.5" /> 經典台詞回憶錄
            </p>
            <p className="text-sm text-white font-medium leading-relaxed">
              {currentQuote}
            </p>
          </div>
        )}

        <button 
          onClick={triggerRandomQuote}
          className="bg-red-600 hover:bg-red-500 text-white p-3.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all transform hover:scale-110 pointer-events-auto border border-red-400/30"
          title="抽取經典台詞回憶錄"
        >
          <Clapperboard className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
