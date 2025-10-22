import { BodySmall, Button, Card, CardContent, Heading5 } from "~/components/ui"

export interface LinkCardProps {
  Icon: any
  title: string
  description: string
  href: string
  buttonText: string
  buttonVariant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "success"
    | "warning"
  iconClass?: string
}

const LinkCard = ({
  Icon,
  title,
  description,
  href,
  buttonText,
  buttonVariant = "default",
  iconClass = "text-gray-900 dark:text-gray-100"
}: LinkCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Icon className={`w-6 h-6 mt-1 flex-shrink-0 ${iconClass}`} />
          <div className="flex-1">
            <Heading5 weight={"medium"} className="mb-2">
              {title}
            </Heading5>
            <BodySmall className="mb-3">{description}</BodySmall>
            <Button asChild variant={buttonVariant} size="sm">
              <a href={href} target="_blank" rel="noopener noreferrer">
                {buttonText}
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LinkCard
