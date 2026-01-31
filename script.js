document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const agreeBtn = document.getElementById('agree-btn');
    const errorMsg = document.getElementById('error-msg');
    
    // Screens
    const gateScreen = document.getElementById('gate-screen');
    const agreementScreen = document.getElementById('agreement-screen');
    const posterScreen = document.getElementById('poster-screen');
    const revealScreen = document.getElementById('reveal-screen');

    // Poster Image for effects
    const posterImg = document.querySelector('.reveal-poster');
    
    const inputGroup = document.querySelector('.input-group');

    // The magic date
    const TARGET_DATE = "05-05-2024";

    function checkPassword() {
        const value = passwordInput.value.trim();
        
        if (value === TARGET_DATE) {
            goToAgreement();
        } else {
            fail();
        }
    }

    // Step 1: Transition from Password -> Agreement
    function goToAgreement() {
        // Play success sound
        playSuccessSound();

        // UI Transitions
        errorMsg.classList.add('hidden');
        
        // Fade out gate
        gateScreen.classList.remove('active');
        gateScreen.classList.add('hidden');

        // Fade in Agreement
        setTimeout(() => {
            agreementScreen.classList.remove('hidden');
            agreementScreen.classList.add('active');
        }, 500); 
    }

    // Step 2: Transition from Agreement -> Poster -> Reveal
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
                
                // Play a little synth "static" or just reuse a note? 
                // Let's reuse a quick dissonance note for effect
                playGlitchSound();

                // 4. Hold Glitch for 1.5s then cut to black
                setTimeout(() => {
                    posterScreen.classList.remove('active');
                    posterScreen.classList.add('hidden'); // Fade out poster

                    // 5. Show Final Reveal
                    setTimeout(() => {
                        revealScreen.classList.remove('hidden');
                        revealScreen.classList.add('active');
                    }, 800); // Slight delay for dramatic pause
                    
                }, 1500);

            }, 4000); 

        }, 500);
    }

    function playGlitchSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Dissonant Cluster
            [100, 110, 120, 800, 1200].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth'; // Harsh sound
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
        // Show error
        errorMsg.classList.remove('hidden');
        
        // Shake animation
        inputGroup.classList.add('shake');
        
        // Remove shake class after animation so it can trigger again
        setTimeout(() => {
            inputGroup.classList.remove('shake');
        }, 500);
    }

    // Audio Context for the "Chime"
    function playSuccessSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return; // Browser doesn't support
            
            const ctx = new AudioContext();
            
            // Notes for a C Major 7 chord (C5, E5, G5, B5) - dreamy/premium
            const notes = [523.25, 659.25, 783.99, 987.77]; 
            
            notes.forEach((freq, index) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine'; // Sine is smooth and clean
                osc.frequency.value = freq;
                
                // Stagger starts slightly for a "strum" effect
                const startTime = ctx.currentTime + (index * 0.1);
                const duration = 2.0;

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                
                // Envelope
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1); // Attack
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

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
    
    // Clear error when user starts typing again
    passwordInput.addEventListener('input', () => {
        errorMsg.classList.add('hidden');
    });
});
