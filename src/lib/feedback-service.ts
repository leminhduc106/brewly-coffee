import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function submitOrderFeedback(orderId: string, rating: number, feedback: string) {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    rating,
    feedback,
  });
}
