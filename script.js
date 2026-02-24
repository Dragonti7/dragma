document.addEventListener('DOMContentLoaded', () => {
    const cookieContainer = document.getElementById('cookie-container');
    const messageContainer = document.getElementById('message-container');
    const fortuneText = document.getElementById('fortune-text');
    const resetBtn = document.getElementById('reset-btn');
    const statContainer = document.getElementById('stat-container');

    // Stat elements
    const statWealth = document.getElementById('stat-wealth');
    const valWealth = document.getElementById('val-wealth');
    const critWealth = document.getElementById('crit-wealth');

    const statLove = document.getElementById('stat-love');
    const valLove = document.getElementById('val-love');
    const critLove = document.getElementById('crit-love');

    const statHealth = document.getElementById('stat-health');
    const valHealth = document.getElementById('val-health');
    const critHealth = document.getElementById('crit-health');

    let isCracked = false;
    let availableFortunes = [];
    let isNightMode = false;

    // Standard Day Fortune Messages
    const dayFortunePool = [
        "오늘 점심은 정말 맛있는 걸 먹게 될 거예요. 🍔",
        "생각지도 못한 곳에서 행운이 찾아옵니다. 🍀",
        "지나간 일에 미련을 갖지 마세요. 더 좋은 게 오고 있어요. ✨",
        "당신의 미소는 누군가에게 큰 힘이 됩니다. 😊",
        "잠시 휴식을 취하세요. 충전이 필요합니다. 🔋",
        "오늘은 로또를 사보는 건 어떨까요? 5등 당첨 확률이 높습니다! 🎱",
        "가까운 친구에게 연락해보세요. 좋은 일이 생길 거예요. 📞",
        "작은 친절이 큰 보상으로 돌아올 것입니다. 🎁",
        "오늘은 평소보다 조금 더 과감해져도 좋습니다. 💪",
        "걱정하지 마세요. 모든 것이 순조롭게 해결될 것입니다. 🌊",
        "새로운 취미를 시작하기에 완벽한 날입니다. 🎨",
        "당신의 잠재력은 무한합니다. 스스로를 믿으세요. 🚀",
        "뜻밖의 선물을 받게 될지도 모릅니다. 🎀",
        "어려운 문제는 의외로 단순하게 해결될 수 있습니다. 🔑",
        "당신은 충분히 잘하고 있습니다. 자신을 칭찬해주세요. 👏",
        "행운의 색깔은 '파란색'입니다. 💙",
        "오늘은 커피 대신 차를 마셔보는 건 어떨까요? 🍵",
        "당신의 아이디어가 빛을 발할 순간이 왔습니다. 💡",
        "긍정적인 생각이 긍정적인 결과를 만듭니다. ➕",
        "오늘은 나를 위한 작은 사치를 부려보세요. 🛍️",
        "오해는 대화로 풀 수 있습니다. 먼저 다가가 보세요. 🤝",
        "당신의 열정이 주변 사람들에게 영감을 줍니다. 🔥",
        "오늘은 일찍 퇴근하고 푹 쉬세요. 🏠",
        "코딩하다가 에러가 나도 당황하지 마세요. 해결책은 구글에 있습니다. 💻",
        "오늘은 깃허브 잔디를 심기에 좋은 날입니다. 🌿"
    ];

    // Secret Night Fortune Messages
    const nightFortunePool = [
        "밤이 깊었습니다. 야식이 강력하게 당길 시간입니다. 🍜",
        "지금 깨어있는 당신만이 이 오묘한 기운을 받을 수 있습니다. 🌙",
        "오늘 밤꾼 꿈은 내일의 로또 번호일지도 모릅니다. 💭",
        "어둠 속에서 당신의 재능이 더 빛을 발합니다. ✨",
        "달빛이 당신의 고민을 조용히 씻어내고 있습니다. 🌊",
        "새벽 감성에 쓴 글은 내일 아침에 지우게 될 수 있습니다. 📝",
        "조용한 밤, 미뤄뒀던 아이디어가 떠오를 시간입니다. 💡",
        "내일 아침 알람을 하나 더 맞추는 것을 추천합니다. ⏰",
        "야행성 올빼미족의 특권! 아무도 모르는 행운이 찾아옵니다. 🦉",
        "타락한 달빛 쿠키가 당신에게 특별한 영감을 선사합니다. 🔮"
    ];

    function checkNightMode() {
        const hour = new Date().getHours();
        // Night mode between 22:00 (10 PM) and 04:00 (4 AM)
        if (hour >= 22 || hour < 4) {
            isNightMode = true;
            document.body.classList.add('night-mode');
        } else {
            isNightMode = false;
            document.body.classList.remove('night-mode');
        }
    }

    function refillFortunes() {
        const pool = isNightMode ? nightFortunePool : dayFortunePool;
        availableFortunes = [...pool].sort(() => Math.random() - 0.5);
    }

    // Initialize environment
    checkNightMode();
    refillFortunes();

    // Optional: Re-check night mode periodically (e.g., every minute)
    setInterval(checkNightMode, 60000);

    // Create God Rays element dynamically
    const godRays = document.createElement('div');
    godRays.classList.add('god-rays');
    cookieContainer.appendChild(godRays);

    // Dynamic background text container
    const bgTextContainer = document.createElement('div');
    bgTextContainer.id = 'bg-text-container';
    document.querySelector('.container').appendChild(bgTextContainer);

    // Keyboard support for accessibility (Enter or Space key)
    cookieContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            crackCookie();
        }
    });

    cookieContainer.addEventListener('click', crackCookie);

    async function generateAbsorbText() {
        const textToAbsorb = "우주의 기운을 모으는 중... ✨";
        const letters = textToAbsorb.split('');

        bgTextContainer.innerHTML = '';
        bgTextContainer.style.display = 'block';

        const rect = cookieContainer.getBoundingClientRect();
        const cookieCenterX = rect.left + rect.width / 2;
        const cookieCenterY = rect.top + rect.height / 2;

        letters.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.classList.add('absorb-letter');

            const angle = Math.random() * Math.PI * 2;
            const distance = 250 + Math.random() * 150;
            const startX = cookieCenterX + Math.cos(angle) * distance;
            const startY = cookieCenterY + Math.sin(angle) * distance;

            span.style.left = `${startX}px`;
            span.style.top = `${startY}px`;

            const tx = cookieCenterX - startX;
            const ty = cookieCenterY - startY;

            span.style.setProperty('--tx', `${tx}px`);
            span.style.setProperty('--ty', `${ty}px`);

            const delay = Math.random() * 0.8;
            span.style.animationDelay = `${delay}s`;

            bgTextContainer.appendChild(span);
        });

        await new Promise(resolve => setTimeout(resolve, 1800));
        bgTextContainer.style.display = 'none';
        bgTextContainer.innerHTML = '';
    }

    // Reset stats to 0 instantly
    function resetStats() {
        statContainer.classList.add('hidden');
        [statWealth, statLove, statHealth].forEach(bar => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
        });
        [valWealth, valLove, valHealth].forEach(val => val.textContent = '0%');
        [critWealth, critLove, critHealth].forEach(crit => crit.classList.add('hidden'));
    }

    // Generate random stats and animate them
    function animateStats() {
        statContainer.classList.remove('hidden');

        // Ensure transition is re-enabled after reset
        setTimeout(() => {
            [statWealth, statLove, statHealth].forEach(bar => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            });

            // Random values between 10 and 100
            const wVal = Math.floor(Math.random() * 91) + 10;
            const lVal = Math.floor(Math.random() * 91) + 10;
            const hVal = Math.floor(Math.random() * 91) + 10;

            statWealth.style.width = `${wVal}%`;
            statLove.style.width = `${lVal}%`;
            statHealth.style.width = `${hVal}%`;

            // Animate numbers
            animateCounter(valWealth, wVal);
            animateCounter(valLove, lVal);
            animateCounter(valHealth, hVal);

            // Show critical labels if high score
            if (wVal >= 95) setTimeout(() => critWealth.classList.remove('hidden'), 1500);
            if (lVal >= 95) setTimeout(() => critLove.classList.remove('hidden'), 1500);
            if (hVal >= 95) setTimeout(() => critHealth.classList.remove('hidden'), 1500);
        }, 50);
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 1500; // ms
        const interval = 30; // ms
        const step = target / (duration / interval);

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = `${Math.floor(current)}%`;
        }, interval);
    }

    async function crackCookie() {
        if (isCracked) return;
        isCracked = true;

        resetStats();
        cookieContainer.classList.add('shake');
        messageContainer.classList.add('hidden');

        await generateAbsorbText();
        cookieContainer.classList.remove('shake');

        cookieContainer.classList.add('cracked');
        createParticles();
        createCuteCharacters();
        messageContainer.classList.remove('hidden');

        if (availableFortunes.length === 0) refillFortunes();
        fortuneText.textContent = availableFortunes.pop();

        // Trigger stat bar animations right after text appears
        animateStats();

        setTimeout(() => {
            resetBtn.classList.remove('hidden');
        }, 1500);
    }

    resetBtn.addEventListener('click', () => {
        cookieContainer.classList.remove('cracked');
        resetBtn.classList.add('hidden');

        setTimeout(() => {
            isCracked = false;
            messageContainer.classList.add('hidden');
            fortuneText.textContent = "운세를 불러오는 중...";
            resetStats();
        }, 600);
    });

    function createParticles() {
        const particleCount = 150;
        const dayColors = ['#FF6F61', '#F4C430', '#D2691E', '#FFF8E1', '#FF8A80', '#FFFFFF', '#FFD700', '#FFA07A'];
        const nightColors = ['#B39DDB', '#D1C4E9', '#7E57C2', '#FFFFFF', '#FFEB3B', '#9575CD']; // purples and star yellows
        const colors = isNightMode ? nightColors : dayColors;

        const shapes = ['circle', 'square', 'star'];

        const flash = document.createElement('div');
        flash.classList.add('flash');
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 1000);

        const rect = document.getElementById('cookie-container').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 15 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            if (shape === 'circle') {
                particle.style.borderRadius = '50%';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            } else if (shape === 'square') {
                particle.style.borderRadius = '2px';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            } else if (shape === 'star') {
                particle.style.borderRadius = '0';
                particle.style.backgroundColor = isNightMode ? '#FFEB3B' : '#FFD700';
                particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            }

            const startX = centerX + (Math.random() - 0.5) * 20;
            const startY = centerY + (Math.random() - 0.5) * 20;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            const angle = Math.random() * Math.PI * 2;
            const velocity = 300 + Math.random() * 800;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            const r = (Math.random() - 0.5) * 1080;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--r', `${r}deg`);

            const duration = 1 + Math.random() * 0.8;
            particle.style.animation = `pop ${duration}s cubic-bezier(0.1, 1, 0.3, 1) forwards`;

            document.body.appendChild(particle);

            setTimeout(() => { particle.remove(); }, duration * 1000);
        }
    }

    function createCuteCharacters() {
        const dayEmojis = ['🧚', '🐉', '🐼', '😺', '🐰', '🦄', '🍀', '🐥', '🦊', '🐢'];
        const nightEmojis = ['🦉', '🦇', '🐺', '🌙', '🌌', '✨', '👻', '👾'];
        const charEmojis = isNightMode ? nightEmojis : dayEmojis;

        const charCount = 5 + Math.floor(Math.random() * 4);

        const rect = document.getElementById('cookie-container').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < charCount; i++) {
            const charEl = document.createElement('div');
            charEl.classList.add('cute-character');

            charEl.textContent = charEmojis[Math.floor(Math.random() * charEmojis.length)];
            charEl.style.left = `${centerX - 20}px`;
            charEl.style.top = `${centerY - 20}px`;

            const sprayAngle = Math.PI + (Math.random() * Math.PI);
            const distance = 150 + Math.random() * 200;
            const tx = Math.cos(sprayAngle) * distance;
            const ty = Math.sin(sprayAngle) * distance;
            const r = (Math.random() - 0.5) * 720;

            charEl.style.setProperty('--tx', `${tx}px`);
            charEl.style.setProperty('--ty', `${ty}px`);
            charEl.style.setProperty('--r', `${r}deg`);

            const duration = 1.2 + Math.random() * 0.8;
            const delay = Math.random() * 0.2;

            charEl.style.animation = `jump-out ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards`;

            document.body.appendChild(charEl);

            setTimeout(() => { charEl.remove(); }, (duration + delay) * 1000);
        }
    }
});
