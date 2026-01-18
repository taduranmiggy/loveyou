import React from 'react';

function TestApp() {
  return (
    <div style={{ padding: '20px', background: 'pink', minHeight: '100vh' }}>
      <h1>🦫 LoveYou Test Page</h1>
      <p>If you can see this, React is working!</p>
      <p>Testing Firebase and API...</p>
      <button onClick={() => {
        console.log('Testing API import...');
        import('./utils/api.js').then(api => {
          console.log('API loaded:', api);
          console.log('Database status:', api.default.getDatabaseStatus());
        }).catch(error => {
          console.error('API import failed:', error);
        });
      }}>
        Test API Import
      </button>
    </div>
  );
}

export default TestApp;
