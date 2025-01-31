import { useEffect } from "react";

function useGoogleAnalytics() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-5EKY1EDJ14";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-5EKY1EDJ14");
  }, []);
}

export default useGoogleAnalytics;
