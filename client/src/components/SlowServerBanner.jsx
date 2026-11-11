import React, { useEffect, useState } from 'react';
import { subscribeSlowRequest } from '../api.js';

export default function SlowServerBanner() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    return subscribeSlowRequest((slow) => {
      setIsSlow(slow);
    });
  }, []);

  if (!isSlow) return null;

  return (
    <div className="slow-banner" role="status" aria-live="polite">
      <div className="slow-banner-spinner" aria-hidden="true" />
      <span>
        Waking up the server. Free hosting sleeps when idle, so the first load can take up to a minute.
      </span>
    </div>
  );
}
