import React from "react"

import type { ModelPricing } from "../../services/apiService"

interface ModelItemDescriptionProps {
  model: ModelPricing
  isAvailableForUser: boolean
}

export const ModelItemDescription: React.FC<ModelItemDescriptionProps> = ({
  model,
  isAvailableForUser
}) => {
  if (!model.model_description) {
    return null
  }

  return (
    <div className="mb-2">
      <p
        className={`text-sm leading-relaxed ${
          isAvailableForUser ? "text-gray-600" : "text-gray-400"
        } overflow-hidden`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}
        title={model.model_description}>
        {model.model_description}
      </p>
    </div>
  )
}
