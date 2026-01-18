import React from 'react';
import { Toaster } from 'react-hot-toast';

const NotificationRenderer: React.FC = () => {
  return (
    <>
      {/* React Hot Toast Container with Custom Styling */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          // Default options for all toasts
          duration: 5000,
          style: {
            background: 'transparent',
            color: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
            maxWidth: '500px',
          },
          // Success toasts
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          // Error toasts
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          // Loading toasts
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#6366f1',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      {/* Portal for custom notification components */}
      <div
        id="notification-portal"
        className="fixed inset-0 pointer-events-none z-50"
      >
        {/* This div will be used by notification components to render */}
        <div className="flex flex-col items-center justify-start pt-4 h-full">
          {/* Custom notifications will be rendered here */}
        </div>
      </div>
    </>
  );
};

export default NotificationRenderer;
