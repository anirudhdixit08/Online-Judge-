// import { Routes, Route, Navigate } from "react-router";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Homepage from "./pages/Homepage";
// import { checkAuth } from "./slices/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import Navbar from "./components/Navbar";
// import LandingPage from "./pages/LandingPage";
// import Footer from "./components/Footer";
// import Problemset from "./pages/Problemset";
// import AdminPanel from "./pages/AdminPanel";

// function App() {
//   const { isAuthenticated ,user} = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   return (
//     <>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={isAuthenticated ? <Homepage /> : <LandingPage />} />
//         <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
//         <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
//         <Route 
//             path="/problems" 
//             element={isAuthenticated ? <Problemset /> : <Navigate to="/login" />} 
//           />
//         <Route 
//             path="/admin" 
//             element={isAuthenticated && user?.role =='admin' ? <AdminPanel /> : <Navigate to="/" />} 
//           />
//       </Routes>

//       <Footer />
//     </>
//   );
// }

// export default App;

// import { Routes, Route, Navigate } from "react-router";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Homepage from "./pages/Homepage";
// import { checkAuth } from "./slices/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import Navbar from "./components/Navbar";
// import LandingPage from "./pages/LandingPage";
// import Footer from "./components/Footer";
// import Problemset from "./pages/Problemset";
// import AdminPanel from "./pages/AdminPanel"; // 1. Import AdminPanel

// function App() {
//   // 2. Add 'user' to the selector
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   return (
//     <>
//       <Navbar />

//       <Routes>
//         <Route 
//           path="/" 
//           element={isAuthenticated ? <Homepage /> : <LandingPage />} 
//         />
//         <Route 
//           path="/login" 
//           element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
//         />
//         <Route 
//           path="/signup" 
//           element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
//         />
//         <Route 
//           path="/problems" 
//           element={isAuthenticated ? <Problemset /> : <Navigate to="/login" />} 
//         />
        
//         {/* 3. Add the new /admin route with the logic you wanted */}
//         <Route 
//           path="/admin" 
//           element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} 
//         />
//       </Routes>

//       <Footer />
//     </>
//   );
// }

// export default App;

// import { Routes, Route, Navigate } from "react-router";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { Toaster } from 'react-hot-toast'; // For notifications

// // Page Imports
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Homepage from "./pages/Homepage";
// import LandingPage from "./pages/LandingPage";
// import Problemset from "./pages/Problemset";
// import AdminPanel from "./pages/AdminPanel"; 

// // Component Imports
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// // Slice Imports
// import { checkAuth } from "./slices/authSlice";

// function App() {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   return (
//     // 1. This div makes the entire app a flex column and
//     //    ensures it's at least as tall as the screen.
//     <div className="flex flex-col min-h-screen bg-base-200">
//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//       <Navbar />

//       {/* 2. This 'main' tag will grow to fill all available space,
//            pushing the footer down. */}
//       <main className="flex-grow">
//         <Routes>
//           <Route 
//             path="/" 
//             element={isAuthenticated ? <Homepage /> : <LandingPage />} 
//           />
//           <Route 
//             path="/login" 
//             element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
//           />
//           <Route 
//             path="/signup" 
//             element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
//           />
//           <Route 
//             path="/problems" 
//             element={isAuthenticated ? <Problemset /> : <Navigate to="/login" />} 
//           />
//           <Route 
//             path="/admin" 
//             element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} 
//           />
//         </Routes>
//       </main>

//       {/* 3. The Footer will now be at the bottom */}
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast'; // Import Toaster

// Page Imports
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/LandingPage";
import Problemset from "./pages/Problemset";
import AdminPanel from "./pages/AdminPanel"; 

// Component Imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Slice Imports
import { checkAuth } from "./slices/authSlice";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    // 1. This div makes the entire app a flex column and
    //    ensures it's at least as tall as the screen.
    <div className="flex flex-col min-h-screen bg-base-200">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Navbar />

      {/* 2. This 'main' tag will grow to fill all available space,
           pushing the footer down. */}
      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Homepage /> : <LandingPage />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
          />
          <Route 
            path="/problems" 
            element={isAuthenticated ? <Problemset /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/manage-problems" 
            element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>

      {/* 3. The Footer will now be at the bottom */}
      <Footer />
    </div>
  );
}

export default App;