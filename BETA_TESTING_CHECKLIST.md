# SKoRHuB Beta Testing Checklist

Welcome to the SKoRHuB Beta! This checklist covers all the core functionalities of the system from top to bottom. Please use this to guide your testing and report any issues or feedback via the support/feedback forms in the app.

**Note:** Payment and donation features are currently **excluded** from this testing phase.

---

## 1. Authentication & Security
- [ ] **Sign Up**: Create a new account with valid details.
- [ ] **Password Strength**: Verify the strength meter reacts to different password complexities.
- [ ] **Sign In**: Log in with your new credentials.
- [ ] **Forgot Password**: Request a password reset email.
- [ ] **Reset Password**: Follow the link in the email and successfully update your password.
- [ ] **Sign Out**: Log out and ensure you are redirected correctly.
- [ ] **Protected Routes**: Try to access `/account` or `/admin` while logged out (should redirect to sign-in).

## 2. Content & Match Discovery
- [ ] **Home Page**: Verify the layout, featured matches, and recent updates load correctly.
- [ ] **Categories**: Browse matches by category and ensure filters work.
- [ ] **Search**: Search for specific matches or teams and verify results.
- [ ] **Match Details**: Click into a match to see the full details, stream links, and metadata.
- [ ] **Schedule**: View upcoming matches in the schedule view and verify dates/times.

## 3. User Dashboard & Personalization
- [ ] **Favorites**: Add a match to your favorites and verify it appears in your `/favorites` page.
- [ ] **Remove Favorites**: Remove a match and ensure it disappears from the list.
- [ ] **Watch History**: Watch a match (or open the match page) and verify it appears in your `/history`.
- [ ] **Account Profile**: Update your name or profile information.
- [ ] **Notification Settings**: Update your notification preferences in settings.

## 4. System Health & Performance
- [ ] **Status Page**: Check the `/status` page to see system health and component status.
- [ ] **Loading States**: Verify that skeleton screens or loading spinners appear while data is fetching.
- [ ] **Responsive Design**: Test the layout on Desktop, Tablet, and Mobile views.
- [ ] **Error Handling**: Verify that "Not Found" (404) and "Error" pages display helpful information if something goes wrong.

## 5. Support & Feedback
- [ ] **Support Form**: Submit a support request through the `/support` page.
- [ ] **Feedback Tool**: Submit general feedback about the app.
- [ ] **Supporters List**: Verify the supporters wall/list displays correctly (excluding active payment testing).

## 6. Administrative Tools (Admin Testers Only)
- [ ] **User Management**: View the list of registered users and inspect specific user profiles.
- [ ] **Content Management**: Test adding, editing, or removing match entries or categories.
- [ ] **Feedback Review**: Access the admin feedback dashboard to view user submissions.
- [ ] **Site Settings**: Modify global site configuration in the admin panel.

---

## Reporting Issues
If you find a bug or have a suggestion, please include:
1. **Device/Browser**: (e.g., iPhone 15 / Safari, Windows 11 / Chrome)
2. **Steps to Reproduce**: What did you do to see the issue?
3. **Expected vs Actual**: What did you expect to happen vs what actually happened?
4. **Screenshots**: Helpful for visual bugs!

Thank you for helping us make SKoRHuB better!
