import { useEffect, useRef } from 'react';

interface TradingViewSymbolOverviewProps {
    symbols?: any;
    theme?: 'light' | 'dark';
}

export default function TradingViewSymbolOverview({
    symbols = [
        [
            "Crypto",
            [
                ["Binance:BTCUSDT"],
                ["Binance:ETHUSDT"],
                ["Binance:SOLUSDT"],
                ["Binance:ADAUSDT"],
                ["Binance:DOTUSDT"]
            ]
        ],
        [
            "Indices",
            [
                ["FOREXCOM:SPX500"],
                ["FOREXCOM:NSXUSD"],
                ["FOREXCOM:DJI"],
                ["INDEX:DXY"]
            ]
        ]
    ],
    theme = 'dark'
}: TradingViewSymbolOverviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        const initWidget = () => {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                "colorTheme": theme,
                "dateRange": "12M",
                "showChart": true,
                "locale": "en",
                "width": "100%",
                "height": "100%",
                "largeChartUrl": "",
                "isTransparent": true,
                "showSymbolLogo": true,
                "showFloatingTooltip": false,
                "tabs": symbols.map(([title, items]: any) => ({
                    "title": title,
                    "symbols": items.map(([s]: any) => ({ "s": s })),
                    "originalTitle": title
                }))
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
        <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}
