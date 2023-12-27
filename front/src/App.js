import React from 'react';
import Navbar from './components/Navbar';
import Main from './components/Main';
import AdminMain from './components/admin/AdminMain';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SearchProvider } from './components/SearchContext';
import Foot from './components/Foot';
import BlogMain from './components/displayBlog/BlogMain';

function App() {
  const currentPath = window.location.pathname;

  const isAdminRoute = currentPath.startsWith('/admin');

  if (isAdminRoute) {
   return (
    <div>
    
      <AdminMain/>
    </div>
   )
  }
 

  return (
    <SearchProvider>
    <div>
      <Navbar />
      <Main />
      <Foot/>
    </div>
  </SearchProvider>
  );
}

export default App;
