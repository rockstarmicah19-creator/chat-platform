/**
 * Theme Module
 * Handles theme switching and persistence
 */

const THEME_KEY = 'chatHub_theme';
const DEFAULT_THEME = 'discord';

export const THEMES = {
    discord: 'Discord Dark',
    whatsapp: 'WhatsApp Green',
    light: 'Light Mode',
    rainbow_neon: 'Rainbow Neon',
    nebula: 'Space Nebula',
    fire: 'Fire Theme',
    dragon: 'Dragon Theme',
    ai: 'AI Theme',
    discord_purple: 'Discord Purple',
    cyberpunk: 'Cyberpunk',
    forest: 'Forest',
    ocean: 'Ocean'
};

/**
 * Initialize theme system
 */
export function initThemes() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
}

/**
 * Apply theme by name
 */
export function applyTheme(themeName) {
    const html = document.documentElement;
    
    // Remove all theme classes
    Object.keys(THEMES).forEach(theme => {
        html.classList.remove(`theme-${theme}`);
    });
    
    // Add new theme class
    html.classList.add(`theme-${themeName}`);
    
    // Save preference
    localStorage.setItem(THEME_KEY, themeName);
    
    console.log(`Theme switched to: ${themeName}`);
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
    return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

/**
 * Get all available themes
 */
export function getAvailableThemes() {
    return THEMES;
}
