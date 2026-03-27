import { useRef, useState, useEffect } from "preact/hooks";

export const useShowMore = () => {
  const textRef = useRef<HTMLDivElement>(null);

  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const showExpandButton = isTruncated && !isExpanded;

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current && !isExpanded) {
        const isTextTruncated =
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setIsTruncated(isTextTruncated);
      } else {
        setIsTruncated(false);
      }
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isExpanded]);

  return {
    textRef,
    isExpanded,
    onExpand: showExpandButton ? () => setIsExpanded(true) : undefined,
  };
};
