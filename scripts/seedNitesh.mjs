import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7h44bkM5217V0QaIkBTZokMtaGQaWJJw",
  authDomain: "club-ecd44.firebaseapp.com",
  projectId: "club-ecd44",
  storageBucket: "club-ecd44.firebasestorage.app",
  messagingSenderId: "100476508209",
  appId: "1:100476508209:web:c24a5000a4c2b11c2d1d10"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const memberData = {
  id: 'mem-google-cl3IxHtG3Haf12A7BelIr2ki6mQ2',
  name: 'Nitesh yadav',
  email: 'yadavgolu178@gmail.com',
  phone: '+91 98765 43210',
  photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIZQ2pRZq0OnJiNivtyfvDk_SNB3BLPmRheicMm5uHcK4Yqii73=s96-c',
  address: 'Clubhouse Road',
  city: 'New Delhi',
  bio: 'Club membership applicant registered via Google Sign-In.',
  role: 'GENERAL_MEMBER',
  verificationStatus: 'VERIFIED',
  badges: ['Founding Member', 'VIP Member'],
  birthday: '1995-01-01',
  joinedDate: new Date().toISOString().split('T')[0],
  duesStatus: 'PENDING'
};

async function run() {
  const docRef = doc(db, 'members', memberData.id);
  await setDoc(docRef, memberData, { merge: true });
  console.log(`✅ Member '${memberData.name}' (${memberData.email}) saved to Firestore! Doc ID: ${memberData.id}`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
