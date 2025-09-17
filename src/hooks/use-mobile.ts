import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		if (typeof window === "undefined") return;

		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

		const onChange = (e: MediaQueryListEvent) => {
			setIsMobile(e.matches);
		};

		setIsMobile(mql.matches);
		mql.addEventListener("change", onChange);

		return () => mql.removeEventListener("change", onChange);
	}, []);

	return isMobile;
}
