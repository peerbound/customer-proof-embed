import { PublicStory } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  CardExpandableText,
  CardTextContent,
} from "./ui/card";
import { useShowMore } from "../hooks/useShowMore";
import { Attribution } from "./ui/attribution";
import { useOptions } from "@/providers/OptionsContext";

interface StoryCardProps {
  story: PublicStory;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  const {
    title,
    quote: { text, contact },
    account,
    occurred_at,
    url,
  } = story;

  const { textRef, isExpanded, onExpand } = useShowMore();
  const { hideDates } = useOptions();

  return (
    <Card>
      <CardContent>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <CardTitle>{title}</CardTitle>
        </a>

        <CardTextContent>
          <CardExpandableText ref={textRef} isExpanded={isExpanded}>
            {text}
          </CardExpandableText>
        </CardTextContent>

        <Attribution contact={contact} account={account} />
      </CardContent>

      <CardFooter
        onExpand={onExpand}
        date={hideDates.includes("story") ? undefined : occurred_at}
        link={{ text: "Customer Story", url }}
      />
    </Card>
  );
};
