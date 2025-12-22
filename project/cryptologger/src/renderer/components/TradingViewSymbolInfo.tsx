import { useEffect, useRef } from 'react';

interface TradingViewSymbolInfoProps {
    symbol: string;
    theme?: 'light' | 'dark';
}

export default function TradingViewSymbolInfo({ symbol, theme = 'dark' }: TradingViewSymbolInfoProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const initWidget = () => {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "symbol": symbol.includes(':') ? symbol : `BINANCE:${symbol}USDT`,
                "width": "100%",
                "locale": "en",
                "colorTheme": theme,
                "isTransparent": true
            });
            container.appendChild(script);
        };

        const timeoutId = setTimeout(initWidget, 100);

        return () => {
            clearTimeout(timeoutId);
            container.innerHTML = '';
        };
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={containerRef} style={{ width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}
