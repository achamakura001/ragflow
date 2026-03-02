/**
 * App – root component that wires React Router v6 routes to page components.
 *
 * Public routes (no auth required):
 *   /            → Home (landing + login)
 *   /register    → Register
 *   /verify      → Email verification
 *
 * Protected routes (require a stored JWT):
 *   /dashboard               → Dashboard
 *   /pipelines               → Pipelines list
 *   /pipelines/new           → Pipeline Builder wizard (create)
 *   /pipelines/:id/edit      → Pipeline Builder wizard (edit)
 *   /embeddings              → Embeddings
 *   /vector-stores           → Vector Stores
 *   /api-keys                → API Keys
 *   /retrieve-test           → Retrieval Test
 *   /settings                → Settings
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Home }            from './pages/Home';
import { Register }        from './pages/Register';
import { Verify }          from './pages/Verify';
import { Dashboard }       from './pages/Dashboard';
import { Pipelines }       from './pages/Pipelines';
import { PipelineBuilder } from './pages/builder/PipelineBuilder';
import { Embeddings }      from './pages/Embeddings';
import { VectorStores }    from './pages/VectorStores';
import { APIKeys }         from './pages/APIKeys';
import { RetrievalTest }   from './pages/RetrievalTest';
import { Settings }        from './pages/Settings';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify"   element={<Verify />} />

        {/* ── Protected (requires token) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Shell />}>
            <Route path="dashboard"            element={<Dashboard />} />
            <Route path="pipelines"            element={<Pipelines />} />
            <Route path="pipelines/new"        element={<PipelineBuilder />} />
            <Route path="pipelines/:id/edit"   element={<PipelineBuilder />} />
            <Route path="embeddings"           element={<Embeddings />} />
            <Route path="vector-stores"        element={<VectorStores />} />
            <Route path="api-keys"             element={<APIKeys />} />
            <Route path="retrieve-test"        element={<RetrievalTest />} />
            <Route path="settings"             element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;

