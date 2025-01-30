import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalculatorForm from './calculator-form';
import MeasuredWidthInfo from './tire-width-info';
import TireTypeInfo from './tire-type-info';
import SurfaceConditionInfo from './surface-condition-info';

function App() {
  return (
    <Router>
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
