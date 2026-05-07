"use client";

import { Stepper } from "@/components/ui/Stepper";
import { Card, CardContent } from "@/components/ui/Card";
import { useVoteFlow } from "@/hooks/useVoteFlow";
import { VOTE_STEPS } from "@/lib/constants";
import { StepN1 } from "./StepN1";
import { StepChoose } from "./StepChoose";
import { StepN2 } from "./StepN2";
import { StepSubmit } from "./StepSubmit";
import { StepDone } from "./StepDone";

export function VoteFlow() {
  const flow = useVoteFlow();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10">
      <Stepper steps={[...VOTE_STEPS]} currentIndex={flow.stepIndex} />

      <div className="gradient-border rounded-2xl">
        <Card variant="glass" className="overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {flow.currentStep === "n1" && (
              <StepN1
                initial={flow.state.n1}
                onSubmit={(n1) => {
                  flow.update({ n1 });
                  flow.next();
                }}
              />
            )}

            {flow.currentStep === "choose" && (
              <StepChoose
                initial={flow.state.voteValue}
                onBack={flow.back}
                onSubmit={(voteValue) => {
                  flow.update({ voteValue });
                  flow.next();
                }}
              />
            )}

            {flow.currentStep === "n2" && (
              <StepN2
                initial={flow.state.n2}
                onBack={flow.back}
                onSubmit={(n2) => {
                  flow.update({ n2 });
                  flow.next();
                }}
              />
            )}

            {flow.currentStep === "submit" && (
              <StepSubmit
                n1={flow.state.n1}
                n2={flow.state.n2}
                voteValue={flow.state.voteValue}
                onBack={flow.back}
                onSuccess={(signature) => {
                  flow.update({ signature });
                  flow.next();
                }}
              />
            )}

            {flow.currentStep === "done" && (
              <StepDone signature={flow.state.signature} onReset={flow.reset} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
