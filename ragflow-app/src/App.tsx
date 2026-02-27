/**
 * App – root component that wires React Router v6 routes to page components.
 *
 * Route map:
 *   /                → Dashboard
 *   /pipelines       → Pipelines list
 *   /pipelines/new   → Pipeline Builder wizard
 *   /embeddings      → Embeddings (placeholder)
 *   /vector-stores   → Vector Stores (placeholder)
 *   /api-keys        → API Keys
 *   /retrieve-test   → Retrieval Test
 *   /settings        → Settings
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';

import { Dashboard }       from './pages/Dashboard';
import { Pipelines }       from './pages/Pipelines';
import { PipelineBuilder } from './pages/builder/PipelineBuilder';
import { Embeddings }      from './pages/Embeddings';
import { VectorStores }    from './pages/VectorStores';
import { APIKeys }         from './pages/APIKeys';
import { RetrievalTest }   from './pages/RetrievalTest';
import { Settings }        from './pages/Settings';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="pipelines"     element={<Pipelines />} />
        <Route path="pipelines/new" element={<PipelineBuilder />} />
        <Route path="embeddings"    element={<Embeddings />} />
        <Route path="vector-stores" element={<VectorStores />} />
        <Route path="api-keys"      element={<APIKeys />} />
        <Route path="retrieve-test" element={<RetrievalTest />} />
        <Route path="settings"      element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;

