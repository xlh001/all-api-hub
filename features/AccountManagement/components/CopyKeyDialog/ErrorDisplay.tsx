import { useTranslation } from "react-i18next"

import { Alert, Button } from "~/components/ui"

interface ErrorDisplayProps {
  error: string
  onRetry: () => void
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const { t } = useTranslation("ui")

  return (
    <Alert variant="destructive">
      <div>
        <h3 className="font-medium mb-1">{t("dialog.copyKey.getFailed")}</h3>
        <p className="text-sm mb-3">{error}</p>
        <Button onClick={onRetry} variant="destructive" size="sm">
          {t("dialog.copyKey.retry")}
        </Button>
      </div>
    </Alert>
  )
}
