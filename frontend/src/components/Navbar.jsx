import { Link, useLocation } from 'react-router-dom';
import { FaCode } from 'react-icons/fa';

const LINKS = [
  { to: '/',           label: 'Analiz'      },
  { to: '/dashboard',  label: 'Dashboard'   },
  { to: '/models',     label: 'Modeller'    },
  { to: '/completion', label: 'Tamamlama'   },
  { to: '/api',        label: 'API'         },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 24px', height: 52,
      background: '#111827', borderBottom: '1px solid #1f2937',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontWeight: 700, fontSize: 19 }}>
        <FaCode color="#8b5cf6" size={18} />
        Code<span style={{ color: '#6b7280', fontWeight: 400 }}>Sense</span>
      </div>

      <div style={{ display: 'flex', gap: 2 }}>
        {LINKS.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{
              padding: '5px 13px', borderRadius: 7, fontSize: 12, textDecoration: 'none',
              color:      active ? '#c4b5fd' : '#9ca3af',
              background: active ? 'rgba(139,92,246,0.18)' : 'transparent',
              fontWeight: active ? 600 : 400,
              transition: 'all .15s',
            }}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
