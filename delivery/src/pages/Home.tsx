import React from 'react';
import { Truck, MapPin, Bell, User, History, CheckCircle, Navigation } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'var(--primary)', 
        color: '#fff',
        zIndex: 100,
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontWeight: 800, fontSize: '1.8rem' }}>Rappi <span style={{ fontWeight: 400, fontSize: '1.2rem' }}>Delivery</span></h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 10, height: 10, backgroundColor: '#00D166', borderRadius: '50%' }}></div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Conectado</span>
            </div>
            <Bell size={24} cursor="pointer" />
            <User size={24} cursor="pointer" />
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Ingresos de hoy', value: '$125.000', icon: '💰', color: '#FFF' },
            { label: 'Pedidos entregados', value: '12', icon: '📦', color: '#FFF' },
            { label: 'Calificación', value: '4.9', icon: '⭐', color: '#FFF' },
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</h3>
              </div>
              <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Available Orders Section */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Pedidos Disponibles (4)</h2>
            <button style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} />
              Ver mapa
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {[1, 2, 3].map((order) => (
              <div key={order} style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                border: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#F1F9F4', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <Truck color="#00D166" size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Restaurante El Corral</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} /> 2.5 km de distancia
                    </p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Ganancia: $8.500</span>
                      <span style={{ color: '#999' }}>• 15 min estimado</span>
                    </div>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
                  Aceptar Pedido
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Actividad Reciente</h2>
          <div style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', padding: '1rem' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ 
                padding: '1rem', 
                borderBottom: i === 1 ? '1px solid #eee' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle color="#00D166" size={20} />
                  <div>
                    <p style={{ fontWeight: 600 }}>Entrega exitosa - Pedido #4582</p>
                    <p style={{ color: '#999', fontSize: '0.85rem' }}>Hace 45 minutos • Pagado con RappiPay</p>
                  </div>
                </div>
                <span style={{ fontWeight: 700 }}>+$7.200</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
