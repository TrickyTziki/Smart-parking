import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Button, Input, Icon } from '../../../components';
import type { ParkingEvent } from '../../../types';
import { getRegistrationUrl, copyToClipboard } from '../../../lib/utils';
import styles from '../../../styles/ShareModal.module.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ParkingEvent;
}

export function ShareModal({ isOpen, onClose, event }: ShareModalProps) {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);
  const registrationUrl = getRegistrationUrl(event.accessCode);

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(registrationUrl);
      setCopied('link');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await copyToClipboard(event.accessCode);
      setCopied('code');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Event" size="medium">
      <div className={styles.content}>
        <p className={styles.description}>
          Share this link or access code with your guests so they can register
          for parking.
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Registration Link</h3>
          <div className={styles.copyField}>
            <Input
              value={registrationUrl}
              readOnly
              aria-label="Registration URL"
            />
            <Button onClick={handleCopyLink} variant="secondary">
              {copied === 'link' ? (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={styles.copied}
                >
                  <Icon name="check" size="sm" />
                  Copied!
                </motion.span>
              ) : (
                <>
                  <Icon name="copy" size="sm" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Access Code</h3>
          <p className={styles.hint}>
            Guests can enter this code at the registration page.
          </p>
          <div className={styles.codeContainer}>
            <span className={styles.accessCode}>{event.accessCode}</span>
            <Button onClick={handleCopyCode} variant="ghost" size="small">
              {copied === 'code' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={onClose} fullWidth>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
