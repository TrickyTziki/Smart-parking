import { Outlet } from 'react-router-dom';
import { Icon } from '../../components';
import styles from '../../styles/MainLayout.module.css';

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoMark}>
              <Icon name="parking" size="lg" />
            </div>
            <span className={styles.logoText}>ParkingHub</span>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Event Parking Management System
          </p>
          <div className={styles.footerDivider} aria-hidden="true" />
          <p className={styles.footerCopyright}>
            Built with precision
          </p>
        </div>
      </footer>
    </div>
  );
}
