import React, { useEffect } from "react";
import mermaid from "mermaid";

export interface MermaidProps {
  text: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ text }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5
    });
  });

  useEffect(() => {
    (async () => {
        if (ref.current && text !== "") {
        const {svg} = await mermaid.render("preview", text);
        ref.current.innerHTML = svg;
        }
    })();
  }, [text]);

  return <div key="preview" ref={ref} />;
};
