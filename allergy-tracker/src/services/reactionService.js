import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const getReactions = async (userId) => {
  try {
    const reactionsRef = collection(db, 'users', userId, 'reactions');
    const q = query(reactionsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting reactions:', error);
    throw error;
  }
};

export const getReaction = async (userId, reactionId) => {
  try {
    const reactionRef = doc(db, 'users', userId, 'reactions', reactionId);
    const reactionSnap = await getDoc(reactionRef);
    
    if (reactionSnap.exists()) {
      return {
        id: reactionSnap.id,
        ...reactionSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting reaction:', error);
    throw error;
  }
};

export const addReaction = async (userId, reactionData) => {
  try {
    const reactionsRef = collection(db, 'users', userId, 'reactions');
    const photoUrls = await uploadPhotos(userId, reactionData.photos);
    
    const reaction = {
      ...reactionData,
      photos: photoUrls,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(reactionsRef, reaction);
    return {
      id: docRef.id,
      ...reaction
    };
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
};

export const updateReaction = async (userId, reactionId, reactionData) => {
  try {
    const reactionRef = doc(db, 'users', userId, 'reactions', reactionId);
    
    // If there are new photos, upload them
    if (reactionData.photos?.length > 0) {
      const photoUrls = await uploadPhotos(userId, reactionData.photos);
      reactionData.photos = photoUrls;
    }
    
    await updateDoc(reactionRef, reactionData);
  } catch (error) {
    console.error('Error updating reaction:', error);
    throw error;
  }
};

export const deleteReaction = async (userId, reactionId) => {
  try {
    // First get the reaction to get photo URLs
    const reaction = await getReaction(userId, reactionId);
    
    // Delete photos from storage
    if (reaction.photos?.length > 0) {
      await Promise.all(
        reaction.photos.map(photoUrl => deletePhoto(photoUrl))
      );
    }
    
    // Delete reaction document
    const reactionRef = doc(db, 'users', userId, 'reactions', reactionId);
    await deleteDoc(reactionRef);
  } catch (error) {
    console.error('Error deleting reaction:', error);
    throw error;
  }
};

// Helper functions for photo handling
const uploadPhotos = async (userId, photos) => {
  if (!photos || photos.length === 0) return [];
  
  const uploadPromises = photos.map(async (photo) => {
    const photoRef = ref(storage, `users/${userId}/photos/${Date.now()}-${photo.name}`);
    const uploadResult = await uploadBytes(photoRef, photo);
    return getDownloadURL(uploadResult.ref);
  });
  
  return Promise.all(uploadPromises);
};

const deletePhoto = async (photoUrl) => {
  try {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
};