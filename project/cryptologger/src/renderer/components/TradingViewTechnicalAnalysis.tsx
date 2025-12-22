import { useEffect, useRef } from 'react';

interface TradingViewTechnicalAnalysisProps {
    symbol: string;
    theme?: 'light' | 'dark';
}

export default function TradingViewTechnicalAnalysis({ symbol, theme = 'dark' }: TradingViewTechnicalAnalysisProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const initWidget = () => {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "interval": "1D",
                "width": "100%",
                "isTransparent": true,
                "height": "100%",
                "symbol": symbol.includes(':') ? symbol : `BINANCE:${symbol}USDT`,
                "showIntervalTabs": true,
                "locale": "en",
                "colorTheme": theme
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
        <div className="tradingview-widget-container" ref={containerRef} style={{ height: '380px', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}
