import { Navigate, Route, Routes } from "react-router-dom";
import { OnboardingCarousel } from "./components/carousel-demo";
import FriendFinder from "./components/friend-finder";
import PhotoEditor from "./components/image-editor/editor";
import { SignUpForm } from "./components/sign-up-form";
import UserProfile from "./components/user-profile";
import InvitationPage from "./pages/acceptInvitation";
import CapsulePage from "./pages/createcapsule";
import GroupPage from "./pages/creategroup";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import NotificationsScreen from "./pages/notifications";
import SearchScreen from "./pages/search";
import Suggestions from "./pages/suggestions";
import Unlocking from "./pages/unlocking";
import Cookies from "js-cookie";
import { LoginForm } from "./components/login-form";
import AudioRecorder from "./components/audio-recorder";
import ReviewPage from "./components/review-page";
import { useEffect } from "react";
import { User } from "./lib/types";
import { api } from "./lib/api";
import { useUser } from "./components/hooks/use-user";
import Capsule from "./pages/capsule";
import Story from "./pages/story";
import ConsentUI from "./pages/consentui";
import Genai from "./pages/genai";
import SteganographyApp from "./pages/steganography";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const cookie = Cookies.get("token");
   if (cookie) {
      return children;
   } else {
      return <Navigate to="/auth/login" />;
   }
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
   const cookie = Cookies.get("token");
   if (cookie) {
      return <Navigate to="/dashboard" />;
   } else {
      return children;
   }
};

export default function App() {
   const { setUser } = useUser();

   useEffect(() => {
      const getUser = async () => {
         const res = await api.get("/api/auth/current-user");

         if (res.data.success) {
            setUser(res.data.data as User);
         }
      };
      getUser();
   }, []);

   return (
      <>
         <Routes>
            <Route path="/" element={<OnboardingCarousel />} />
            <Route
               path="/auth/register"
               element={
                  <AuthRoute>
                     <SignUpForm />
                  </AuthRoute>
               }
            />
            <Route
               path="/auth/login"
               element={
                  <AuthRoute>
                     <LoginForm />
                  </AuthRoute>
               }
            />
            <Route
               path="/dashboard"
               element={
                  <ProtectedRoute>
                     <Dashboard />
                  </ProtectedRoute>
               }
            >
               <Route index element={<Home />} />
               <Route path="accept-invitation" element={<InvitationPage />} />
               <Route path="ai" element={<SearchScreen />} />
               <Route path="ai/consent" element={<ConsentUI/>}/>
               <Route path="ai/ask" element={<Genai/>}/>
               <Route path="ai/fam" element={<ReviewPage/>}/>
               <Route path="notifications" element={<NotificationsScreen />} />
               <Route path="profile" element={<UserProfile />} />
               <Route path="friends" element={<FriendFinder />} />
               <Route path="test" element={<AudioRecorder />} />
               <Route path="editor" element={<PhotoEditor />} />
               <Route path="creategroup" element={<GroupPage />} />
               <Route
                  path="createcapsule/suggestions"
                  element={<Suggestions />}
               />
               <Route path="createcapsule" element={<CapsulePage />} />
            </Route>
            <Route
               path=""
               element={
                  <ProtectedRoute>
                     <Dashboard />
                  </ProtectedRoute>
               }
            >
               <Route path="unlocking/:id" element={<Unlocking />} />
               <Route path="capsule/:id" element={<Capsule />} />
               <Route path="friends" element={<FriendFinder />} />
            </Route>
            <Route
               path="story/:id"
               element={
                  <ProtectedRoute>
                     <Story />
                  </ProtectedRoute>
               }
            />
            <Route path="steganography" element={<SteganographyApp/>} />
         </Routes>
      </>
   );
}
