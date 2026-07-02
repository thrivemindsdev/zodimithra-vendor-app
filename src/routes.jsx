import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Messages from './pages/Messages/Messages';
import ChatRoom from './pages/Messages/ChatRoom';
import Earnings from './pages/Earnings/Earnings';
import Profile from './pages/Profile/Profile';
import Tools from './pages/Tools/Tools';
import Live from './pages/Live/Live';
import VideoCall from './pages/VideoCall/VideoCall';
import AudioCall from './pages/AudioCall/AudioCall';
import Bookings from './pages/Bookings/Bookings';
import Onboarding from './pages/Onboarding/Onboarding';
import Loading from './pages/Loading/Loading';
import KundliMatching from './pages/KundliMatching/KundliMatching';
import MuhurthFinder from './pages/MuhurthFinder/MuhurthFinder';
import PlanetaryPositions from './pages/PlanetaryPositions/PlanetaryPositions';
import VastuCompass from './pages/VastuCompass/VastuCompass';
import Otp from './pages/Otp/Otp';
import NumerologyCalculator from './pages/NumerologyCalculator/NumerologyCalculator';
import GemstoneGuide from './pages/GemstoneGuide/GemstoneGuide';
import RemedyGuide from './pages/RemedyGuide/RemedyGuide';
import PlanetaryAvastas from './pages/PlanetaryAvastas/PlanetaryAvastas';
import AtlasDaylightSaving from './pages/AtlasDaylightSaving/AtlasDaylightSaving';
import TransitCalendar from './pages/TransitCalendar/TransitCalendar';
import KundliGenerator from './pages/KundliGenerator/KundliGenerator';
import DashaCalculator from './pages/DashaCalculator/DashaCalculator';
import RashiGuide from './pages/RashiGuide/RashiGuide';
import NazhikaConverter from './pages/NazhikaConverter/NazhikaConverter';
import Prashna from './pages/Prashna/Prashna';
import YogasDetector from './pages/YogasDetector/YogasDetector';
import JaiminiAstrology from './pages/JaiminiAstrology/JaiminiAstrology';
import DasaDetails from './pages/DasaDetails/DasaDetails';
import AstroReport from './pages/AstroReport/AstroReport';
import TransitAlerts from './pages/TransitAlerts/TransitAlerts';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/otp" element={<PublicRoute><Otp /></PublicRoute>} />
      <Route path="/loading" element={<PublicRoute><Loading /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/messages/chat/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
      <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute><Live /></ProtectedRoute>} />
      <Route path="/video-call" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
      <Route path="/audio-call" element={<ProtectedRoute><AudioCall /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/kundli-matching" element={<ProtectedRoute><KundliMatching /></ProtectedRoute>} />
      <Route path="/muhurth-finder" element={<ProtectedRoute><MuhurthFinder /></ProtectedRoute>} />
      <Route path="/planetary-positions" element={<ProtectedRoute><PlanetaryPositions /></ProtectedRoute>} />
      <Route path="/vastu-compass" element={<ProtectedRoute><VastuCompass /></ProtectedRoute>} />
      <Route path="/numerology-calculator" element={<ProtectedRoute><NumerologyCalculator /></ProtectedRoute>} />
      <Route path="/gemstone-guide" element={<ProtectedRoute><GemstoneGuide /></ProtectedRoute>} />
      <Route path="/remedy-guide" element={<ProtectedRoute><RemedyGuide /></ProtectedRoute>} />
      <Route path="/planetary-avastas" element={<ProtectedRoute><PlanetaryAvastas /></ProtectedRoute>} />
      <Route path="/atlas-daylight-saving" element={<ProtectedRoute><AtlasDaylightSaving /></ProtectedRoute>} />
      <Route path="/transit-calendar" element={<ProtectedRoute><TransitCalendar /></ProtectedRoute>} />
      <Route path="/kundli-generator" element={<ProtectedRoute><KundliGenerator /></ProtectedRoute>} />
      <Route path="/dasha-calculator" element={<ProtectedRoute><DashaCalculator /></ProtectedRoute>} />
      <Route path="/rashi-guide" element={<ProtectedRoute><RashiGuide /></ProtectedRoute>} />
      <Route path="/nazhika-converter" element={<ProtectedRoute><NazhikaConverter /></ProtectedRoute>} />
      <Route path="/prashna" element={<ProtectedRoute><Prashna /></ProtectedRoute>} />
      <Route path="/yogas-detector" element={<ProtectedRoute><YogasDetector /></ProtectedRoute>} />
      <Route path="/jaimini-astrology" element={<ProtectedRoute><JaiminiAstrology /></ProtectedRoute>} />
      <Route path="/dasa-details" element={<ProtectedRoute><DasaDetails /></ProtectedRoute>} />
      <Route path="/astro-report" element={<ProtectedRoute><AstroReport /></ProtectedRoute>} />
      <Route path="/transit-alerts" element={<ProtectedRoute><TransitAlerts /></ProtectedRoute>} />
    </Routes>
  );
}
