import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
    symbol: string;
    theme?: 'light' | 'dark';
    autosize?: boolean;
}

export default function TradingViewChart({ symbol, theme = 'dark', autosize = true }: TradingViewChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef(`tv-chart-${symbol.replace(/[^a-zA-Z0-9]/g, '-')}-${Math.random().toString(36).substring(7)}`);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Clear previous widget
        container.innerHTML = '';

        const initWidget = () => {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = () => {
                if (typeof window.TradingView !== 'undefined' && document.getElementById(widgetId.current)) {
                    new window.TradingView.widget({
                        "autosize": autosize,
                        "symbol": symbol.includes(':') ? symbol : `BINANCE:${symbol}USDT`,
                        "interval": "D",
                        "timezone": "Etc/UTC",
                        "theme": theme,
                        "style": "1",
                        "locale": "en",
                        "toolbar_bg": "#f1f3f6",
                        "enable_publishing": false,
                        "hide_side_toolbar": false,
                        "allow_symbol_change": true,
                        "container_id": widgetId.current,
                        "backgroundColor": "rgba(0, 0, 0, 1)",
                        "gridColor": "rgba(0, 242, 255, 0.06)",
                    });
                }
            };
            container.appendChild(script);
        };

        // Hydration delay for Electron stability
        const timeoutId = setTimeout(initWidget, 100);

        return () => {
            clearTimeout(timeoutId);
            container.innerHTML = '';
        };
    }, [symbol, theme, autosize]);

    return (
        <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
            <div id={widgetId.current} style={{ height: '100%', width: '100%' }} />
        </div>
    );
}
