# Chill Space

**Author: TAMIZHARASAN**  
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

- **Network-Friendly**: Works on restricted college/corporate networks where social media is blocked
- **Real-time Group Chat**: Instantly send and receive messages with all online users
- **User Roles**: Each user has a role (Admin, Moderator, VIP, User) shown beside their name in chat and member lists
- **Online Presence**: See who is online in real time
- **File Sharing**: Upload, download, and share files with the group. Preview selected files before uploading
- **Code Snippets**: Send code with syntax highlighting and language selection - perfect for sharing homework solutions and project code!
- **Emoji Picker**: Express yourself with a built-in emoji picker
- **Responsive UI**: Beautiful, mobile-friendly design with dark mode and glassmorphism effects
- **Authentication**: Secure registration, login, and password reset via Supabase Auth
- **Email Integration**: Customizable email templates for welcome and password reset (see `SMTP_SETUP_GUIDE.md`)
- **Toast Notifications**: Friendly feedback for all actions (success, error, info)
- **Browser-Based**: No app installation required - works directly in web browsers

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Poppins font, custom styles), Vanilla JS
- **Backend/Realtime**: [Supabase](https://supabase.com/) (Auth, Database, Storage, Realtime)
- **Live Development**: [live-server](https://www.netlify.com/)

---

## 💡 Why Chill Space?

**Born from Network Restrictions and Student Needs**

As a 19-year-old developer and AI student from Chennai, I created Chill Space to solve real collaboration challenges faced in restrictive network environments:

### The Problem:
- 🚫 **College Networks Block Everything**: WhatsApp, Telegram, Instagram - all blocked during college hours
- 📧 **Email is Too Slow**: Sharing files and getting quick responses via email takes forever
- 💾 **File Size Limits**: Traditional platforms have strict file size restrictions
- 👥 **Group Coordination**: Hard to know who's online and available for collaboration
- 💻 **Code Sharing Hassle**: No easy way to share and discuss code with syntax highlighting

### The Solution:
- ✅ **Network Bypass**: Works on any network that allows basic web browsing
- ✅ **Real-time Collaboration**: See who's online and chat instantly during study sessions
- ✅ **Unrestricted File Sharing**: Share projects, documents, and resources without size hassles
- ✅ **Code-Friendly**: Built-in syntax highlighting for sharing programming solutions
- ✅ **Student-Focused**: Perfect for study groups, project teams, and academic collaboration
- ✅ **Privacy-Conscious**: Your own private space for your group - no public social media noise
- ✅ **Always Accessible**: Works in college computer labs, library systems, and restricted networks

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

```
git clone <your-repo-url>
cd CHILL_SPACE
```
### 2. Install Dependencies
```
npm install
```
### 3. Configure Supabase
- Update your Supabase URL and Anon Key in `home.html`, `index.html`, `register.html`, and `reset-password.html` if needed.
- Set up your Supabase tables: `users`, `messages`, `files` (see schema in code or ask for SQL).
- (Optional) Configure SMTP for email in Supabase dashboard (see `SMTP_SETUP_GUIDE.md`).

### 4. Run Locally
```
npm run dev
```
- Visit [http://localhost:8080](http://localhost:8080) (or the port shown) in your browser.

---

## ✨ Usage
- **Register** a new account or **login** with your credentials
- **Chat** in real time with all online users during study sessions
- **Share files** by uploading in the sidebar - perfect for sharing project files, documents, and resources
- **Send code** by toggling code mode in the chat input - great for sharing solutions and getting help
- **Pick emojis** to add fun to your messages and keep the mood light during intense study sessions
- **Reset your password** via the reset link if needed
- **Access from anywhere** - works on college computers, personal devices, and restricted networks

---

## 🎯 Perfect For

- **College Students**: Bypass network restrictions and collaborate freely
- **Study Groups**: Share code, files, and communicate when WhatsApp is blocked  
- **Project Teams**: Real-time communication with file sharing capabilities
- **Computer Labs**: Access your group discussions from any college computer
- **Library Sessions**: Continue collaborating even on restricted library networks
- **Developer Teams**: Code sharing with syntax highlighting in any network environment
- **Student Organizations**: Organized communication for clubs and societies without platform dependencies

---

## 🌐 Network Compatibility

**Designed for Restrictive Environments**
- ✅ Works on college ethernet networks
- ✅ Functions in corporate firewalls
- ✅ Accessible from library computers
- ✅ Compatible with public WiFi restrictions
- ✅ No VPN or proxy required
- ✅ Browser-only access (no app installation needed)

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
- **Beta Testers**: My study group who provided feedback from various college computer labs
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
- No external social media domains that trigger automatic blocks
- Optimized for the low-bandwidth conditions common in college networks

---

## ⚠️ License
For educational purposes only.

---

**Made with ❤️ and necessity by TAMIZHARASAN**  
*When restrictions inspire innovation* 🚫➡️🚀

**"Sometimes the best solutions come from the biggest obstacles"**
