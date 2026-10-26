import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-container">
      <Header />
      <main className="contenedor-principal">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}