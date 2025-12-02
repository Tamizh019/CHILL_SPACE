# Chill Space

**Author: Chill Space Team**  
*A modern, real-time group chat and file sharing web application built with Supabase.*

---

## 📖 Project Story

**The Inspiration Behind Chill Space**

It all started in a college classroom at Sathyabama Institute of Science and Technology. As a Computer Science Engineering student, I often found myself needing to share code snippets, project files, and collaborate with my classmates. The constant hassle of sending individual emails, managing file limits, and juggling multiple platforms for different purposes became frustrating.

But then came the bigger challenge: **our college ethernet network blocked WhatsApp and most social media platforms**. Suddenly, even our usual group chats were inaccessible during college hours when we needed them most - right when we were working on assignments, discussing doubts, and collaborating on projects.

*"You can think - for sharing to group, WhatsApp is already there. But this is in college ethernet, so everything is blocked!"*

That moment of realization sparked the creation of **Chill Space**. We needed a solution that would:
- Work on restrictive college networks
- Allow real-time communication during study hours
- Handle file sharing without external platform dependencies  
- Support code sharing for our programming assignments
- Be accessible through web browsers without app installations

What began as a workaround for network restrictions evolved into a feature-rich platform designed specifically for students and small teams who face similar connectivity challenges. This project represents not just code, but a solution born from necessity - proving that constraints often breed the most innovative solutions.

---

## 🚀 Features

