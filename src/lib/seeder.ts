import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, getDocs, deleteDoc, writeBatch } from "firebase/firestore";

/**
 * GENERATES REALISTIC CAMPUS ENERGY DATA
 * - High usage during class hours (08:00 - 16:00)
 * - Low usage at night/early morning
 */
export async function clearSensorHistory() {
  const colRef = collection(db, "sensor_history");
  const q = query(colRef);
  const existingDocs = await getDocs(q);
  
  if (existingDocs.size > 0) {
    const batch = writeBatch(db);
    existingDocs.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    return existingDocs.size;
  }
  return 0;
}

export async function seedSensorHistory() {
  const colRef = collection(db, "sensor_history");
  
  // 1. Clear existing history before seeding
  await clearSensorHistory();
  console.log("🧹 Previous history cleared");

  const now = new Date();
  const batch = writeBatch(db);
  let count = 0;

  // Generate data for the last 7 days (hourly)
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - day);
      timestamp.setHours(hour, 0, 0, 0);

      // --- 🧠 CAMPUS HOUR LOGIC ---
      let watt = 0;
      if (hour >= 8 && hour <= 16) {
        // Active hours (Building full)
        watt = 450 + Math.random() * 150;
      } else if (hour >= 17 && hour <= 21) {
        // Late hours (Some classes/staff)
        watt = 200 + Math.random() * 100;
      } else {
        // Night/Early morning (Idle)
        watt = 100 + Math.random() * 50;
      }

      const docRef = addDoc(colRef, {
        watt: parseFloat(watt.toFixed(2)),
        volt: parseFloat((218 + Math.random() * 5).toFixed(1)),
        ampere: parseFloat((watt / 220).toFixed(2)),
        timestamp: Timestamp.fromDate(timestamp)
      });
      
      count++;
    }
  }

  console.log(`✅ Successfully seeded ${count} historical entries to Firebase`);
  return count;
}
