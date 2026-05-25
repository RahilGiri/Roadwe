import React from 'react';
import { Home, ShieldCheck, Zap, Award } from 'lucide-react';

export default function Subscription() {
  const handleBuy = (planName, price) => {
    alert(`💳 Processing payment gateway checkout for the ${planName} Plan (₹${price})!`);
  };

  return (
    <div style={styles.container}>
      {/* Breadcrumbs matching Screenshot 1 */}
      <div style={styles.breadcrumbs}>
        <Home size={14} style={{ marginRight: '4px' }} />
        <span>Home</span>
        <span style={styles.breadcrumbSeparator}>&gt;</span>
        <span style={styles.breadcrumbActive}>Subscription</span>
      </div>

      <div style={styles.mainCard}>
        <div style={styles.header}>
          <h2 style={styles.title}>Subscription Details</h2>
        </div>

        {/* Subscription Info card body */}
        <div style={styles.infoSection}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Current Pack :</span>
            <span style={styles.badgeGreen}>Gold</span>
          </div>

          <div style={styles.datesRow}>
            <div style={styles.dateBlock}>
              <span style={styles.dateLabel}>Pack Started Date :</span>
              <span style={styles.badgeGreenDate}>2026-03-16</span>
            </div>
            <div style={styles.dateBlock}>
              <span style={styles.dateLabel}>Expiry Date :</span>
              <span style={styles.badgeGreenDate}>2026-09-16</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <span style={styles.progressText}>126 Days Left</span>
            </div>
          </div>
        </div>

        {/* Available Recharge Plans Banner */}
        <div style={styles.plansSection}>
          <div style={styles.plansHeaderBanner}>
            <h3 style={styles.plansTitle}>Available Recharge Plans</h3>
          </div>

          <div style={styles.plansGrid}>
            {/* 1. Silver Plan */}
            <div style={styles.planCard}>
              <div style={{ ...styles.planIconCircle, borderColor: '#3b82f6', color: '#3b82f6' }}>
                <span style={styles.planRupee}>₹</span>
              </div>
              <div style={styles.planPriceGroup}>
                <span style={styles.priceNum}>299</span>
                <span style={{ ...styles.planBadge, backgroundColor: '#3b82f6' }}>Silver</span>
              </div>
              <h4 style={styles.planDuration}>Pack for 3 Months</h4>
              
              <div style={styles.featuresList}>
                <p style={styles.featureText}>Unlimited with all functionality</p>
                <p style={styles.featureText}>Create, Edit, Share and Download your Bilty, Load Advice, Invoice and Ledger anytime anywhere</p>
                <p style={styles.featureText}>Synchronized Web App as well as Mobile App</p>
                <p style={styles.featureText}>Get 24/7 Support.</p>
              </div>

              <button 
                style={{ ...styles.buyBtn, backgroundColor: '#1d4ed8' }} 
                onClick={() => handleBuy('Silver', 299)}
              >
                Buy Now
              </button>
            </div>

            {/* 2. Gold Plan */}
            <div style={styles.planCard}>
              <div style={{ ...styles.planIconCircle, borderColor: '#eab308', color: '#eab308' }}>
                <span style={styles.planRupee}>₹</span>
              </div>
              <div style={styles.planPriceGroup}>
                <span style={styles.priceNum}>499</span>
                <span style={{ ...styles.planBadge, backgroundColor: '#eab308' }}>Gold</span>
              </div>
              <h4 style={styles.planDuration}>Pack for 6 Months</h4>
              
              <div style={styles.featuresList}>
                <p style={styles.featureText}>Unlimited with all functionality</p>
                <p style={styles.featureText}>Create, Edit, Share and Download your Bilty, Load Advice, Invoice and Ledger anytime anywhere</p>
                <p style={styles.featureText}>Synchronized Web App as well as Mobile App</p>
                <p style={styles.featureText}>Get 24/7 Support.</p>
              </div>

              <button 
                style={{ ...styles.buyBtn, backgroundColor: '#d97706', color: '#ffffff' }} 
                onClick={() => handleBuy('Gold', 499)}
              >
                Buy Now
              </button>
            </div>

            {/* 3. Platinum Plan */}
            <div style={styles.planCard}>
              <div style={{ ...styles.planIconCircle, borderColor: '#6b7280', color: '#374151' }}>
                <span style={styles.planRupee}>₹</span>
              </div>
              <div style={styles.planPriceGroup}>
                <span style={styles.priceNum}>899</span>
                <span style={{ ...styles.planBadge, backgroundColor: '#1f2937' }}>Platinum</span>
              </div>
              <h4 style={styles.planDuration}>Pack for 12 Months</h4>
              
              <div style={styles.featuresList}>
                <p style={styles.featureText}>Unlimited with all functionality</p>
                <p style={styles.featureText}>Create, Edit, Share and Download your Bilty, Load Advice, Invoice and Ledger anytime anywhere</p>
                <p style={styles.featureText}>Synchronized Web App as well as Mobile App</p>
                <p style={styles.featureText}>Get 24/7 Support.</p>
              </div>

              <button 
                style={{ ...styles.buyBtn, backgroundColor: '#1e293b' }} 
                onClick={() => handleBuy('Platinum', 899)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#64748b'
  },
  breadcrumbSeparator: {
    color: '#94a3b8'
  },
  breadcrumbActive: {
    color: '#0f172a',
    fontWeight: '700'
  },
  mainCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  header: {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '16px',
    marginBottom: '20px'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0f172a'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  infoLabel: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b'
  },
  badgeGreen: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  datesRow: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap'
  },
  dateBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  dateLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#334155'
  },
  badgeGreenDate: {
    backgroundColor: '#00b050',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '700'
  },
  progressContainer: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
    height: '32px',
    marginTop: '8px'
  },
  progressBar: {
    width: '74%', // representing the ratio of days left
    backgroundColor: '#00b050',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  plansSection: {
    marginTop: '20px'
  },
  plansHeaderBanner: {
    backgroundColor: '#e8f0fe',
    border: '1px solid #d2e3fc',
    borderRadius: '6px',
    padding: '12px 20px',
    textAlign: 'center',
    marginBottom: '28px'
  },
  plansTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#1a73e8',
    margin: 0
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  planCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    position: 'relative',
    transition: 'all 0.3s'
  },
  planIconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  planRupee: {
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  planPriceGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  priceNum: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0f172a'
  },
  planBadge: {
    color: '#ffffff',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  planDuration: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#475569',
    marginBottom: '20px'
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    flex: 1,
    marginBottom: '28px'
  },
  featureText: {
    fontSize: '0.8rem',
    color: '#64748b',
    lineHeight: '1.5',
    margin: 0
  },
  buyBtn: {
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 24px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.2s'
  }
};
