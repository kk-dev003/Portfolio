import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Home from './pages/Home.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Live from './pages/Live.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Home/> },
  { path: '/projects', element: <ProjectsPage/> },
  { path: '/case/:slug', element: <CaseStudy/> },
  { path: '/live', element: <Live/> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
