// StrictMode: component from React core library
// development tool: highlights potential problems
import { StrictMode } from 'react'
//new React 18+ API for rendering React apps
import { createRoot } from 'react-dom/client'
//root component of the application
import App from './App.tsx'
import './global.css'

// Find DOM element with id "root" in index.html
// The "!" (non-null assertion operator) tells TypeScript this element definitely exists
// returns the HTMLElement that serves as the mounting point for the React app
createRoot(document.getElementById('root')!)
  // Call the render method to mount the React application
  .render(
  // Wrap the entire app in StrictMode for development checks
  // StrictMode does NOT render any visible UI, it's just a wrapper 
  //Detects bugs via double rendering (development only)
  //Warns about deprecated APIs
  //Identifies side effects (unsafe code)
  //Fully inactive in production (no performance impact) 
  <StrictMode>
    {/* Render the main App component inside StrictMode */}
    <App />
  </StrictMode>,
)
