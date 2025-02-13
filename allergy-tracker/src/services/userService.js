import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId, 'profile', 'info');
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // Create default profile if it doesn't exist
      const defaultProfile = {
        name: '',
        age: '',
        knownAllergies: []
      };
      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId, 'profile', 'info');
    await updateDoc(userRef, profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addKnownAllergy = async (userId, allergy) => {
  try {
    const userRef = doc(db, 'users', userId, 'profile', 'info');
    await updateDoc(userRef, {
      knownAllergies: arrayUnion(allergy)
    });
  } catch (error) {
    console.error('Error adding known allergy:', error);
    throw error;
  }
};

export const removeKnownAllergy = async (userId, allergy) => {
  try {
    const userRef = doc(db, 'users', userId, 'profile', 'info');
    await updateDoc(userRef, {
      knownAllergies: arrayRemove(allergy)
    });
  } catch (error) {
    console.error('Error removing known allergy:', error);
    throw error;
  }
};