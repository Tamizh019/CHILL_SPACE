# Chill Space

A modern, real-time group chat and file sharing web application built with Supabase.

---

## 🚀 Features

- **Real-time Group Chat**: Instantly send and receive messages with all online users.
- **User Roles**: Each user has a role (Admin, Moderator, VIP, User) shown beside their name in chat and member lists.
- **Online Presence**: See who is online in real time.
- **File Sharing**: Upload, download, and share files with the group. Preview selected files before uploading.
- **Code Snippets**: Send code with syntax highlighting and language selection.
- **Emoji Picker**: Express yourself with a built-in emoji picker.
- **Responsive UI**: Beautiful, mobile-friendly design with dark mode and glassmorphism effects.
- **Authentication**: Secure registration, login, and password reset via Supabase Auth.
- **Email Integration**: Customizable email templates for welcome and password reset (see `SMTP_SETUP_GUIDE.md`).
- **Toast Notifications**: Friendly feedback for all actions (success, error, info).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Poppins font, custom styles), Vanilla JS
- **Backend/Realtime**: [Supabase](https://supabase.com/) (Auth, Database, Storage, Realtime)
- **Live Development**: [live-server](https://www.npmjs.com/package/live-server)

---

## 📦 Project Structure

```
LOGIN_PAGE/
  ├── home.html              # Main app (chat, files, members)
  ├── index.html             # Login page
  ├── register.html          # Registration page
  ├── reset-password.html    # Password reset page
  ├── supabase-config.js     # Supabase client config
  ├── SMTP_SETUP_GUIDE.md    # Email setup guide
  ├── package.json           # Project metadata & scripts
  ├── package-lock.json      # Dependency lockfile
  └── Assets/                # Images and static assets
```

---

## ⚡ Getting Started

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd LOGIN_PAGE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase
- Update your Supabase URL and Anon Key in `ho.html`, `index.html`, `register.html`, and `reset-password.html` if needed.
- Set up your Supabase tables: `users`, `messages`, `files` (see schema in code or ask for SQL).
- (Optional) Configure SMTP for email in Supabase dashboard (see `SMTP_SETUP_GUIDE.md`).

### 4. Run Locally
```bash
npm run dev
```
- Visit [http://localhost:8080](http://localhost:8080) (or the port shown) in your browser.

---

## ✨ Usage
- **Register** a new account or **login** with your credentials.
- **Chat** in real time with all online users.
- **Share files** by uploading in the sidebar.
- **Send code** by toggling code mode in the chat input.
- **Pick emojis** to add fun to your messages.
- **Reset your password** via the reset link if needed.

---

## 📝 Customization
- **Roles**: Assign roles (admin, moderator, etc.) in the Supabase `users` table.
- **Email Templates**: Customize emails in Supabase Auth settings (see `SMTP_SETUP_GUIDE.md`).
- **Styling**: Tweak CSS in `ho.html` for your own look and feel.

---

## 🙏 Credits
- **UI/UX & Code**: Tamizh & Chill Space Team
- **Supabase**: For the amazing open-source backend
- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins)
- **Icons**: [Font Awesome](https://fontawesome.com/)

---

## 📬 Feedback & Support
- [Report a bug / Suggest a feature](https://docs.google.com/forms/d/e/1FAIpQLSeZq1r-dkj_B6La2_owrnof10yGgF4AWWfqYHktguRD9Tfe7g/viewform?usp=dialog)
- Email: jefftamizh01@gmail.com
- GitHub: [Tamizh019](https://github.com/Tamizh019)

---

## ⚠️ License
 For educational purposes only.
