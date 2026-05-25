import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Truck, 
  Clock, 
  ChevronRight, 
  Plus, 
  List, 
  FileText, 
  ClipboardList, 
  FileSpreadsheet,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function Dashboard({ stats, logs, bilties, refreshData, setActivePage, setQuickAddTarget }) {
  // 1. Dynamic multi-tenant calculations
  const totalDispatches = bilties ? bilties.length : (stats?.bilty || 0);
  const totalBilled = bilties ? bilties.reduce((sum, b) => sum + (Number(b.totalFreight) || 0), 0) : 1085000;
  const outstandingAmount = bilties ? bilties.reduce((sum, b) => sum + (Number(b.balanceAmount) || 0), 0) : 714000;
  const activeTrucks = bilties ? Math.min(Math.floor(bilties.length / 5) + 1, 6) : 3;

  // States for timeline filter & search
  const [timelineSearch, setTimelineSearch] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('All');
  
  // Interactive GPS Tooltip State
  const [hoveredTruck, setHoveredTruck] = useState(null);

  // Quick SaaS drawer triggers
  const handleQuickAdd = (pageId, targetId) => {
    setQuickAddTarget(targetId);
    setActivePage(pageId);
  };

  const handleViewList = (pageId) => {
    setQuickAddTarget(null);
    setActivePage(pageId);
  };

  // State to simulate truck movement along segments
  const [truckPositions, setTruckPositions] = useState([
    { id: 'T1', x: 170, y: 95, vehicle: 'UP-77-AN-4876', route: 'Kanpur ➡️ Mumbai', driver: 'Ramesh Singh', status: 'In Transit', speed: '72 km/h', eta: '5.5 Hours', delay: 'None', delayReason: '' },
    { id: 'T2', x: 85, y: 155, vehicle: 'GJ-01-XX-9999', route: 'Vadodara ➡️ Jamnagar', driver: 'Devendra Patel', status: 'Arrived', speed: '0 km/h', eta: 'Arrived', delay: 'None', delayReason: '' },
    { id: 'T3', x: 140, y: 60, vehicle: 'MH-12-FT-8888', route: 'Delhi ➡️ Kolkata', driver: 'Sukhwinder Singh', status: 'Delayed', speed: '34 km/h', eta: '12 Hours', delay: '45 mins', delayReason: 'Highway NH-19 Construction Congestion' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTruckPositions(prev => prev.map(t => {
        if (t.id === 'T1') {
          // move downwards left towards Mumbai (x: 125, y: 205)
          const stepX = (125 - 170) / 100;
          const stepY = (205 - 95) / 100;
          const nx = t.x + stepX > 170 || t.x + stepX < 125 ? 170 : t.x + stepX;
          const ny = t.y + stepY < 95 || t.y + stepY > 205 ? 95 : t.y + stepY;
          return { ...t, x: nx, y: ny };
        } else if (t.id === 'T3') {
          // move downwards right towards Kolkata (x: 260, y: 135)
          const stepX = (260 - 140) / 100;
          const stepY = (135 - 60) / 100;
          const nx = t.x + stepX > 260 || t.x + stepX < 140 ? 140 : t.x + stepX;
          const ny = t.y + stepY > 135 || t.y + stepY < 60 ? 60 : t.y + stepY;
          return { ...t, x: nx, y: ny };
        }
        return t; 
      }));
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // Timeline Grouping helper
  const getTimelineGroup = (timestamp) => {
    const logDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    if (logDate.toDateString() === today.toDateString()) {
      return 'TODAY';
    } else if (logDate.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY';
    }
    return 'EARLIER THIS WEEK';
  };

  // Filtered and Searched Logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(timelineSearch.toLowerCase());
    if (timelineFilter === 'All') return matchesSearch;
    if (timelineFilter === 'Bilty') return matchesSearch && log.description.toLowerCase().includes('bilty');
    if (timelineFilter === 'Slip') return matchesSearch && log.description.toLowerCase().includes('slip');
    if (timelineFilter === 'Invoice') return matchesSearch && log.description.toLowerCase().includes('invoice');
    return matchesSearch;
  });

  // Unique groups for display
  const timelineGroups = [...new Set(filteredLogs.map(log => getTimelineGroup(log.timestamp)))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Breadcrumb Navigation */}
      <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: '500' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('dashboard')}>🏠 Workspace Home</span>
        <span>&gt;</span>
        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Operational Dashboard</span>
      </div>

      {/* 1. UPGRADED METRIC KPI CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: Total Dispatches */}
        <div className="glass-panel-premium" style={{ 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.03) 100%)', 
          borderLeft: '5px solid #2563eb',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(37, 99, 235, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#2563eb" />
            </div>
            {/* Embedded Micro-Sparkline */}
            <svg width="60" height="24" viewBox="0 0 60 24" style={{ overflow: 'visible' }}>
              <path d="M0,20 Q15,5 30,12 T60,2" fill="none" stroke="#2563eb" strokeWidth="2.5" className="sparkline-chart-path" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Dispatches</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: '800', margin: '4px 0 2px 0' }}>{totalDispatches} Bilties</h2>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} />
              <span>+14.8% dispatches this week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Billed Amount */}
        <div className="glass-panel-premium" style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 100%)', 
          borderLeft: '5px solid #10b981',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coins size={20} color="#10b981" />
            </div>
            <svg width="60" height="24" viewBox="0 0 60 24" style={{ overflow: 'visible' }}>
              <path d="M0,18 Q15,22 30,8 T60,2" fill="none" stroke="#10b981" strokeWidth="2.5" className="sparkline-chart-path" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billed Freight Volume</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: '800', margin: '4px 0 2px 0', color: '#10b981' }}>₹{totalBilled.toLocaleString('en-IN')}</h2>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} />
              <span>+9.2% billing collections</span>
            </div>
          </div>
        </div>

        {/* Card 3: Outstanding Receivables */}
        <div className="glass-panel-premium" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.03) 100%)', 
          borderLeft: '5px solid #f59e0b',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#f59e0b" />
            </div>
            <svg width="60" height="24" viewBox="0 0 60 24" style={{ overflow: 'visible' }}>
              <path d="M0,5 Q15,18 30,12 T60,18" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="sparkline-chart-path" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outstanding Receivables</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: '800', margin: '4px 0 2px 0', color: '#f59e0b' }}>₹{outstandingAmount.toLocaleString('en-IN')}</h2>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              ⚠️ Average collection cycle: <b>14 Days</b>
            </div>
          </div>
        </div>

        {/* Card 4: Location Tracking */}
        <div className="glass-panel-premium" style={{ 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.03) 100%)', 
          borderLeft: '5px solid #ef4444',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          cursor: 'pointer'
        }} onClick={() => setActivePage('tracking')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} color="#ef4444" />
            </div>
            <span className="pulse-dot" style={{ backgroundColor: '#ef4444' }}></span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Telemetry Tracking</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: '800', margin: '4px 0 2px 0', color: '#ef4444' }}>{activeTrucks} Active</h2>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              📡 Real-time GPS pings online
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL COLUMN MAP & TIMELINE WORKSPACE */}
      <div className="columnsRow" style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '24px' }}>
        
        {/* Left Panel: India Vector map & charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Animated Route Map Container */}
          <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)' }}>Live GPS Carrier Route Segment</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulated route maps detailing driver details, speeds, & ETAs</span>
              </div>
              <button 
                onClick={() => setActivePage('tracking')}
                style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid rgba(0, 102, 204, 0.2)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Open Global Map Viewer
              </button>
            </div>

            <div style={{ width: '100%', height: '320px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', position: 'relative' }}>
              <svg viewBox="0 0 350 280" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-color)" strokeWidth="0.5" strokeOpacity="0.15" />
                  </pattern>
                  <radialGradient id="mapGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />

                {/* Contoured India Contour Segment */}
                <path 
                  d="M120,40 L160,30 L170,10 L195,35 L200,60 L240,80 L230,110 L280,120 L270,160 L230,170 L240,210 L190,260 L180,270 L140,230 L110,210 L100,160 L80,140 L110,95 L120,40 Z" 
                  fill="url(#mapGlowGrad)" 
                  stroke="var(--border-color)" 
                  strokeWidth="2" 
                  strokeDasharray="4,4" 
                  strokeOpacity="0.3"
                />

                {/* Indian Hub Nodes */}
                <g transform="translate(140, 60)"><circle r="4.5" fill="#ef4444" /><text x="8" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Delhi</text></g>
                <g transform="translate(170, 95)"><circle r="4.5" fill="var(--primary)" /><text x="8" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Kanpur</text></g>
                <g transform="translate(230, 125)"><circle r="4.5" fill="var(--primary)" /><text x="8" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Jamshedpur</text></g>
                <g transform="translate(125, 205)"><circle r="4.5" fill="#ef4444" /><text x="8" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Mumbai</text></g>
                <g transform="translate(260, 135)"><circle r="4.5" fill="#10b981" /><text x="8" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Kolkata</text></g>
                <g transform="translate(115, 160)"><circle r="4.5" fill="var(--primary)" /><text x="-32" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Vadodara</text></g>
                <g transform="translate(85, 155)"><circle r="4.5" fill="#10b981" /><text x="-34" y="2" fontSize="6.5" fill="var(--text-main)" fontWeight="700">Jamnagar</text></g>

                {/* Segment Routing lines with active moving strokes */}
                <line x1="170" y1="95" x2="125" y2="205" stroke="#3b82f6" strokeWidth="2.5" strokeOpacity="0.4" className="map-route-segment" />
                <line x1="115" y1="160" x2="85" y2="155" stroke="#10b981" strokeWidth="2.5" strokeOpacity="0.4" className="map-route-segment" />
                <line x1="140" y1="60" x2="260" y2="135" stroke="#ef4444" strokeWidth="2.5" strokeOpacity="0.4" className="map-route-segment" />

                {/* Dynamic animated pings */}
                <circle cx={truckPositions[0].x} cy={truckPositions[0].y} r="12" fill="none" stroke="#2563eb" strokeWidth="1" className="glowing-radar-ping" />
                <circle cx={truckPositions[2].x} cy={truckPositions[2].y} r="12" fill="none" stroke="#ef4444" strokeWidth="1" className="glowing-radar-ping" />

                {/* Render Truck Group Vectors */}
                {truckPositions.map((t) => (
                  <g 
                    key={t.id} 
                    transform={`translate(${t.x - 6}, ${t.y - 5})`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredTruck(t)}
                    onMouseLeave={() => setHoveredTruck(null)}
                  >
                    <rect width="13" height="9" rx="1.5" fill={t.id === 'T1' ? '#2563eb' : t.id === 'T2' ? '#10b981' : '#ef4444'} />
                    <rect x="8" y="2" width="4" height="5" fill="#ffffff" fillOpacity="0.7" />
                    <circle cx="3" cy="9" r="1.2" fill="#000" />
                    <circle cx="10" cy="9" r="1.2" fill="#000" />
                  </g>
                ))}
              </svg>

              {/* Hover overlay panel */}
              {hoveredTruck && (
                <div className="glass-panel-premium" style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px', 
                  zIndex: 99, 
                  padding: '12px', 
                  maxWidth: '240px',
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: hoveredTruck.id === 'T1' ? '#2563eb' : hoveredTruck.id === 'T2' ? '#10b981' : '#ef4444' }}></span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{hoveredTruck.vehicle}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <div>Route: <b>{hoveredTruck.route}</b></div>
                    <div>Driver: <b>{hoveredTruck.driver}</b></div>
                    <div>Speed: <b>{hoveredTruck.speed}</b></div>
                    <div>ETA: <b>{hoveredTruck.eta}</b></div>
                    {hoveredTruck.delay !== 'None' && (
                      <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px', fontWeight: '700' }}>
                        <AlertTriangle size={12} /> Delay: {hoveredTruck.delay}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Indian route segment detail legends */}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-main)' }}>UP-77 In Transit (Delhi-Mum)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-main)' }}>MH-12 Construction Delay</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Segment dispatches chart */}
          <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)' }}>Corporate Loading & Collections</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MERN dashboard visual metrics parsed from active bills</span>
            
            <div style={{ height: '120px', padding: '10px 0' }}>
              <svg viewBox="0 0 450 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <line x1="0" y1="20" x2="450" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeOpacity="0.2" />
                <line x1="0" y1="60" x2="450" y2="60" stroke="var(--border-color)" strokeWidth="0.5" strokeOpacity="0.2" />
                <line x1="0" y1="100" x2="450" y2="100" stroke="var(--border-color)" strokeWidth="0.5" strokeOpacity="0.2" />

                <path 
                  d="M0,100 C50,80 100,90 150,60 C200,30 250,70 300,40 C350,10 400,30 450,10" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                />
                
                <circle cx="150" cy="60" r="4.5" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />
                <circle cx="300" cy="40" r="4.5" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />
                <circle cx="450" cy="10" r="5" fill="#10b981" stroke="var(--bg-card)" strokeWidth="2.5" />
                
                <text x="5" y="115" fontSize="8" fill="var(--text-muted)" fontWeight="600">Mon</text>
                <text x="145" y="115" fontSize="8" fill="var(--text-muted)" fontWeight="600">Wed</text>
                <text x="295" y="115" fontSize="8" fill="var(--text-muted)" fontWeight="600">Fri</text>
                <text x="415" y="115" fontSize="8" fill="#10b981" fontWeight="700">Live (Today)</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Panel: timeline feed & Quick creators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Advanced Activity Timeline Panel */}
          <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)' }}>Operations Timeline</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Audit register of all dispatches, payments, & edits</span>
            </div>

            {/* Filter and search row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px' }}>
                <Search size={14} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search timeline..." 
                  value={timelineSearch}
                  onChange={(e) => setTimelineSearch(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem', color: 'var(--text-main)', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                <SlidersHorizontal size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                {['All', 'Bilty', 'Slip', 'Invoice'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setTimelineFilter(f)}
                    style={{ 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      border: 'none', 
                      fontSize: '0.68rem', 
                      fontWeight: '700', 
                      cursor: 'pointer',
                      backgroundColor: timelineFilter === f ? 'var(--primary-glow)' : 'transparent',
                      color: timelineFilter === f ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Timelines List grouped by Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '250px', paddingRight: '4px' }}>
              {timelineGroups.length > 0 ? (
                timelineGroups.map((group) => (
                  <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{group}</span>
                    
                    {filteredLogs
                      .filter(log => getTimelineGroup(log.timestamp) === group)
                      .map((log, idx) => {
                        const isCreate = log.description.toLowerCase().includes('created');
                        const isUpdate = log.description.toLowerCase().includes('updated');
                        const isDelete = log.description.toLowerCase().includes('deleted');

                        let badgeColor = 'var(--primary)';
                        if (isCreate) badgeColor = '#10b981';
                        if (isUpdate) badgeColor = '#f59e0b';
                        if (isDelete) badgeColor = '#ef4444';

                        return (
                          <div key={log._id || idx} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                            <div style={{ 
                              width: '26px', 
                              height: '26px', 
                              borderRadius: '50%', 
                              backgroundColor: 'var(--bg-main)', 
                              border: `2px solid ${badgeColor}`, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '0.65rem',
                              fontWeight: '800',
                              color: badgeColor,
                              flexShrink: 0
                            }}>
                              {isCreate ? 'C' : isUpdate ? 'U' : 'D'}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: '1.3' }}>
                                {log.description}
                              </p>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={10} />
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  No operational records found.
                </div>
              )}
            </div>
          </div>

          {/* Quick SaaS creators panel */}
          <div className="glass-panel-premium" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)' }}>Operations Shortcut Panel</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instantly launch templates and bill draft creators</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Bilty trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>Lorry LR Bilty</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleQuickAdd('bilty-create', 'bilty')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Create Bilty">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => handleViewList('bilty-list')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Bilty List">
                    <List size={14} />
                  </button>
                </div>
              </div>

              {/* Loading Slip trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClipboardList size={18} color="#10b981" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>Loading Slip</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleQuickAdd('loading-create', 'slip')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Create Loading Slip">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => handleViewList('loading-list')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Loading Slips">
                    <List size={14} />
                  </button>
                </div>
              </div>

              {/* Tax Invoice trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={18} color="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>GST Tax Invoice</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleQuickAdd('invoice-create', 'invoice')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Create Invoice">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => handleViewList('invoice-list')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Invoices">
                    <List size={14} />
                  </button>
                </div>
              </div>

              {/* Hire Chalan trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} color="#ef4444" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>Truck Chalan</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleQuickAdd('chalan-create', 'chalan')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Create Chalan">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => handleViewList('chalan-list')} style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Chalans">
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
