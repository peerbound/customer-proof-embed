import { PublicMoment } from "@/lib/schemas";
import {
  Card,
  CardFooter,
  CardExpandableText,
  CardTextContent,
} from "./ui/card";
import { useMemo } from "preact/hooks";
import { getDomain } from "tldts";
import { useShowMore } from "../hooks/useShowMore";
import { Attribution } from "./ui/attribution";

interface MomentCardProps {
  moment: PublicMoment;
}

export const MomentCard = ({ moment }: MomentCardProps) => {
  const { text, contact, account, occurred_at: occurredAt, url } = moment;
  const { textRef, isExpanded, onExpand } = useShowMore();

  const link = useMemo(() => {
    if (!url) return;
    const domain = url ? getDomain(url) : undefined;

    switch (domain) {
      case "linkedin.com":
        return { text: "LinkedIn Post", url };
      case "youtube.com":
        return { text: "YouTube Video", url };
    }
  }, [url]);

  return (
    <Card>
      <Attribution contact={contact} account={account} />

      <CardTextContent>
        <CardExpandableText ref={textRef} isExpanded={isExpanded}>
          {text}
        </CardExpandableText>
      </CardTextContent>

      <CardFooter onExpand={onExpand} date={occurredAt} link={link} />
    </Card>
  );
};
