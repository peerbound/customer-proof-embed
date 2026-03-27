import { PublicAccount, PublicContact } from "@/lib/schemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Avatar, AvatarImage } from "./avatar";
import { AccountLogo } from "./account-logo";
import { useImages } from "@/providers/ImageContext";

interface AttributionProps {
  contact: PublicContact;
  account: PublicAccount;
}

export const Attribution = ({ contact, account }: AttributionProps) => {
  const {
    name: contactName,
    job_title: jobTitle,
    linkedin_profile: linkedinProfile,
  } = contact;

  const { name: accountName } = account;
  const { logoUrl, photoUrl } = useImages();

  return (
    <div part="attribution" className="flex items-center gap-3">
      {(photoUrl || logoUrl) && (
        <>
          {photoUrl ? (
            <div className="relative">
              <Avatar className="size-14">
                <AvatarImage src={photoUrl} alt={contactName} />
              </Avatar>

              {logoUrl && (
                <AccountLogo
                  src={logoUrl}
                  alt={accountName}
                  size="sm"
                  className="absolute -bottom-0.5 -right-0.5"
                />
              )}
            </div>
          ) : logoUrl ? (
            <AccountLogo src={logoUrl} alt={accountName} size="lg" />
          ) : null}
        </>
      )}

      <div className="flex flex-col gap-0.5">
        <div part="attribution-name" className="text-base font-medium">
          <span>
            {contactName}
            {linkedinProfile && (
              <a
                href={linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1.5 text-secondary hover:text-primary transition-colors inline-flex items-center h-lh align-top"
              >
                <FontAwesomeIcon icon={faLinkedin} className="size-3.5" />
              </a>
            )}
          </span>
        </div>

        <div className="text-sm text-secondary flex flex-col gap-0.5">
          {jobTitle && <p part="attribution-title">{jobTitle}</p>}

          <p part="attribution-company">{accountName}</p>
        </div>
      </div>
    </div>
  );
};
