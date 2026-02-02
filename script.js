document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const agreeBtn = document.getElementById('agree-btn');
    const errorMsg = document.getElementById('error-msg');
    
    // Screens
    const gateScreen = document.getElementById('gate-screen');
    const tickerScreen = document.getElementById('ticker-screen');
    const agreementScreen = document.getElementById('agreement-screen');
    const posterScreen = document.getElementById('poster-screen');
    const revealScreen = document.getElementById('reveal-screen');

    // Ticker Elements
    const yearCounter = document.getElementById('year-counter');

    // Poster Image for effects
    const posterImg = document.querySelector('.reveal-poster');
    
    const inputGroup = document.querySelector('.input-group');

    // The magic date
    const TARGET_DATE = "05-05-2024";

    function checkPassword() {
        const value = passwordInput.value.trim();
        
        if (value === TARGET_DATE) {
            startTickerSequence();
        } else {
            fail();
        }
    }

    // Step 1: Password -> Ticker Sequence
    function startTickerSequence() {
        playSuccessSound();

        // Hide Gate
        errorMsg.classList.add('hidden');
        gateScreen.classList.remove('active');
        gateScreen.classList.add('hidden');

        // Show Ticker
        tickerScreen.classList.remove('hidden');
        tickerScreen.classList.add('active');

        // Animate Numbers
        let currentYear = 2024;
        const target = "FUTURE"; 
        const speed = 50; // ms per tick

        const interval = setInterval(() => {
            currentYear++;
            yearCounter.innerText = currentYear;

            // Random glitch effect on text sometimes?
            // Keep it simple for now.

            if (currentYear >= 2099) {
                clearInterval(interval);
                yearCounter.innerText = target;
                yearCounter.classList.add('glitch-effect'); // Reuse glitch class lightly
                
                // Hold for a moment then go to Agreement
                setTimeout(() => {
                    yearCounter.classList.remove('glitch-effect');
                    goToAgreement();
                }, 1500);
            }
        }, speed);
    }

    // Step 2: Ticker -> Agreement
    function goToAgreement() {
        // Fade out Ticker
        tickerScreen.classList.remove('active');
        tickerScreen.classList.add('hidden');

        // Fade in Agreement
        setTimeout(() => {
            agreementScreen.classList.remove('hidden');
            agreementScreen.classList.add('active');
            
            // Start Particles
            initParticles();
        }, 500); 
    }

    // Step 3: Transition from Agreement -> Poster -> Reveal
    function goToReveal() {
        // Fade out Agreement
        agreementScreen.classList.remove('active');
        agreementScreen.classList.add('hidden');

        // Sequence: Poster -> Glitch -> Final Link
        setTimeout(() => {
            // 1. Show Poster
            posterScreen.classList.remove('hidden');
            posterScreen.classList.add('active');

            // 2. Wait for user to absorb the image (3.5s)
            setTimeout(() => {
                // 3. Trigger Glitch Effect
                posterImg.classList.add('glitch-effect');
                
                playGlitchSound();

                // 4. Hold Glitch for 1.5s then cut to black
                setTimeout(() => {
                    posterScreen.classList.remove('active');
                    posterScreen.classList.add('hidden'); // Fade out poster

                    // 5. Show Final Reveal
                    setTimeout(() => {
                        revealScreen.classList.remove('hidden');
                        revealScreen.classList.add('active');
                    }, 800); 
                    
                }, 1500);

            }, 4000); 

        }, 500);
    }

    // --- Particle System ---
    function initParticles() {
        console.log("Memory Fragments (Particles) System: Initialized");
        const container = document.getElementById('particles-container');
        const words = ["FASHION", "DREAMS", "YOUR EYES", "FUTURE", "J:RA"];
        
        // Spawn a particle every 800ms
        setInterval(() => {
            if (!agreementScreen.classList.contains('active')) return; // Stop if screen hidden

            console.log("Spawning particle...");
            const span = document.createElement('span');
            span.classList.add('particle');
            span.innerText = words[Math.floor(Math.random() * words.length)];
            
            // Random positioning
            span.style.left = Math.random() * 80 + 10 + "%"; // 10% to 90% width
            
            // Random size variation
            const scale = Math.random() * 0.5 + 0.8;
            span.style.fontSize = scale + "rem";

            // Random Animation Duration
            const duration = Math.random() * 10 + 10 + "s"; // 10-20s float
            span.style.animationDuration = duration;

            container.appendChild(span);

            // Cleanup
            setTimeout(() => {
                span.remove();
            }, 20000); // Remove after max animation time
        }, 800);
    }


    function playGlitchSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            [100, 110, 120, 800, 1200].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth'; 
                osc.frequency.value = freq;
                
                const now = ctx.currentTime;
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                
                osc.stop(now + 0.5);
            });
        } catch(e) {}
    }

    function fail() {
        errorMsg.classList.remove('hidden');
        inputGroup.classList.add('shake');
        setTimeout(() => {
            inputGroup.classList.remove('shake');
        }, 500);
    }

    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return; 
            
            const ctx = new AudioContext();
            const notes = [523.25, 659.25, 783.99, 987.77]; 
            
            notes.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine'; 
                osc.frequency.value = freq;
                
                const startTime = ctx.currentTime + (index * 0.1);
                const duration = 2.0;

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1); 
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); 

                osc.stop(startTime + duration);
            });

        } catch (e) {
            console.error("Audio playback failed", e);
        }
    }

    // Event Listeners
    unlockBtn.addEventListener('click', checkPassword);
    agreeBtn.addEventListener('click', goToReveal);

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    passwordInput.addEventListener('input', () => {
        errorMsg.classList.add('hidden');
    });
});
