import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomeScreen from './pages/HomeScreen';
import AboutScreen from './pages/AboutScreen';
import ServicesScreen from './pages/ServicesScreen';
import GalleryScreen from './pages/GalleryScreen';
import JournalScreen from './pages/JournalScreen';
import ProjectDetailScreen from './pages/ProjectDetailScreen';
import ContactScreen from './pages/ContactScreen';
import CustomCursor from './components/CustomCursor';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { PagesManager } from './pages/admin/PagesManager';
import { PostsManager } from './pages/admin/PostsManager';
import { BrochureManager } from './pages/admin/BrochureManager';
import { LeadsManager } from './pages/admin/LeadsManager';
import { Settings } from './pages/admin/Settings';
import { SiteEditor } from './pages/admin/SiteEditor';
import { Toaster } from 'sonner';

import { DynamicPage } from './pages/DynamicPage';
import { DynamicPost } from './pages/DynamicPost';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<Navigate to="/login" replace />} />

          {/* Admin Routes (Protected) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="pages" element={<ProtectedRoute allowedRoles={['admin']}><PagesManager /></ProtectedRoute>} />
            <Route path="posts" element={<PostsManager />} />
            <Route path="brochures" element={<BrochureManager />} />
            <Route path="leads" element={<LeadsManager />} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
            <Route path="site-editor" element={<ProtectedRoute allowedRoles={['admin']}><SiteEditor /></ProtectedRoute>} />
          </Route>

          {/* Public Routes */}
          <Route path="*" element={
            <>
              <CustomCursor />
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/about" element={<AboutScreen />} />
                  <Route path="/services" element={<ServicesScreen />} />
                  <Route path="/gallery" element={<GalleryScreen />} />
                  <Route path="/journal" element={<JournalScreen />} />
                  <Route path="/project-detail/:id" element={<ProjectDetailScreen />} />
                  <Route path="/contact" element={<ContactScreen />} />
                  <Route path="/p/:slug" element={<DynamicPage />} />
                  <Route path="/journal/:slug" element={<DynamicPost />} />
                </Routes>
              </MainLayout>
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
