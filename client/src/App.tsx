import { Routes, Route } from "react-router-dom";
import { OnboardingCarousel } from "./components/carousel-demo";
import Suggestions from "./pages/suggestions";
import Unlocking from "./pages/unlocking";
import PhotoEditor from "./components/image-editor/editor";
// import { SignUpForm } from "./components/sign-up-form";

function App() {
  return (
    <>
      {/* <SignUpForm /> */}
      <Routes>
        <Route path="/" element={<OnboardingCarousel />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/unlocking" element={<Unlocking />} />
        <Route path="/editor" element={<PhotoEditor />} />
      </Routes>
    </>
  );
}

export default App;
