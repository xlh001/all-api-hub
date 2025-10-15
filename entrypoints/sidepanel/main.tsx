import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"

import "../../utils/i18n" // Import the i18n configuration

import App from "./App.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
)