- **Real-time Group Chat**: Instantly send and receive messages with all online users
- **User Roles**: Each user has a role (Admin, Moderator, VIP, User) shown beside their name in chat and member lists
- **Online Presence**: See who is online in real time
- **File Sharing**: Upload, download, and share files with the group. Preview selected files before uploading
- **Code Snippets**: Send code with syntax highlighting and language selection - perfect for sharing homework solutions and project code!
- **Authentication**: Secure registration, login, and password reset via Supabase Auth

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Poppins font, custom styles), Vanilla JS
- **Backend/Realtime**: [Supabase](https://supabase.com/) (Auth, Database, Storage, Realtime)
- **Dependencies**: [ws](https://github.com/websockets/ws), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Live Development**: [live-server](https://www.netlify.com/)

---

## 💡 Why Chill Space?

**Born from Network Restrictions and Student Needs**

As a 19-year-old developer and AI student from Chennai, I created Chill Space to solve real collaboration challenges faced in restrictive network environments:

### The Problem:
- 🚫 **College Networks Block Everything**: WhatsApp, Telegram, Instagram - all blocked during college hours
- 📧 **Email is Too Slow**: Sharing files and getting quick responses via email takes forever
- 👥 **Group Coordination**: Hard to know who's online and available for collaboration
- 💻 **Code Sharing Hassle**: No easy way to share and discuss code with syntax highlighting

### The Solution:
- ✅ **Network Bypass**: Works on any network that allows basic web browsing
- ✅ **Real-time Collaboration**: See who's online and chat instantly during study sessions
- ✅ **Unrestricted File Sharing**: Share projects, documents, and resources without size hassles
- ✅ **Privacy-Conscious**: Your own private space for your group - no public social media noise
- ✅ **Always Accessible**: Works in college computer labs, library systems, and restricted networks

---

## 📦 Project Structure

```
.
├── README.md
├── config
│   ├── package.json
│   └── ...
├── css
│   ├── home.css
│   ├── index.css
│   └── ...
├── docs
│   ├── README.md
│   └── SMTP_SETUP_GUIDE.md
├── games
│   ├── Placement
│   ├── Quiz
│   ├── advice
│   ├── chess
│   ├── dsasolver
│   ├── snake
│   ├── stonepaper
│   ├── ttt
│   ├── typemaster
│   └── white
├── index.html
├── js
│   ├── home.js
│   ├── index.js
│   └── ...
├── node_modules
├── pages
│   ├── Assets
│   ├── home.html
│   └── ...
├── src
│   ├── firebase-config.js
│   └── notification.js
└── workers
    └── firebase-messaging-sw.js
```

---

## ⚡ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/chill-space.git
cd chill-space
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

- Create a new project on [Supabase](https://supabase.com/).
- Go to the **Settings** > **API** section and get your **Project URL** and **anon key**.
- In the root of the project, update the following files with your Supabase credentials:
  - `index.html`
  - `pages/home.html`
  - `pages/register.html`
  - `pages/reset-password.html`
- You will also need to set up the required tables in your Supabase database. You can find the schema in the codebase or ask for the SQL queries.

### 4. Run Locally

```bash
npm run dev
```

This will start a live server, and you can access the application at `http://localhost:8080`.

---

## ✨ Usage
- **Register** a new account or **login** with your credentials
- **Chat** in real time with all online users during study sessions
- **Reset your password** via the reset link if needed
- **Access from anywhere** - works on college computers, personal devices, and restricted networks

---

## 🎯 Perfect For

- **College Students**: Bypass network restrictions and collaborate freely
- **Study Groups**: Share code, files, and communicate when WhatsApp is blocked  
- **Project Teams**: Real-time communication with file sharing capabilities
- **Developer Teams**: Code sharing with syntax highlighting in any network environment

---

## 📝 Customization
- **Roles**: Assign roles (admin, moderator, etc.) in the Supabase `users` table
- **Email Templates**: Customize emails in Supabase Auth settings (see `SMTP_SETUP_GUIDE.md`)
- **Styling**: Tweak CSS in `home.html` for your own look and feel

---

## 🚀 Future Roadmap

*What started as a network restriction workaround is evolving into something bigger...*

- [ ] **Mobile App**: Native mobile experience for when you're off-campus
- [ ] **Offline Mode**: Continue working even with intermittent connections
- [ ] **Voice Messages**: Quick voice notes for complex explanations
- [ ] **Screen Sharing**: Live coding sessions and presentations
- [ ] **Study Rooms**: Separate channels for different subjects
- [ ] **AI Integration**: Smart code suggestions and file organization
- [ ] **Calendar Integration**: Schedule study sessions and deadlines
- [ ] **Network Optimization**: Even better performance on slow college networks

---

## 🙏 Credits & Acknowledgments

- **Creator & Lead Developer**: **TAMIZHARASAN** - 19-year-old Full Stack Developer & AI Student
- **Institution**: Sathyabama Institute of Science and Technology (SIST), Chennai
- **Inspiration**: Network restrictions that blocked our usual communication platforms
- **Special Thanks**: To all the classmates who tested this during college hours when everything else was blocked
- **Powered by**: [Supabase](https://supabase.com/) - For the amazing open-source backend that works anywhere
- **Typography**: [Poppins](https://fonts.google.com/specimen/Poppins)
- **Icons**: [Font Awesome](https://fontawesome.com/)

---

## 📬 Connect & Support

**Get in Touch**
- 📧 Email: jefftamizh01@gmail.com
- 🐙 GitHub: [Tamizh019](https://github.com/Tamizh019)
- 📍 Location: Chennai, Tamil Nadu, India
- 🎓 Currently: CSE-AI Student @ SIST

**Feedback & Feature Requests**
- [Report a bug / Suggest a feature](https://docs.google.com/forms/d/e/1FAIpQLSeZq1r-dkj_B6La2_owrnof10yGgF4AWWfqYHktguRD9Tfe7g/viewform?usp=dialog)

---

## 💭 Developer's Note

*"When college networks block WhatsApp, you don't complain - you build your own solution. Chill Space was born from necessity, shaped by restrictions, and refined by real student needs. Sometimes the best innovations come not from abundance, but from limitations that force you to think differently."*

*"This project taught me that every constraint is an opportunity in disguise. What started as a workaround became a platform that's genuinely better suited for academic collaboration than the tools we were trying to replace."*

**- Tamizharasan, Creator of Chill Space** ☕👨‍💻

---

## 🔧 Technical Notes

**Why It Works Where Others Don't:**
- Uses standard HTTPS connections that pass through most firewalls
- Lightweight architecture doesn't trigger bandwidth restrictions  
- Supabase backend is rarely blocked by institutional filters

---

## ⚠️ License

This project is for educational and personal use. Feel free to fork, modify, and adapt it for your own needs.

---

**Made with ❤️, necessity, and countless late-night coding sessions.**  
*When restrictions inspire innovation* 🚫➡️🚀

**"Sometimes the best solutions come from the biggest obstacles"**
