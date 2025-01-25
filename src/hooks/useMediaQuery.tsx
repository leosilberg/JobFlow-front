import { useCallback, useEffect, useState } from "react";

export default function useMediaQuery(width) {
  const [targetReached, setTargetReached] = useState(true);

  const updateTarget = useCallback((e) => {
    setTargetReached(e.matches);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (!media.matches) setTargetReached(false);

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
}
