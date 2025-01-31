import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import CalculatorForm from './calculator-form';
import MeasuredWidthInfo from './tire-width-info';
import TireTypeInfo from './tire-type-info';
import SurfaceConditionInfo from './surface-condition-info';
import ReactGA from 'react-ga4';

// Initialize GA outside of component
ReactGA.initialize('G-5EKY1EDJ14');

// Create a wrapper component for tracking
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search
      });
    } catch (error) {
      console.error('Error sending pageview to GA4:', error);
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <PageTracker />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<CalculatorForm />} />
          <Route path="/measured-width-info" element={<MeasuredWidthInfo />} />
          <Route path="/tire-type-info" element={<TireTypeInfo />} />
          <Route path="/surface-condition-info" element={<SurfaceConditionInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
