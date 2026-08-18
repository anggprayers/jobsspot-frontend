import Script from "next/script";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const isValidMeasurementId = Boolean(measurementId && /^G-[A-Z0-9]+$/i.test(measurementId));

export default function GoogleAnalytics() {
    if (!measurementId || !isValidMeasurementId) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
                strategy="afterInteractive"
            />
            <Script id="jobs-spot-google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${measurementId}');
                `}
            </Script>
        </>
    );
}
