document.addEventListener('DOMContentLoaded', () => {
    const cookieContainer = document.getElementById('cookie-container');
    const messageContainer = document.getElementById('message-container');
    const fortuneText = document.getElementById('fortune-text');
    const resetBtn = document.getElementById('reset-btn');

    const API_KEY = 'AIzaSyA-RastBw9ju9bW0AhuuhMvZEFOWqBC65I'; // Note: In a production app, use a backend proxy to hide this key.

    let isCracked = false;

    cookieContainer.addEventListener('click', async () => {
        if (isCracked) return; // Prevent multiple clicks

        // 1. Animation & FX
        cookieContainer.classList.add('cracked');
        createParticles(cookieContainer);
        isCracked = true;

        // 2. Show Loading State
        fortuneText.textContent = "운세를 읽는 중...";
        messageContainer.classList.remove('hidden'); // Show container immediately for loading text

        try {
            // 3. Call Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "재치 있고 희망찬 포춘 쿠키 문구 1개를 한글로 작성해줘. 이모지 1개를 포함해줘."
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || response.statusText || 'Unknown Error';
                throw new Error(`API Error: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text;

            // 4. Update UI with Result
            fortuneText.textContent = generatedText;

        } catch (error) {
            console.error('Error:', error);

            let errorMessage = "운세를 불러오지 못했습니다. 다시 시도해주세요. 😥";

            if (window.location.protocol === 'file:') {
                errorMessage = "⚠️ 로컬 파일(file://)에서는 보안 문제로 API 호출이 차단될 수 있습니다.\nVS Code의 'Live Server' 확장 프로그램 등을 사용하여 실행해주세요.";
            } else {
                errorMessage += `\n(에러 내용: ${error.message})`;
            }

            fortuneText.innerText = errorMessage; // Use innerText to handle newlines
        } finally {
            // Show reset button regardless of success/failure
            resetBtn.classList.remove('hidden');
            resetBtn.style.display = 'inline-block';
        }
    });

    resetBtn.addEventListener('click', () => {
        // Reset state
        cookieContainer.classList.remove('cracked');
        resetBtn.classList.add('hidden');
        resetBtn.style.display = 'none';

        // Hide message container after animation
        setTimeout(() => {
            isCracked = false;
            messageContainer.classList.add('hidden');
            fortuneText.textContent = "운세를 불러오는 중...";
        }, 500); // Wait for close animation
    });

    function createParticles(container) {
        const particleCount = 60; // Increased count
        const colors = ['#FF6F61', '#F4C430', '#D2691E', '#FFF8E1', '#FF8A80', '#FFFFFF'];

        // Flash effect
        const flash = document.createElement('div');
        flash.classList.add('flash');
        container.appendChild(flash);
        setTimeout(() => flash.remove(), 500);

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random position near center
            const x = 150 + (Math.random() - 0.5) * 60;
            const y = 150 + (Math.random() - 0.5) * 60;

            // Random size
            const size = Math.random() * 12 + 6; // 6px to 18px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Random destination (further out)
            const tx = (Math.random() - 0.5) * 500;
            const ty = (Math.random() - 0.5) * 500;
            const r = (Math.random() - 0.5) * 720; // Rotation

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--r', `${r}deg`);

            // Random duration and delay
            const duration = 0.6 + Math.random() * 0.6;
            particle.style.animation = `pop ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;

            container.appendChild(particle);

            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }
    }
});
