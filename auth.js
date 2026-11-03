import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const dialog = $("auth-dialog");
const alertBox = $("auth-alert");
const accountButton = $("account-button");
const authForm = $("auth-form");
const signOutButton = $("sign-out");
const defaultMessage = "Sign in to sync your progress across devices. Your existing guest progress stays on this browser.";
const ready = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
let auth = null;
let db = null;
let currentUser = null;
let sdkAuth = null;
let sdkDb = null;
let syncQueue = Promise.resolve();

function message(text, error = false) {
  alertBox.textContent = text;
  alertBox.style.color = error ? "var(--bad)" : "var(--muted)";
}
function friendlyError(err) {
  const errors = {
    "auth/email-already-in-use": "This email already has an account. Try signing in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/weak-password": "Please choose a stronger password (at least 6 characters).",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Allow pop-ups for this website to use Google sign-in.",
    "auth/unauthorized-domain": "Add b0og.github.io to Firebase Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed": "This sign-in method has not been enabled in the Firebase console.",
    "permission-denied": "Cloud progress access was blocked. Check your Firestore security rules."
  };
  return errors[err?.code] || err?.message || "An unexpected error occurred.";
}
function setSignedOut() {
  currentUser = null;
  accountButton.textContent = "Sign in";
  signOutButton.classList.add("hidden");
  authForm.classList.remove("hidden");
  $("sign-in-google").classList.remove("hidden");
  $("reset-password").classList.remove("hidden");
  window.ExamQuiz?.onSignOut();
  window.ExamQuiz?.showAccountStatus("Guest · Progress on this device");
}
function setSignedIn(user) {
  accountButton.textContent = "Account";
  signOutButton.classList.remove("hidden");
  authForm.classList.add("hidden");
  $("sign-in-google").classList.add("hidden");
  $("reset-password").classList.add("hidden");
  window.ExamQuiz?.showAccountStatus(user.email || "Signed in");
}
function updateStatus() {
  if (!ready) {
    message("Login is not active yet. The owner must finish the one-time Firebase setup. You can continue using the quiz as a guest.");
    return;
  }
  message(currentUser ? "Signed in as " + (currentUser.email || "student") + ". Your answers are saved in your account." : defaultMessage);
}
accountButton.addEventListener("click", () => {
  updateStatus();
  if (!dialog.open) dialog.showModal();
});
$("close-auth").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
function requireSetup() {
  if (ready && auth) return true;
  updateStatus();
  return false;
}
async function doAuth(action) {
  if (!requireSetup()) return;
  try {
    message("Connecting…");
    await action();
    dialog.close();
  } catch (error) {
    message(friendlyError(error), true);
  }
}
authForm.addEventListener("submit", event => {
  event.preventDefault();
  const email = $("auth-email").value.trim();
  const password = $("auth-password").value;
  void doAuth(() => sdkAuth.signInWithEmailAndPassword(auth, email, password));
});
$("sign-up-email").addEventListener("click", () => {
  if (!authForm.reportValidity()) return;
  const email = $("auth-email").value.trim();
  const password = $("auth-password").value;
  void doAuth(() => sdkAuth.createUserWithEmailAndPassword(auth, email, password));
});
$("sign-in-google").addEventListener("click", () => {
  void doAuth(() => sdkAuth.signInWithPopup(auth, new sdkAuth.GoogleAuthProvider()));
});
$("reset-password").addEventListener("click", async () => {
  if (!requireSetup()) return;
  const email = $("auth-email").value.trim();
  if (!email) {
    message("Enter your email address above, then click Reset password.", true);
    return;
  }
  try {
    await sdkAuth.sendPasswordResetEmail(auth, email);
    message("If an account exists for that address, password reset instructions will be emailed.");
  } catch (error) {
    message(friendlyError(error), true);
  }
});
signOutButton.addEventListener("click", async () => {
  if (!auth) return;
  try {
    await sdkAuth.signOut(auth);
    dialog.close();
  } catch (error) {
    message(friendlyError(error), true);
  }
});

window.ExamAuth = {
  saveChanges(changes) {
    if (!ready || !db || !currentUser) return Promise.reject(Error("Not signed in to Firebase."));
    const uid = currentUser.uid;
    const entries = Object.entries(changes || {}).filter(([id, value]) =>
      typeof id === "string" && !!id && !id.includes("/") &&
      value && typeof value === "object" && Array.isArray(value.attempts)
    );
    if (!entries.length) return Promise.resolve();
    syncQueue = syncQueue.catch(() => {}).then(async () => {
      for (let i = 0; i < entries.length; i += 300) {
        const batch = sdkDb.writeBatch(db);
        for (const [id, value] of entries.slice(i, i + 300)) {
          batch.set(
            sdkDb.doc(db, "users", uid, "progress", id),
            {
              attempts: value.attempts,
              bookmark: !!value.bookmark,
              updatedAt: sdkDb.serverTimestamp()
            }
          );
        }
        await batch.commit();
      }
      if (currentUser?.uid === uid) {
        window.ExamQuiz?.showAccountStatus("✓ Synced · " + (currentUser.email || "Signed in"));
      }
    });
    return syncQueue;
  },
  showSyncError(error) {
    window.ExamQuiz?.showAccountStatus("Cloud sync failed · local backup retained");
    console.error("Progress sync failed", error);
  }
};

if (!ready) {
  window.ExamQuiz?.showAccountStatus("Guest · Sign-in not configured");
  for (const id of ["auth-email", "auth-password", "sign-in-email", "sign-up-email", "sign-in-google", "reset-password"]) {
    $(id).disabled = true;
  }
} else {
  try {
    const [appModule, authModule, firestoreModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js")
    ]);
    sdkAuth = authModule;
    sdkDb = firestoreModule;
    const app = appModule.initializeApp(firebaseConfig);
    auth = sdkAuth.getAuth(app);
    db = sdkDb.getFirestore(app);
    sdkAuth.onAuthStateChanged(auth, async user => {
      if (!user) {
        setSignedOut();
        updateStatus();
        return;
      }
      currentUser = user;
      setSignedIn(user);
      window.ExamQuiz?.showAccountStatus("Loading cloud progress…");
      try {
        const snapshot = await sdkDb.getDocs(sdkDb.collection(db, "users", user.uid, "progress"));
        if (currentUser?.uid !== user.uid) return;
        const cloud = {};
        snapshot.forEach(doc => {
          const value = doc.data();
          cloud[doc.id] = {
            attempts: Array.isArray(value.attempts) ? value.attempts : [],
            bookmark: !!value.bookmark
          };
        });
        await window.ExamQuiz.onSignIn(user.uid, cloud);
        window.ExamQuiz?.showAccountStatus("✓ Synced · " + (user.email || "Signed in"));
      } catch (error) {
        // Failed reads must not overwrite the cloud state.
        window.ExamQuiz?.showAccountStatus("Cloud unavailable · guest progress retained");
        message("Couldn't load your cloud progress: " + friendlyError(error), true);
      }
    }, error => {
      message(friendlyError(error), true);
      window.ExamQuiz?.showAccountStatus("Sign-in unavailable");
    });
  } catch (error) {
    window.ExamQuiz?.showAccountStatus("Sign-in setup error · guest mode available");
    message("Firebase could not initialize: " + friendlyError(error), true);
    console.error(error);
  }
}
