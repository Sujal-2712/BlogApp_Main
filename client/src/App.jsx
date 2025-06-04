import Navbar from "./components/navbar.component";
import './index.css';
import { Route, Routes } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import { Toaster } from "react-hot-toast";
import { createContext, useEffect, useState } from "react";
import { lockInSession } from "./common/session";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import Editor from "./pages/editor.pages";
import PageNotFound from "./pages/404.page";
import ManageBlogs from "./pages/manage-blogs.page";
import HomePage from "./pages/home.page";
import Notification from "./pages/notifications.page";
import ChangePassword from "./pages/change-password.page";
import SearchPage from "./pages/search.page";
import ForgotPasswordFlow from "./pages/ForgotPasswordFlow";
import SideNav from "./components/sidenavbar.component";
import EditProfile from "./pages/edit-profile.page";
import ForgotPasswordPage from "./pages/forgot.password"; // Unused? Remove if not used

export const UserContext = createContext();

const App = () => {
    const [userAuth, setUserAuth] = useState({
        access_token: null,
        profile_img: null,
        username: null,
        fullname: null
    });

    useEffect(() => {
        const userInSession = lockInSession("user");
        if (userInSession) {
            setUserAuth(JSON.parse(userInSession));
        } else {
            setUserAuth({
                access_token: "sujal",
                profile_img: "sujal",
                username: "sujal",
                fullname: "sujal"
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Toaster position="top-right" />

            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path="signin" element={<UserAuthForm type="signin" />} />
                    <Route path="signup" element={<UserAuthForm type="signup" />} />
                    <Route path="search/:query" element={<SearchPage />} />
                    <Route path="user/:id" element={<ProfilePage />} />
                    <Route path="blog/:blog_id" element={<BlogPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordFlow />} />
                    <Route path="blog/editor/:blog_id" element={<Editor />} />

                    {/* Dashboard with SideNav layout */}
                    <Route path="dashboard" element={<SideNav />}>
                        <Route path="blogs" element={<ManageBlogs />} />
                        <Route path="notifications" element={<Notification />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>

                    {/* Settings with SideNav layout */}
                    <Route path="settings" element={<SideNav />}>
                        <Route path="edit-profile" element={<EditProfile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>

                    {/* Catch-all for 404 */}
                    <Route path="*" element={<PageNotFound />} />
                </Route>

                {/* Standalone Editor Route (if needed outside Navbar) */}
                <Route path="/editor" element={<Editor />} />
            </Routes>
        </UserContext.Provider>
    );
};

export default App;
