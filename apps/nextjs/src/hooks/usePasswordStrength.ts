import { useDeferredValue, useEffect, useState } from "react";
import type { ZxcvbnResult } from "@zxcvbn-ts/core";
import { zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";

import { catchError } from "~/utils/error";

const options = {
  useLevenshteinDistance: true,
};
zxcvbnOptions.setOptions(options);

export const usePasswordStrength = () => {
  const [result, setResult] = useState<ZxcvbnResult | null>(null);
  // result.score  # Integer from 0-4 (useful for implementing a strength bar)
  const [password, setPassword] = useState("");
  // NOTE: useDeferredValue is React v18 only, for v17 or lower use debouncing
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    zxcvbnAsync(deferredPassword)
      .then((response) => setResult(response))
      .catch((err) => catchError(err));
  }, [deferredPassword]);

  return { passwordScore: result ? result.score * 25 : 0, setPassword };
};
