import { PublicReview } from "@/lib/schemas";
import {
  Card,
  CardTitle,
  CardQuestionLabel,
  CardFooter,
  CardTextContent,
  CardExpandableText,
  CardContent,
} from "./ui/card";
import { useShowMore } from "../hooks/useShowMore";
import { Attribution } from "./ui/attribution";
import { ReviewHeading, ReviewStars } from "./ui/review";

interface ReviewCardProps {
  review: PublicReview;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const {
    title,
    answers: [firstAnswer],
    star_rating: starRating,
    contact,
    account,
    occurred_at: occurredAt,
    url,
  } = review;

  const { textRef, isExpanded, onExpand } = useShowMore();

  return (
    <Card>
      <Attribution contact={contact} account={account} />

      <CardContent>
        <ReviewHeading>
          <ReviewStars starRating={starRating} />
          <CardTitle>{title}</CardTitle>
        </ReviewHeading>

        <CardTextContent>
          <CardQuestionLabel>{firstAnswer.question}</CardQuestionLabel>
          <CardExpandableText ref={textRef} isExpanded={isExpanded}>
            {firstAnswer.answer}
          </CardExpandableText>
        </CardTextContent>
      </CardContent>

      <CardFooter
        onExpand={onExpand}
        date={occurredAt}
        link={{ text: "G2 Review", url }}
      />
    </Card>
  );
};
