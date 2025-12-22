import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../config/nav';

interface NodeToolbarProps {
    onHover?: (label: string | null) => void;
    onSyncClick?: () => void;
}

export default function NodeToolbar({ onHover, onSyncClick }: NodeToolbarProps) {
    const location = useLocation();

    return (
        <div className="hub-toolbar">
            {navItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`node-tile-sm ${location.pathname === item.path ? 'active' : ''}`}
                    style={{
                        '--tile-color': item.color,
                        '--tile-color-rgb': item.color.replace('var(', '').replace(')', '')
                    } as any}
                    onMouseEnter={() => onHover?.(item.label)}
                    onMouseLeave={() => onHover?.(null)}
                >
                    <div className="tile-icon">{item.icon}</div>
                    <div className="tile-label">{item.label}</div>
                </Link>
            ))}

            <div
                className="node-tile-sm"
                style={{ '--tile-color': 'var(--color-green)' } as any}
                onClick={onSyncClick}
            >
                <div className="tile-icon">🔌</div>
                <div className="tile-label">SYNC</div>
            </div>
        </div>
    );
}
