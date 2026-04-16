import React from 'react';
import { ShoppingBag, Search, User, MapPin, Bell } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: '#fff', 
        borderBottom: '1px solid #eee', 
        zIndex: 100,
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.8rem', cursor: 'pointer' }}>Rappi</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <MapPin size={18} />
              <span>Calle 123 #45-67, Bogotá</span>
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            maxWidth: '500px', 
            margin: '0 2rem', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search style={{ position: 'absolute', left: '1rem', color: '#999' }} size={20} />
            <input 
              type="text" 
              placeholder="Busca en Rappi..." 
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 3rem',
                borderRadius: '100px',
                border: 'none',
                backgroundColor: '#F3F3F3',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#333' }}>
            <button className="flex-center" style={{ gap: '0.5rem', fontWeight: 600 }}>
              <User size={24} />
              <span>Mi Cuenta</span>
            </button>
            <Bell size={24} cursor="pointer" />
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={24} cursor="pointer" />
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}>0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Categories */}
      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>Categorías principales</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {[
            { name: 'Restaurantes', color: '#FFF5F4', icon: '🍔' },
            { name: 'Supermercado', color: '#F1F9F4', icon: '🍎' },
            { name: 'Farmacia', color: '#F4F7FF', icon: '💊' },
            { name: 'Express', color: '#FFF9F0', icon: '⚡' },
            { name: 'Mascotas', color: '#F9F4FF', icon: '🐶' },
            { name: 'Licores', color: '#FFF5F9', icon: '🍷' },
          ].map((cat, i) => (
            <div key={i} style={{
              backgroundColor: cat.color,
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              textAlign: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>{cat.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Placeholder for "Tiendas recomendadas" */}
        <section style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tiendas recomendadas</h2>
            <button style={{ color: 'var(--primary)', fontWeight: 600 }}>Ver todas</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                cursor: 'pointer'
              }}>
                <div style={{ height: '160px', backgroundColor: '#f0f0f0' }}></div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Restaurante Delicioso</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Comida Gourmet • 20-30 min</p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#FFB800' }}>★</span>
                    <span style={{ fontWeight: 600 }}>4.8</span>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>(500+)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
