document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-msg');
    const gateScreen = document.getElementById('gate-screen');
    const revealScreen = document.getElementById('reveal-screen');
    const inputGroup = document.querySelector('.input-group');

    // The magic date
    const TARGET_DATE = "05-05-2024";

    function checkPassword() {
        const value = passwordInput.value.trim();
        
        if (value === TARGET_DATE) {
            success();
        } else {
            fail();
        }
    }

    function success() {
        // Play sound
        playSuccessSound();

        // UI Transitions
        errorMsg.classList.add('hidden');
        
        // 1. Fade out gate
        gateScreen.classList.remove('active');
        gateScreen.classList.add('hidden');

        // 2. Wait a split second, then fade in reveal
        setTimeout(() => {
            revealScreen.classList.remove('hidden');
            revealScreen.classList.add('active');
        }, 500); // Matches CSS transition speed roughly
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
        
        // Clear input? Maybe not, easier to fix a typo if it stays.
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
