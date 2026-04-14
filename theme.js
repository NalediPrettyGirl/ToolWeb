(function() {
     const API_URL = 'https://tool-api-3.onrender.com';

    // 1. Immediate Theme Application from LocalStorage (to avoid FOUC)
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        ThemeManager.updateIcons();
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);

    // 2. Theme Management Logic
    window.ThemeManager = {
        getTheme: () => document.documentElement.getAttribute('data-bs-theme'),
        
        setTheme: async (theme, syncWithServer = true) => {
            applyTheme(theme);
            
            if (syncWithServer) {
                try {
                    await fetch(`${API_URL}/api/auth/settings`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ theme })
                    });
                } catch (err) {
                    console.warn('Failed to sync theme with server');
                }
            }
            
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        },
        
        toggle: () => {
            const newTheme = window.ThemeManager.getTheme() === 'dark' ? 'light' : 'dark';
            window.ThemeManager.setTheme(newTheme);
        },
        
        updateIcons: () => {
            const theme = window.ThemeManager.getTheme();
            const icons = document.querySelectorAll('.theme-toggle-btn i, .theme-toggle i, #themeToggle i, #themeToggleDesk i, #themeToggleMobile i');
            icons.forEach(icon => {
                if (theme === 'dark') {
                    icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
                    icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
                    icon.classList.replace('bi-moon', 'bi-sun');
                } else {
                    icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
                    icon.classList.replace('bi-sun', 'bi-moon');
                    icon.classList.replace('bi-moon-stars-fill', 'bi-moon-stars-fill'); // Ensure default
                }
            });
        },
        
        initToggles: () => {
            document.querySelectorAll('.theme-toggle-btn, .theme-toggle, #themeToggle, #themeToggleDesk, #themeToggleMobile').forEach(btn => {
                // Remove existing listeners by cloning
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.ThemeManager.toggle();
                });
            });
            window.ThemeManager.updateIcons();
        },

        syncFromServer: async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/me`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.isLoggedIn && data.theme) {
                        applyTheme(data.theme);
                    }
                }
            } catch (err) {
                console.warn('Sync from server failed');
            }
        }
    };

    // 3. Auto-init
    document.addEventListener('DOMContentLoaded', () => {
        window.ThemeManager.initToggles();
        window.ThemeManager.syncFromServer();
    });

    window.ThemeManager.syncFromServer = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                if (data.isLoggedIn && data.theme) {
                    applyTheme(data.theme);
                }
            }
        } catch (err) {
            console.warn('Sync from server failed');
        }
    };
})();
