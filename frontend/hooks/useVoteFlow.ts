"use client";

import { useCallback, useMemo, useState } from "react";
import { VOTE_STEPS, type VoteStepKey } from "@/lib/constants";

export type VoteFlowState = {
  n1: string;
  n2: string;
  voteValue: string;
  signature?: string;
};

export function useVoteFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<VoteFlowState>({
    n1: "",
    n2: "",
    voteValue: "",
  });

  const currentStep: VoteStepKey = VOTE_STEPS[stepIndex].key;

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, VOTE_STEPS.length - 1));
  }, []);

  const back = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((key: VoteStepKey) => {
    const idx = VOTE_STEPS.findIndex((s) => s.key === key);
    if (idx >= 0) setStepIndex(idx);
  }, []);

  const update = useCallback((patch: Partial<VoteFlowState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    setState({ n1: "", n2: "", voteValue: "" });
  }, []);

  return useMemo(
    () => ({ stepIndex, currentStep, state, next, back, goTo, update, reset }),
    [stepIndex, currentStep, state, next, back, goTo, update, reset],
  );
}
