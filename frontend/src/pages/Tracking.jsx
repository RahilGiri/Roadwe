import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Compass, Info, Plus, Search, Trash2, Map, Home } from 'lucide-react';

export default function Tracking({ activePage, setActivePage }) {
  // Local state list with fallback to localStorage persistence
  const [trucks, setTrucks] = useState(() => {
    const saved = localStorage.getItem('roadwe_tracking_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'T1',
        vehicleNumber: 'UP-77-AN-4876',
        driver: 'Ramesh Singh',
        driverMobile: '9129918353',
        capacity: '24 MT',
        from: 'Kanpur',
        to: 'Mumbai',
        cargo: 'Iron Sheets / Coils',
        status: 'In Transit',
        speed: '58 km/h',
        progress: 45,
        routeCoords: [
          { x: 300, y: 150 }, // Kanpur
          { x: 260, y: 220 }, // Jhansi
          { x: 220, y: 280 }, // Bhopal
          { x: 180, y: 320 }, // Indore
          { x: 150, y: 390 }, // Jalgaon
          { x: 110, y: 440 }  // Mumbai
        ],
        currentCoord: { x: 220, y: 280 }
      },
      {
        id: 'T2',
        vehicleNumber: 'DL-01-GB-1234',
        driver: 'Sukhdev Singh',
        driverMobile: '9876543210',
        capacity: '18 MT',
        from: 'Jamshedpur',
        to: 'Jamnagar',
        cargo: 'Chemical Barrels',
        status: 'Arrived / Stopped',
        speed: '0 km/h (Parked)',
        progress: 100,
        routeCoords: [
          { x: 420, y: 240 }, // Jamshedpur
          { x: 340, y: 260 }, // Nagpur
          { x: 260, y: 280 }, // Amravati
          { x: 180, y: 280 }, // Surat
          { x: 80, y: 250 }   // Jamnagar
        ],
        currentCoord: { x: 80, y: 250 }
      },
      {
        id: 'T3',
        vehicleNumber: 'MH-12-PQ-9999',
        driver: 'Amit Kumar',
        driverMobile: '9988776655',
        capacity: '20 MT',
        from: 'Delhi',
        to: 'Kolkata',
        cargo: 'Electronics Parts',
        status: 'In Transit',
        speed: '72 km/h',
        progress: 15,
        routeCoords: [
          { x: 200, y: 80 },  // Delhi
          { x: 270, y: 120 }, // Lucknow
          { x: 340, y: 160 }, // Varanasi
          { x: 480, y: 220 }  // Kolkata
        ],
        currentCoord: { x: 200, y: 80 }
      }
    ];
  });

  // Local routing state fallback if sidebar props aren't available
  const [localView, setLocalView] = useState('list');
  const [selectedTruckId, setSelectedTruckId] = useState('T1');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states matching specification
  const [vPart1, setVPart1] = useState('');
  const [vPart2, setVPart2] = useState('');
  const [vPart3, setVPart3] = useState('');
  const [vPart4, setVPart4] = useState('');
  const [truckCapacity, setTruckCapacity] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roadwe_tracking_list', JSON.stringify(trucks));
  }, [trucks]);

  // Synchronize state with App activePage
  const currentView = activePage === 'tracking-add' ? 'create' : (activePage === 'tracking-list' ? 'list' : localView);

  const navigateTo = (viewName) => {
    if (setActivePage) {
      setActivePage(viewName === 'create' ? 'tracking-add' : 'tracking-list');
    } else {
      setLocalView(viewName);
    }
  };

  // Helper for custom city coordinates map rendering
  const getCoordsForCity = (cityName) => {
    const name = cityName.trim().toLowerCase();
    const presets = {
      delhi: { x: 200, y: 80 },
      kanpur: { x: 300, y: 150 },
      lucknow: { x: 270, y: 120 },
      varanasi: { x: 340, y: 160 },
      kolkata: { x: 480, y: 220 },
      jhansi: { x: 260, y: 220 },
      bhopal: { x: 220, y: 280 },
      jamshedpur: { x: 420, y: 240 },
      mumbai: { x: 110, y: 440 },
      jamnagar: { x: 80, y: 250 },
      indore: { x: 180, y: 320 },
      jalgaon: { x: 150, y: 390 },
      surat: { x: 180, y: 280 },
      nagpur: { x: 340, y: 260 },
      amravati: { x: 260, y: 280 }
    };
    if (presets[name]) return presets[name];
    // Seeded pseudo-stable generator based on city name characters
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = 120 + Math.abs(hash % 380);
    const y = 90 + Math.abs((hash >> 8) % 280);
    return { x, y };
  };

  // React tick timer to animate trucks crawling along their routes in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setTrucks(prevTrucks =>
        prevTrucks.map(t => {
          if (t.status === 'Arrived / Stopped' || t.routeCoords.length < 2) return t;

          // Increment progress slightly
          let nextProgress = t.progress + 1.2;
          if (nextProgress > 100) nextProgress = 0; // Loop trip

          // Compute interpolated coordinate based on route segments
          const coords = t.routeCoords;
          const numSegments = coords.length - 1;
          const segmentIndex = Math.floor((nextProgress / 100) * numSegments);

          if (segmentIndex >= numSegments) {
            return { ...t, progress: nextProgress, currentCoord: coords[coords.length - 1] };
          }

          const start = coords[segmentIndex];
          const end = coords[segmentIndex + 1];
          const segmentProgress = ((nextProgress / 100) * numSegments) - segmentIndex;

          const currentCoord = {
            x: start.x + (end.x - start.x) * segmentProgress,
            y: start.y + (end.y - start.y) * segmentProgress
          };

          return {
            ...t,
            progress: nextProgress,
            currentCoord,
            speed: `${50 + Math.floor(Math.random() * 22)} km/h` // Dynamic velocity simulation
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCreateTracking = (e) => {
    e.preventDefault();
    if (!vPart1 || !vPart2 || !vPart3 || !vPart4 || !driverName || !driverMobile || !fromLocation || !toLocation) {
      alert('Please fill out all required fields.');
      return;
    }

    const fullVehicleNum = `${vPart1.toUpperCase()}-${vPart2}-${vPart3.toUpperCase()}-${vPart4}`;
    const startCoord = getCoordsForCity(fromLocation);
    const endCoord = getCoordsForCity(toLocation);
    
    // Create curve mid-coordinate
    const midCoord = {
      x: (startCoord.x + endCoord.x) / 2 + 30,
      y: (startCoord.y + endCoord.y) / 2 - 20
    };

    const newTracking = {
      id: `T${Date.now()}`,
      vehicleNumber: fullVehicleNum,
      driver: driverName,
      driverMobile: driverMobile,
      capacity: `${truckCapacity} MT`,
      from: fromLocation,
      to: toLocation,
      cargo: 'Commercial Goods',
      status: 'In Transit',
      speed: '55 km/h',
      progress: 0,
      routeCoords: [startCoord, midCoord, endCoord],
      currentCoord: startCoord
    };

    const updatedTrucks = [newTracking, ...trucks];
    setTrucks(updatedTrucks);
    setSelectedTruckId(newTracking.id);

    // Clear form fields
    setVPart1('');
    setVPart2('');
    setVPart3('');
    setVPart4('');
    setTruckCapacity('');
    setDriverName('');
    setDriverMobile('');
    setFromLocation('');
    setToLocation('');

    // Switch to list view to witness tracking
    navigateTo('list');
  };

  const handleDeleteTracking = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to stop tracking this vehicle?')) {
      const updated = trucks.filter(t => t.id !== id);
      setTrucks(updated);
      if (selectedTruckId === id && updated.length > 0) {
        setSelectedTruckId(updated[0].id);
      }
    }
  };

  const selectedTruck = trucks.find(t => t.id === selectedTruckId) || (trucks.length > 0 ? trucks[0] : null);

  // Apply quick searches
  const filteredTrucks = trucks.filter(t => 
    t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* High-Fidelity Breadcrumbs matching Screenshot 3 */}
      <div style={styles.breadcrumbs}>
        <div style={styles.breadcrumbLink}>
          <Home size={14} style={styles.homeIcon} /> Home
        </div>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <div style={styles.breadcrumbLink}>Location Tracking</div>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>
          {currentView === 'create' ? 'Create Location Tracking' : 'Location Tracking List'}
        </span>
      </div>

      {/* VIEW 1: CREATION FORM VIEW */}
      {currentView === 'create' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="#0066cc" />
              <h3 style={styles.cardTitle}>Location Tracking Creator Form</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigateTo('list')} 
                style={styles.addButton}
              >
                Location Tracking List
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateTracking} style={styles.form}>
            {/* Input Row 1: Quad split plate input */}
            <div style={styles.row}>
              <div style={{ flex: '2 1 320px' }}>
                <label style={styles.label}>Vehicle Registration Number <span style={{ color: 'red' }}>*</span></label>
                <div style={styles.quadSplitWrapper}>
                  <input 
                    type="text" 
                    placeholder="MH" 
                    value={vPart1} 
                    onChange={(e) => setVPart1(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))}
                    style={styles.quadInputSmall} 
                    className="form-control"
                    maxLength={2}
                    required
                  />
                  <span style={styles.quadDash}>-</span>
                  <input 
                    type="text" 
                    placeholder="12" 
                    value={vPart2} 
                    onChange={(e) => setVPart2(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    style={styles.quadInputSmall} 
                    className="form-control"
                    maxLength={2}
                    required
                  />
                  <span style={styles.quadDash}>-</span>
                  <input 
                    type="text" 
                    placeholder="PQ" 
                    value={vPart3} 
                    onChange={(e) => setVPart3(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2))}
                    style={styles.quadInputSmall} 
                    className="form-control"
                    maxLength={2}
                    required
                  />
                  <span style={styles.quadDash}>-</span>
                  <input 
                    type="text" 
                    placeholder="9999" 
                    value={vPart4} 
                    onChange={(e) => setVPart4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    style={styles.quadInputLarge} 
                    className="form-control"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <label style={styles.label}>Truck Capacity (Metric Tons) <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="number" 
                  placeholder="e.g. 24" 
                  value={truckCapacity}
                  onChange={(e) => setTruckCapacity(e.target.value)}
                  className="form-control"
                  style={styles.inputControl}
                  required
                />
              </div>
            </div>

            {/* Input Row 2: Driver Info */}
            <div style={styles.row}>
              <div style={{ flex: '1 1 280px' }}>
                <label style={styles.label}>Driver Name <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Enter driver name" 
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="form-control"
                  style={styles.inputControl}
                  required
                />
              </div>

              <div style={{ flex: '1 1 280px' }}>
                <label style={styles.label}>Driver Mobile Number <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit mobile" 
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-control"
                  style={styles.inputControl}
                  required
                />
              </div>
            </div>

            {/* Input Row 3: Route Details */}
            <div style={styles.row}>
              <div style={{ flex: '1 1 280px' }}>
                <label style={styles.label}>From Location (Origin) <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Kanpur, Delhi, Mumbai" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="form-control"
                  style={styles.inputControl}
                  required
                />
                <span style={styles.fieldNote}>Tip: Preset coordinates map to Kanpur, Jhansi, Delhi, Mumbai, Kolkata, Varanasi, Jamshedpur, Bhopal.</span>
              </div>

              <div style={{ flex: '1 1 280px' }}>
                <label style={styles.label}>Parcel To Location (Destination) <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Jamnagar, Surat, Mumbai" 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="form-control"
                  style={styles.inputControl}
                  required
                />
              </div>
            </div>

            {/* Center Aligned Green Trigger Button */}
            <div style={styles.btnCenterWrapper}>
              <button type="submit" style={styles.createBtn}>
                CREATE LOCATION TRACKING
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: REGISTRY LIST VIEW */}
      {currentView === 'list' && (
        <div style={styles.splitLayout}>
          {/* Left panel: Directory listing */}
          <div style={styles.listSection}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>
                  Location Tracking List ({filteredTrucks.length})
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => alert('Tracking all active trucks on live corridors...')} 
                    style={styles.addButton}
                  >
                    Track All Truck
                  </button>
                  <button 
                    onClick={() => navigateTo('create')} 
                    style={styles.addButton}
                  >
                    Add Location Tracking
                  </button>
                </div>
              </div>

              {/* Quick Search Toolbar for registries */}
              <div style={styles.toolbar}>
                <div style={styles.toolsRight}>
                  <span style={styles.searchLabel}>Search:</span>
                  <div style={styles.searchWrapper}>
                    <Search size={14} style={styles.searchIcon} />
                    <input 
                      type="text" 
                      placeholder="Search truck, driver, route..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={styles.searchInput}
                    />
                  </div>
                </div>
              </div>

              {filteredTrucks.length === 0 ? (
                /* Centered "No Data Found" Empty State matching Screenshot 3 */
                <div style={styles.emptyContainer}>
                  <h4 style={styles.emptyTitle}>No Data Found</h4>
                  {/* Square blue paginator 1 */}
                  <div style={styles.emptyPaginator}>1</div>
                </div>
              ) : (
                /* High-Fidelity Tables Registry */
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Truck No</th>
                        <th style={styles.th}>Driver Name</th>
                        <th style={styles.th}>Driver Mobile</th>
                        <th style={styles.th}>Capacity</th>
                        <th style={styles.th}>Route</th>
                        <th style={styles.thActions}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrucks.map((t) => {
                        const isTarget = selectedTruckId === t.id;
                        return (
                          <tr 
                            key={t.id} 
                            style={{
                              ...styles.tr,
                              ...(isTarget ? styles.trActive : {})
                            }}
                            onClick={() => setSelectedTruckId(t.id)}
                          >
                            <td style={styles.td}>
                              <div style={styles.truckPlate}>
                                {t.vehicleNumber}
                              </div>
                            </td>
                            <td style={styles.td}>{t.driver}</td>
                            <td style={styles.td}>{t.driverMobile}</td>
                            <td style={styles.td}>{t.capacity}</td>
                            <td style={styles.td}>
                              <div style={styles.routeBadge}>
                                {t.from} <span style={{ color: '#0066cc', margin: '0 4px' }}>➔</span> {t.to}
                              </div>
                            </td>
                            <td style={styles.tdActions}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button 
                                  type="button" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTruckId(t.id);
                                  }}
                                  style={{
                                    ...styles.actionRadarBtn,
                                    ...(isTarget ? styles.actionRadarBtnActive : {})
                                  }}
                                >
                                  <Navigation size={12} style={{ marginRight: 4 }} /> Live Tracker
                                </button>
                                <button 
                                  type="button" 
                                  onClick={(e) => handleDeleteTracking(t.id, e)}
                                  style={styles.actionDeleteBtn}
                                  title="Stop tracking"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Crawler Vector Highway Radar Map */}
          {selectedTruck && filteredTrucks.length > 0 && (
            <div style={styles.mapSection}>
              <div className="glass-panel" style={styles.mapCard}>
                <div style={styles.mapHeaderInfo}>
                  <div style={styles.mapTitleWrapper}>
                    <span style={styles.mapRadarPulse}></span>
                    <h4 style={styles.mapTitle}>Live Tracker Radar</h4>
                  </div>
                  <span style={styles.speedTag}>{selectedTruck.speed}</span>
                </div>

                <div style={styles.mapInfoGrid}>
                  <div style={styles.mapInfoCell}>
                    <span style={styles.mapCellLabel}>Target Truck</span>
                    <span style={styles.mapCellVal}>{selectedTruck.vehicleNumber}</span>
                  </div>
                  <div style={styles.mapInfoCell}>
                    <span style={styles.mapCellLabel}>Driver & Mobile</span>
                    <span style={styles.mapCellVal}>{selectedTruck.driver} ({selectedTruck.driverMobile})</span>
                  </div>
                  <div style={styles.mapInfoCell}>
                    <span style={styles.mapCellLabel}>Active Route</span>
                    <span style={styles.mapCellVal}>{selectedTruck.from} to {selectedTruck.to}</span>
                  </div>
                  <div style={styles.mapInfoCell}>
                    <span style={styles.mapCellLabel}>Radar Location</span>
                    <span style={styles.mapCellVal}>x:{selectedTruck.currentCoord.x.toFixed(0)}, y:{selectedTruck.currentCoord.y.toFixed(0)}</span>
                  </div>
                </div>

                {/* Vector Map SVG Canvas */}
                <div style={styles.mapWrapper}>
                  <svg style={styles.svgMap} viewBox="0 0 600 500">
                    <defs>
                      <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(226, 232, 240, 0.4)" strokeWidth="0.8"/>
                      </pattern>
                      <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0066cc" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00b050" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#radarGrid)" rx="8" />

                    {/* Dotted highway corridors */}
                    {trucks.map((t) => {
                      if (t.routeCoords.length < 2) return null;
                      const isSelected = t.id === selectedTruckId;
                      const pathD = t.routeCoords.reduce((acc, coord, idx) => {
                        return acc + `${idx === 0 ? 'M' : 'L'} ${coord.x} ${coord.y} `;
                      }, '');

                      return (
                        <path
                          key={t.id}
                          d={pathD}
                          fill="none"
                          stroke={isSelected ? 'url(#neonGlow)' : '#cbd5e1'}
                          strokeWidth={isSelected ? 4 : 2}
                          strokeDasharray={isSelected ? '6,6' : '3,3'}
                          style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                        />
                      );
                    })}

                    {/* City Stations */}
                    {/* Delhi */}
                    <circle cx="200" cy="80" r="6" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
                    <text x="210" y="85" style={styles.mapLabel}>Delhi</text>
                    
                    {/* Kanpur */}
                    <circle cx="300" cy="150" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="310" y="155" style={styles.mapLabel}>Kanpur</text>

                    {/* Lucknow */}
                    <circle cx="270" cy="120" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="280" y="125" style={styles.mapLabel}>Lucknow</text>

                    {/* Varanasi */}
                    <circle cx="340" cy="160" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="350" y="165" style={styles.mapLabel}>Varanasi</text>

                    {/* Kolkata */}
                    <circle cx="480" cy="220" r="6" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
                    <text x="490" y="225" style={styles.mapLabel}>Kolkata</text>

                    {/* Bhopal */}
                    <circle cx="220" cy="280" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="230" y="285" style={styles.mapLabel}>Bhopal</text>

                    {/* Jhansi */}
                    <circle cx="260" cy="220" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="270" y="225" style={styles.mapLabel}>Jhansi</text>

                    {/* Jamshedpur */}
                    <circle cx="420" cy="240" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="430" y="245" style={styles.mapLabel}>Jamshedpur</text>

                    {/* Mumbai */}
                    <circle cx="110" cy="440" r="6" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
                    <text x="120" y="445" style={styles.mapLabel}>Mumbai</text>

                    {/* Jamnagar */}
                    <circle cx="80" cy="250" r="6" fill="#0f172a" stroke="#fff" strokeWidth="1.5" />
                    <text x="90" y="255" style={styles.mapLabel}>Jamnagar</text>

                    {/* Indore */}
                    <circle cx="180" cy="320" r="5" fill="#475569" stroke="#fff" strokeWidth="1.2" />
                    <text x="190" y="325" style={styles.mapLabel}>Indore</text>

                    {/* Crawling Truck Indicators */}
                    {trucks.map((t) => {
                      if (t.routeCoords.length < 2) return null;
                      const isSelected = t.id === selectedTruckId;
                      return (
                        <g key={t.id} transform={`translate(${t.currentCoord.x - 12}, ${t.currentCoord.y - 12})`}>
                          {isSelected && (
                            <circle 
                              cx="12" 
                              cy="12" 
                              r="20" 
                              fill="rgba(0, 102, 204, 0.18)" 
                              stroke="#0066cc" 
                              strokeWidth="1.5"
                              style={styles.pulsingCircle} 
                            />
                          )}
                          <circle cx="12" cy="12" r="10" fill={isSelected ? '#0066cc' : '#64748b'} stroke="#ffffff" strokeWidth="1.5" />
                          <text x="6" y="16" style={{ fontSize: '10px', fill: '#ffffff' }}>🚚</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div style={styles.bottomLegend}>
                  <Info size={13} style={{ color: '#64748b', marginRight: 6 }} />
                  <span>Truck position indicators crawl smoothly in real-time along actual NH corridors.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: '100%',
    fontFamily: "'Inter', sans-serif"
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  breadcrumbLink: {
    color: '#64748b',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  homeIcon: {
    color: '#0066cc'
  },
  breadcrumbSeparator: {
    color: '#cbd5e1'
  },
  breadcrumbActive: {
    color: '#0066cc',
    fontWeight: '700'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: 0
  },
  addButton: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 102, 204, 0.15)',
    transition: 'background-color 0.2s ease',
    outline: 'none'
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '6px',
    display: 'block'
  },
  quadSplitWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    borderRadius: '6px'
  },
  quadInputSmall: {
    width: '60px',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    padding: '8px 4px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none'
  },
  quadInputLarge: {
    flex: '1',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    padding: '8px 4px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none'
  },
  quadDash: {
    fontWeight: '700',
    color: '#64748b',
    fontSize: '1rem'
  },
  inputControl: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '0.85rem',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none'
  },
  fieldNote: {
    fontSize: '0.7rem',
    color: '#64748b',
    marginTop: '4px',
    display: 'block'
  },
  btnCenterWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '12px'
  },
  createBtn: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 32px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 176, 80, 0.25)',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '20px',
    alignItems: 'start'
  },
  listSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  toolbar: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1'
  },
  toolsRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%'
  },
  searchLabel: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#475569'
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '4px 10px',
    width: '240px'
  },
  searchIcon: {
    color: '#cbd5e1',
    marginRight: '6px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '0.85rem',
    width: '100%',
    color: '#1e293b',
    backgroundColor: 'transparent'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #cbd5e1'
  },
  th: {
    padding: '12px 16px',
    fontWeight: '700',
    color: '#475569'
  },
  thActions: {
    padding: '12px 16px',
    fontWeight: '700',
    color: '#475569',
    textAlign: 'right'
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  trActive: {
    backgroundColor: '#f0f9ff'
  },
  td: {
    padding: '14px 16px',
    color: '#334155',
    verticalAlign: 'middle'
  },
  tdActions: {
    padding: '14px 16px',
    verticalAlign: 'middle',
    textAlign: 'right'
  },
  truckPlate: {
    display: 'inline-block',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '3px 8px',
    fontWeight: '700',
    color: '#0f172a',
    fontSize: '0.75rem',
    letterSpacing: '0.02em'
  },
  routeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: '600',
    color: '#1e293b'
  },
  actionRadarBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    color: '#0066cc',
    border: '1px solid #bfdbfe',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  actionRadarBtnActive: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    borderColor: '#0066cc'
  },
  actionDeleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    border: '1px solid #fecdd3',
    borderRadius: '4px',
    padding: '4px 6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  mapSection: {
    position: 'sticky',
    top: '20px'
  },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  mapHeaderInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px'
  },
  mapTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  mapRadarPulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    display: 'inline-block',
    animation: 'pulseGlow 1.5s infinite'
  },
  mapTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  speedTag: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  mapInfoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    backgroundColor: '#f8fafc',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  mapInfoCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  mapCellLabel: {
    fontSize: '0.65rem',
    color: '#64748b',
    fontWeight: '500'
  },
  mapCellVal: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  mapWrapper: {
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px'
  },
  svgMap: {
    width: '100%',
    height: 'auto',
    maxHeight: '340px'
  },
  mapLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '10px',
    fill: '#475569',
    fontWeight: '600'
  },
  bottomLegend: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.68rem',
    color: '#64748b',
    marginTop: '4px'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    marginTop: '16px'
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#334155',
    margin: '0 0 24px 0'
  },
  emptyPaginator: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '0.85rem',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
  },
  pulsingCircle: {
    transformOrigin: 'center'
  }
};
