import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { getFirebaseAuth } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  emailVerified: boolean;
}

class AuthService {
  private auth = getFirebaseAuth();
  private db = getDb();

  /**
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      await setDoc(doc(this.db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        emailVerified: user.emailVerified,
        betaTester: true
      });

      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await setDoc(
        doc(this.db, 'users', user.uid),
        {
          lastLoginAt: serverTimestamp()
        },
        { merge: true }
      );

      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(this.db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          createdAt: data.createdAt?.toDate(),
          lastLoginAt: data.lastLoginAt?.toDate(),
          emailVerified: data.emailVerified
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: any): Error {
    const errorCode = error.code;
    let message = 'An error occurred during authentication';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password accounts are not enabled';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      default:
        message = error.message;
    }

    return new Error(message);
  }
}

export const authService = new AuthService();
