import { ReviewCard } from "./ReviewCard";
import { StoryCard } from "./StoryCard";
import { MomentCard } from "./MomentCard";
import { PublicEvent } from "@/lib/schemas";
import { logError } from "@/utils/logger";

interface EventCardProps {
  event: PublicEvent;
}

export const EventCard = ({ event }: EventCardProps) => {
  const eventType = event.event_type;

  switch (eventType) {
    case "moment":
      return <MomentCard moment={event} />;
    case "review":
      return <ReviewCard review={event} />;
    case "story":
      return <StoryCard story={event} />;
    default: {
      const unhandledEventType: never = eventType;
      logError(`Unhandled event type: ${JSON.stringify(unhandledEventType)}`);
    }
  }
};
