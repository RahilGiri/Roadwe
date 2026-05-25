import React from 'react';
import { Folder, Plus, List } from 'lucide-react';

export default function Card({ title, count, onQuickAdd, onViewList }) {
  return (
    <div style={styles.card}>
      {/* Centered Glowing Blue Folder Icon */}
      <div style={styles.folderContainer}>
        <div style={styles.folderCircle}>
          <Folder size={20} fill="#ffffff" stroke="#0066cc" />
        </div>
      </div>

      {/* Label and Count */}
      <div style={styles.textCenter}>
        <span style={styles.title}>{title}</span>
        <h1 style={styles.count}>{count}</h1>
      </div>

      {/* Bottom Control Twin Buttons (Exactly matching screenshot layout) */}
      <div style={styles.buttonRow}>
        <button style={styles.leftBtn} onClick={onQuickAdd} title={`Quick Create ${title}`}>
          <Plus size={16} />
        </button>
        <button style={styles.rightBtn} onClick={onViewList} title={`View All ${title}`}>
          <List size={16} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    minWidth: '150px'
  },
  folderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  folderCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
  },
  textCenter: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#64748b'
  },
  count: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '2rem',
    color: '#0066cc',
    fontWeight: '700',
    lineHeight: '1.1'
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    justifyContent: 'center',
    marginTop: '4px'
  },
  leftBtn: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  rightBtn: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  }
};
