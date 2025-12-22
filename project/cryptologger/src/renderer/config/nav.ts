export interface NavItem {
    path: string;
    icon: string;
    label: string;
    color: string; // CSS variable name e.g., 'var(--color-cyan)'
}

export const navItems: NavItem[] = [
    { path: '/', icon: '📊', label: 'Dashboard', color: 'var(--color-cyan)' },
    { path: '/trades', icon: '📈', label: 'Trade History', color: 'var(--color-pink)' },
    { path: '/manual-entry', icon: '✏️', label: 'Manual Entry', color: 'var(--color-yellow)' },
    { path: '/wallets', icon: '👛', label: 'Wallets', color: 'var(--color-green)' },
    { path: '/reports', icon: '📄', label: 'Reports', color: 'var(--color-purple)' },
    { path: '/ai-oracle', icon: '🧠', label: 'AI Oracle', color: 'var(--color-cyan)' },
    { path: '/settings', icon: '⚙️', label: 'Settings', color: 'var(--color-text-muted)' }
];
