import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes';
import CallManager from './components/CallManager/CallManager';

function App() {
  return (
    <Router>
      <CallManager />
      <MainLayout
        headerProps={{
          title: 'Acharya Pandit JI',
          showOnlineStatus: true,
        }}
      >
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;