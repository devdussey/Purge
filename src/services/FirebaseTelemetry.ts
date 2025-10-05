import {
  collection,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc,
  Timestamp
} from 'firebase/firestore';
import { getDb, COLLECTIONS, isFirebaseConfigured } from '../config/firebase';
import { TelemetryEvent } from '../engine/TelemetryManager';

export interface FirebaseTelemetryEvent extends Omit<TelemetryEvent, 'timestamp'> {
  timestamp: Timestamp | Date;
  appVersion: string;
  platform: string;
}

export interface CrashReport {
  error: {
    message: string;
    stack?: string;
  };
  userComments?: string;
  includeSystemInfo: boolean;
  systemInfo?: {
    platform: string;
    appVersion: string;
    userAgent: string;
  };
  timestamp: Timestamp | Date;
  sessionId: string;
}

export interface BetaFeedback {
  type: 'bug' | 'feature' | 'praise';
  message: string;
  email?: string;
  includeScreenshot: boolean;
  timestamp: Timestamp | Date;
  appVersion: string;
}

export class FirebaseTelemetryService {
  private appVersion: string = '1.0.2'; // Should match package.json
  private platform: string = 'electron';

  constructor() {
    // Initialize platform info
    if (typeof window !== 'undefined') {
      this.platform = window.navigator.platform;
    }
  }

  /**
   * Send telemetry events to Firebase
   */
  async sendTelemetryEvents(events: TelemetryEvent[]): Promise<void> {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured, skipping telemetry');
      return;
    }

    try {
      const db = getDb();
      const batch = writeBatch(db);

      events.forEach((event) => {
        const docRef = doc(collection(db, COLLECTIONS.TELEMETRY_EVENTS));
        const firebaseEvent: FirebaseTelemetryEvent = {
          ...event,
          timestamp: serverTimestamp() as Timestamp,
          appVersion: this.appVersion,
          platform: this.platform
        };
        batch.set(docRef, firebaseEvent);
      });

      await batch.commit();
      console.log(`Sent ${events.length} telemetry events to Firebase`);
    } catch (error) {
      console.error('Failed to send telemetry events:', error);
      throw error;
    }
  }

  /**
   * Send a single telemetry event
   */
  async sendTelemetryEvent(event: TelemetryEvent): Promise<void> {
    return this.sendTelemetryEvents([event]);
  }

  /**
   * Report a crash to Firebase
   */
  async reportCrash(crashReport: Omit<CrashReport, 'timestamp' | 'appVersion' | 'platform'>): Promise<void> {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured, skipping crash report');
      return;
    }

    try {
      const db = getDb();
      const report: CrashReport = {
        ...crashReport,
        timestamp: serverTimestamp() as Timestamp,
        systemInfo: crashReport.includeSystemInfo ? {
          platform: this.platform,
          appVersion: this.appVersion,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
        } : undefined
      };

      await addDoc(collection(db, COLLECTIONS.CRASH_REPORTS), report);
      console.log('Crash report sent to Firebase');
    } catch (error) {
      console.error('Failed to send crash report:', error);
      throw error;
    }
  }

  /**
   * Submit beta feedback
   */
  async submitFeedback(feedback: Omit<BetaFeedback, 'timestamp' | 'appVersion'>): Promise<void> {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured, skipping feedback');
      return;
    }

    try {
      const db = getDb();
      const feedbackData: BetaFeedback = {
        ...feedback,
        timestamp: serverTimestamp() as Timestamp,
        appVersion: this.appVersion
      };

      await addDoc(collection(db, COLLECTIONS.FEEDBACK), feedbackData);
      console.log('Feedback submitted to Firebase');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  /**
   * Track a beta user session
   */
  async trackUserSession(sessionId: string, data?: any): Promise<void> {
    if (!isFirebaseConfigured()) {
      return;
    }

    try {
      const db = getDb();
      await addDoc(collection(db, COLLECTIONS.USERS), {
        sessionId,
        timestamp: serverTimestamp(),
        appVersion: this.appVersion,
        platform: this.platform,
        ...data
      });
    } catch (error) {
      console.error('Failed to track user session:', error);
      // Don't throw - this is non-critical
    }
  }

  /**
   * Check if Firebase is ready
   */
  isConfigured(): boolean {
    return isFirebaseConfigured();
  }
}

// Singleton instance
export const firebaseTelemetry = new FirebaseTelemetryService();
