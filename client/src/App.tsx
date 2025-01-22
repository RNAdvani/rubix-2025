import { Routes, Route } from "react-router-dom";
import { OnboardingCarousel } from "./components/carousel-demo";
import Suggestions from "./pages/suggestions";
import Unlocking from "./pages/unlocking";
import { SignUpForm } from "./components/sign-up-form";
import Dashboard from "./pages/dashboard";
import UserProfile from "./components/user-profile";
import SearchScreen from "./pages/search";
import NotificationsScreen from "./pages/notifications";
import FriendFinder from "./components/friend-finder";
import Home from "./pages/home";
import PhotoEditor from "./components/image-editor/editor";
import InvitationPage from "./pages/acceptInvitation";
import TimeCapsuleDialog from "./components/modals/CreateCapsuleDialog";
// import { SignUpForm } from "./components/sign-up-form";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardingCarousel />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/unlocking" element={<Unlocking />} />
        <Route path="/editor" element={<PhotoEditor />} />
        <Route path="/accept-invitation" element={<InvitationPage />} />
        <Route path="/auth/register" element={<SignUpForm />} />
        <Route path="/auth/login" element={<SignUpForm />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="notifications" element={<NotificationsScreen />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="peeps" element={<FriendFinder />} />
        </Route>
        <Route path="peeps" element={<FriendFinder />} />
      </Routes>
    </>
  );
}
