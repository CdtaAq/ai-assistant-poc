// src/hooks/useFakeWS.js
import { useEffect } from "react";

export function useFakeWS(onMessage) {
  useEffect(() => {
    const fakeMsgs = [
      { type: "partial_transcript", text: "I want a ref" },
      { type: "final_transcript", text: "I want a refund for my order" },
      {
        type: "assistant_events",
        events: [
          {
            type: "kb_citation",
            text: "Refunds take 5–7 days – Policy, Page 3",
          },
        ],
      },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < fakeMsgs.length) {
        onMessage(fakeMsgs[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [onMessage]);
}
