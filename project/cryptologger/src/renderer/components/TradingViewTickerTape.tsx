import { useEffect, useRef } from 'react';

interface TradingViewTickerTapeProps {
    symbols?: { proName: string; title: string }[];
    theme?: 'light' | 'dark';
}

export default function TradingViewTickerTape({
    symbols = [
        { "proName": "BINANCE:BTCUSDT", "title": "BTC/USDT" },
        { "proName": "BINANCE:ETHUSDT", "title": "ETH/USDT" },
        { "proName": "BINANCE:SOLUSDT", "title": "SOL/USDT" },
        { "proName": "FX_IDC:AUDUSD", "title": "AUD/USD" }
    ],
    theme = 'dark'
}: TradingViewTickerTapeProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const initWidget = () => {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "symbols": symbols,
                "showSymbolLogo": true,
                "colorTheme": theme,
                "isTransparent": true,
                "displayMode": "adaptive",
                "locale": "en"
            });
            container.appendChild(script);
        };

        const timeoutId = setTimeout(initWidget, 100);

        return () => {
            clearTimeout(timeoutId);
            container.innerHTML = '';
        };
    }, [symbols, theme]);

    return (
        <div className="tradingview-widget-container" ref={containerRef} style={{ height: '46px', width: '100%', overflow: 'hidden' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}
