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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const cookie = Cookies.get("token");
  if (cookie) {
    return children;
  } else {
    return <Navigate to="/auth/login" />;
  }
};

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardingCarousel />} />
        <Route path="/auth/register" element={<SignUpForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >          <Route index element={<Home />} />
          <Route path="accept-invitation" element={<InvitationPage />} />
          <Route path="suggestions" element={<Suggestions />} />
          <Route path="unlocking" element={<Unlocking />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="notifications" element={<NotificationsScreen />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="friends" element={<FriendFinder />} />
          <Route path="editor" element={<PhotoEditor />} />

          <Route path="creategroup" element={<GroupPage />} />
          <Route path="createcapsule" element={<CapsulePage />} />

        </Route>
        <Route path="friends" element={<FriendFinder />} />
      </Routes>
    </>
  );
}
