import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import App from './App';
import './index.css'; // Ensure this line is present

// Optional Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-300">
          <div className="p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Something Went Wrong</h2>
            <p className="text-gray-600">Please try again later or contact support.</p>
            <a href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
              Go Back Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </ErrorBoundary>
  </React.StrictMode>
);