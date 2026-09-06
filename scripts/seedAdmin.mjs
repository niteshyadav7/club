import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 'superadmin@gmail.com';
const ADMIN_PASSWORD = 'Nitesh@123';

async function seed() {
  console.log(`\n=============================================`);
  console.log(`🚀 Starting Direct Node Seeding for Super Admin`);
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log(`=============================================\n`);

  let authUser = null;

  // 1. Try to create Firebase Auth user or sign in if already exists
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    authUser = userCredential.user;
    console.log(`✅ Firebase Auth user created successfully! UID: ${authUser.uid}`);
  } catch (authErr) {
    if (authErr.code === 'auth/email-already-in-use') {
      console.log(`ℹ️ Firebase Auth user already exists. Attempting sign-in verification...`);
      try {
        const signinResult = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        authUser = signinResult.user;
        console.log(`✅ Signed in as existing Firebase Auth user. UID: ${authUser.uid}`);
      } catch (signinErr) {
        console.warn(`⚠️ Could not sign in with password (might be email/pass disabled in console):`, signinErr.message);
      }
    } else {
      console.warn(`⚠️ Firebase Auth notice: ${authErr.message}`);
    }
  }

  // 2. Seed Super Admin Document in Firestore
  const superAdminData = {
    id: authUser ? `admin-${authUser.uid}` : 'admin-superadmin',
    name: 'Super Admin',
    email: ADMIN_EMAIL,
    phone: '+91 98000 12345',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    address: 'Executive Suite 1, ClubSphere Governance Headquarters',
    city: 'Mumbai',
    bio: 'Super Administrator with complete governance and approval authority.',
    role: 'ADMIN',
    verificationStatus: 'VERIFIED',
    badges: ['Super Admin', 'Founding Member', 'Core Member', 'VIP Member'],
    birthday: '1990-01-01',
    joinedDate: new Date().toISOString().split('T')[0],
    duesStatus: 'PAID',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'members', superAdminData.id);
    await setDoc(docRef, superAdminData, { merge: true });
    console.log(`✅ Firestore 'members' collection seeded successfully! Doc ID: ${superAdminData.id}`);
  } catch (dbErr) {
    console.error(`\n❌ Firestore Permission Error: ${dbErr.message}`);
    console.log(`\n💡 To enable Firestore write access in your Firebase project (club-ecd44):`);
    console.log(`1. Open https://console.firebase.google.com/project/club-ecd44/firestore/rules`);
    console.log(`2. Update rules to allow read/write:`);
    console.log(`   rules_version = '2';`);
    console.log(`   service cloud.firestore {`);
    console.log(`     match /databases/{database}/documents {`);
    console.log(`       match /{document=**} {`);
    console.log(`         allow read, write: if true;`);
    console.log(`       }`);
    console.log(`     }`);
    console.log(`   }`);
    console.log(`3. Click 'Publish'.\n`);
  }

  console.log(`✨ Seeding completed.\n`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
