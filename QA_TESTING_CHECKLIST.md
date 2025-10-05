# Purge Beta Testing Checklist

## 🎯 Pre-Launch Testing Requirements

Before executing the marketing plan, **ALL** items must be tested and verified working.

---

## 1. Authentication & Onboarding

### Auth0 Login Flow (Web App)
- [ ] **First Visit**: Clicking "Sign In / Sign Up" redirects to Auth0 hosted login
- [ ] **Sign Up**: Creating new account with email/password works
- [ ] **Sign Up**: Email verification email is sent (check spam folder)
- [ ] **Sign Up**: After email verification, can log in successfully
- [ ] **Login**: Existing users can log in with correct credentials
- [ ] **Login Error**: Wrong password shows appropriate error message
- [ ] **Login Error**: Non-existent email shows appropriate error message
- [ ] **Redirect**: After login, user is redirected back to app
- [ ] **Session Persistence**: Refreshing page keeps user logged in
- [ ] **Logout**: Logout button works and clears session
- [ ] **Social Login**: Google login works (if enabled in Auth0)
- [ ] **Social Login**: GitHub login works (if enabled in Auth0)
- [ ] **Password Reset**: "Forgot Password?" flow works

### Desktop App Authentication
- [ ] **First Launch**: Desktop app shows Auth0 login screen
- [ ] **OAuth Flow**: Desktop OAuth redirect works correctly
- [ ] **Session Storage**: Desktop app remembers login after restart
- [ ] **Offline Mode**: Desktop app works offline after initial login

### Auth Screen UI
- [ ] **Logo**: Purge logo displays correctly (no broken image)
- [ ] **Background**: Background image displays correctly (no broken image)
- [ ] **Gradient**: Background gradient renders smoothly
- [ ] **Button Hover**: Sign In button hover effect works
- [ ] **Responsive**: Auth screen looks good on different screen sizes
- [ ] **Loading State**: Loading spinner shows during Auth0 redirect

---

## 2. Dashboard Tab

### Main Dashboard View
- [ ] **Navigation**: Dashboard tab is selected by default on login
- [ ] **Protection Status Widget**: Shows "Protected" with green checkmark
- [ ] **Protection Status**: Real-time protection status updates correctly
- [ ] **Quick Scan Button**: "Run Quick Scan" button is visible and clickable
- [ ] **Recent Activity**: Shows "No threats detected" on fresh install
- [ ] **Risk Meter**: Displays current risk level (should be "Low" on clean system)
- [ ] **Threat Count**: Shows correct number of threats blocked (0 on fresh install)

### Protection Status Widget
- [ ] **Status Icon**: Green shield icon displays when protected
- [ ] **Status Text**: Shows "System Protected" or similar
- [ ] **Real-time Updates**: Status changes if protection is disabled
- [ ] **Click Action**: Clicking widget navigates to Advanced tab (if applicable)

### Quick Actions
- [ ] **Scan Now**: Button triggers quick scan
- [ ] **View Activity**: Button navigates to Activity tab
- [ ] **Settings**: Button navigates to Settings tab

### System Stats
- [ ] **Uptime**: Shows correct uptime since last boot
- [ ] **Files Scanned**: Shows total files scanned count
- [ ] **Last Scan**: Shows timestamp of last scan
- [ ] **Version Number**: Displays correct app version (0.7.0)

---

## 3. Scan Tab

### Scan Controls
- [ ] **Quick Scan Button**: Starts quick scan (scans critical areas)
- [ ] **Full Scan Button**: Starts full system scan
- [ ] **Custom Scan Button**: Opens file/folder picker
- [ ] **Stop Button**: Appears during scan and stops scan when clicked
- [ ] **Pause Button**: Pauses scan (if implemented)

### Scan Progress
- [ ] **Progress Bar**: Shows 0-100% progress during scan
- [ ] **Percentage Text**: Updates in real-time (e.g., "45%")
- [ ] **Current File**: Shows currently scanning file path
- [ ] **Files Scanned Count**: Increments during scan
- [ ] **Speed Indicator**: Shows files/sec scan speed
- [ ] **Time Remaining**: Estimates time left (optional)

### Scan Results
- [ ] **Threats Found**: Lists all detected threats
- [ ] **Threat Details**: Each threat shows name, path, risk score
- [ ] **Risk Score Badge**: Color-coded (red >70%, yellow 40-70%, green <40%)
- [ ] **Action Buttons**: "Quarantine", "Delete", "Ignore" buttons work
- [ ] **Clean Result**: Shows "No threats detected" with green checkmark
- [ ] **Scan History**: Previous scans are logged

### Custom Scan
- [ ] **Folder Selection**: Can select custom folder to scan
- [ ] **File Selection**: Can select specific files to scan
- [ ] **Exclusions**: Can exclude certain paths (if implemented)

---

## 4. Crypto Protection Tab

### Clipboard Protection
- [ ] **Toggle Switch**: Enable/disable clipboard monitoring
- [ ] **Status Indicator**: Shows "Active" when enabled, "Disabled" when off
- [ ] **Real-time Monitoring**: Detects when crypto address is copied
- [ ] **Risk Analysis**: Shows 0-100% risk score for clipboard content
- [ ] **Auto-block**: Prevents paste when risk >70% (configurable threshold)
- [ ] **Manual Override**: User can choose to paste anyway (with warning)
- [ ] **Notification**: Alert appears when threat is blocked

### Clipboard Testing (Manual Test Cases)
**Test 1: Legitimate Address**
- [ ] Copy Bitcoin address from trusted source (e.g., Coinbase)
- [ ] Paste should work normally (low risk score <30%)

**Test 2: Quick Paste (Simulated Malware)**
- [ ] Copy random Bitcoin address
- [ ] Immediately paste (<500ms)
- [ ] Should flag as high risk (timing pattern suspicious)

**Test 3: Similar Address Swap**
- [ ] Copy: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`
- [ ] Swap to: `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb` (last char different)
- [ ] Should detect similarity and flag as medium risk

**Test 4: Known Scam Address**
- [ ] Copy known scam address (from database)
- [ ] Should auto-block with 100% risk score

### Phishing Detection
- [ ] **URL Input Field**: Can paste or type URL to check
- [ ] **Check Button**: Analyzes URL when clicked
- [ ] **Risk Score**: Shows 0-100% risk for URL
- [ ] **Detection Methods**: Lists which methods flagged the URL
- [ ] **Safe URL**: Shows green "Safe" badge for legitimate sites (e.g., coinbase.com)

### Phishing Testing (Manual Test Cases)
**Test 1: Legitimate Site**
- [ ] Input: `https://coinbase.com`
- [ ] Should show low risk (<20%), green badge

**Test 2: Homograph Attack**
- [ ] Input: `https://ϲoinbase.com` (Cyrillic 'c')
- [ ] Should detect homograph, flag as high risk

**Test 3: Punycode Attack**
- [ ] Input: `https://xn--cinbase-5wa.com` (punycode for ćoinbase)
- [ ] Should detect punycode, flag as high risk

**Test 4: Suspicious TLD**
- [ ] Input: `https://coinbase.tk` (.tk domain)
- [ ] Should flag suspicious TLD, medium risk

**Test 5: IP Address**
- [ ] Input: `http://192.168.1.1/login`
- [ ] Should detect IP address usage, flag as suspicious

**Test 6: Excessive Subdomains**
- [ ] Input: `https://login.secure.verify.coinbase.phishing.com`
- [ ] Should detect excessive subdomains, medium risk

**Test 7: URL Shortener**
- [ ] Input: `https://bit.ly/3abc123`
- [ ] Should detect URL shortener, flag for caution

### Wallet Protection
- [ ] **Wallet File Monitoring**: Toggle to enable/disable
- [ ] **Add Wallet Path**: Can select wallet.dat or similar files
- [ ] **File Hash Verification**: Shows SHA-256 hash of wallet file
- [ ] **Unauthorized Access Alert**: Detects when wallet file is accessed
- [ ] **Modification Alert**: Detects when wallet file is modified
- [ ] **Remove Wallet**: Can remove wallet from monitoring list

### Protection Settings
- [ ] **Risk Threshold Slider**: Adjustable 0-100% (default 70%)
- [ ] **Auto-block Toggle**: Enable/disable automatic blocking
- [ ] **Notification Settings**: Choose notification type (popup, sound, both)
- [ ] **Whitelist**: Can add trusted addresses to whitelist

---

## 5. Activity Tab

### Activity Log
- [ ] **Real-time Updates**: New threats appear immediately
- [ ] **Timestamp**: Each entry shows date/time
- [ ] **Threat Type**: Shows category (clipboard, phishing, file scan, etc.)
- [ ] **Risk Score**: Color-coded badge (red/yellow/green)
- [ ] **Description**: Brief description of threat
- [ ] **Action Taken**: Shows what action was taken (blocked, quarantined, deleted)
- [ ] **Details Button**: Expands to show full threat details

### Activity Filtering
- [ ] **Filter by Type**: Can filter by threat type
- [ ] **Filter by Date**: Can filter by date range
- [ ] **Filter by Risk**: Can filter by risk level (high/medium/low)
- [ ] **Search**: Can search activity by keyword
- [ ] **Clear Filters**: Reset button clears all filters

### Activity Export
- [ ] **Export CSV**: Can export activity log as CSV
- [ ] **Export JSON**: Can export activity log as JSON
- [ ] **Date Range**: Can select date range for export

### Activity Details
- [ ] **Threat Name**: Full name of threat
- [ ] **File Path**: Full file path (if applicable)
- [ ] **Detection Method**: Which method detected it (ML, pattern, heuristic)
- [ ] **Risk Breakdown**: Detailed risk score breakdown
- [ ] **Hash**: File hash (SHA-256) if applicable
- [ ] **Restore Button**: Can restore false positives

---

## 6. Advanced Tab

### Real-time Protection
- [ ] **Master Toggle**: Enable/disable all real-time protection
- [ ] **File System Protection**: Toggle for file monitoring
- [ ] **Clipboard Protection**: Toggle for clipboard monitoring
- [ ] **Web Protection**: Toggle for URL scanning
- [ ] **Email Protection**: Toggle for email scanning (if implemented)
- [ ] **Status Indicators**: Each toggle shows active/inactive state

### Scheduled Scans
- [ ] **Enable Scheduling**: Toggle to enable scheduled scans
- [ ] **Frequency Dropdown**: Daily, Weekly, Monthly options
- [ ] **Time Picker**: Select time of day for scan
- [ ] **Scan Type**: Choose Quick or Full scan
- [ ] **Next Scan Time**: Shows when next scan will run
- [ ] **Run Now Button**: Manually trigger scheduled scan

### Quarantine
- [ ] **Quarantined Items List**: Shows all quarantined files
- [ ] **Item Details**: Click to see file details
- [ ] **Restore Button**: Can restore files from quarantine
- [ ] **Delete Permanently**: Can permanently delete quarantined files
- [ ] **Restore All**: Bulk restore option
- [ ] **Delete All**: Bulk delete option
- [ ] **Empty State**: Shows "No quarantined items" when empty

### Exclusions
- [ ] **Add Exclusion Button**: Opens file/folder picker
- [ ] **Exclusion List**: Shows all excluded paths
- [ ] **Remove Exclusion**: Can remove items from exclusion list
- [ ] **Path Type**: Shows whether file or folder
- [ ] **Wildcard Support**: Can use wildcards (*.tmp, etc.)

### Update Settings
- [ ] **Auto-update Toggle**: Enable/disable automatic updates
- [ ] **Check for Updates**: Manual update check button
- [ ] **Current Version**: Shows installed version
- [ ] **Latest Version**: Shows available version (if newer exists)
- [ ] **Update Now Button**: Triggers update download/install
- [ ] **Update History**: Shows previous updates

---

## 7. Analytics Tab (Beta)

### Overview Stats
- [ ] **Total Users**: Shows user count (0 on local install)
- [ ] **Active Users**: Shows active user count
- [ ] **Threats Blocked**: Shows total threats blocked
- [ ] **Average Risk Score**: Shows average risk across all threats

### Charts/Graphs (if implemented)
- [ ] **Threat Timeline**: Line graph of threats over time
- [ ] **Threat Types**: Pie chart of threat categories
- [ ] **Risk Distribution**: Bar chart of risk levels
- [ ] **Detection Methods**: Breakdown of detection methods

### Top Threats
- [ ] **Top 10 List**: Shows most common threats
- [ ] **Threat Count**: Shows how many times each appeared
- [ ] **Trend Indicator**: Shows if increasing/decreasing

### Performance Metrics
- [ ] **Average Scan Time**: Shows avg time per scan
- [ ] **CPU Usage**: Shows average CPU usage
- [ ] **Memory Usage**: Shows average RAM usage
- [ ] **Efficiency Score**: Overall performance rating

### Empty State
- [ ] **No Data Message**: Shows "No analytics data available" on fresh install
- [ ] **Helpful Text**: Explains that data will populate after usage
- [ ] **Local Only Note**: Clarifies analytics are local, not shared

---

## 8. Settings Tab

### General Settings
- [ ] **Language Dropdown**: Select language (English default)
- [ ] **Theme Dropdown**: Brand, Dark, Light themes
- [ ] **Theme Preview**: Theme changes apply immediately
- [ ] **Startup Toggle**: Launch on system startup
- [ ] **Minimize to Tray**: Minimize to system tray option
- [ ] **Notifications Toggle**: Enable/disable notifications

### Privacy Settings
- [ ] **Telemetry Toggle**: Enable/disable anonymous usage stats
- [ ] **Error Reporting**: Enable/disable crash reports
- [ ] **Data Collection Notice**: Clear explanation of what's collected
- [ ] **Privacy Policy Link**: Opens privacy policy

### Advanced Settings
- [ ] **Debug Mode Toggle**: Enable debug logging
- [ ] **Log File Location**: Shows path to log files
- [ ] **Open Log Folder**: Button to open log directory
- [ ] **Clear Logs**: Button to delete old logs
- [ ] **Reset Settings**: Button to reset all settings to defaults
- [ ] **Confirmation Dialog**: Warns before resetting

### Beta Settings (Beta Tab)
- [ ] **Beta Features Toggle**: Enable experimental features
- [ ] **Feature Flags**: List of beta features with toggles
- [ ] **Feedback Widget Toggle**: Show/hide feedback widget
- [ ] **Analytics Opt-in**: Opt-in to beta analytics

### Account Settings
- [ ] **Email Display**: Shows logged-in user email
- [ ] **Logout Button**: Logs out and returns to auth screen
- [ ] **Delete Account**: Option to delete account (with confirmation)

---

## 9. AI Tab (if implemented)

### AI Assistant
- [ ] **Chat Interface**: Can type messages
- [ ] **Send Button**: Sends message to AI
- [ ] **AI Responses**: Receives relevant security advice
- [ ] **Response Time**: Responses appear within 5 seconds
- [ ] **Context Awareness**: AI knows about recent threats
- [ ] **Clear Chat**: Button to clear conversation

### AI Features
- [ ] **Threat Explanation**: AI can explain threats in detail
- [ ] **Recommendations**: AI suggests security improvements
- [ ] **Q&A**: AI answers security questions
- [ ] **Learning Mode**: AI adapts to user behavior

---

## 10. Beta Feedback Widget

### Widget Visibility
- [ ] **Widget Button**: Feedback button visible in corner (default: bottom-right)
- [ ] **Widget Position**: Can be moved/dragged (if implemented)
- [ ] **Minimize/Expand**: Can collapse and expand widget

### Feedback Form
- [ ] **Feedback Type Dropdown**: Bug, Feature Request, General
- [ ] **Email Field**: Optional email input
- [ ] **Message Textarea**: Can type feedback (min 10 chars)
- [ ] **Screenshot Toggle**: Option to include screenshot
- [ ] **Submit Button**: Submits feedback via Netlify Forms
- [ ] **Success Message**: Shows "Thank you" after submission
- [ ] **Form Reset**: Form clears after successful submission
- [ ] **Validation**: Prevents empty submissions

### Netlify Forms Integration
- [ ] **Form Submission**: Check Netlify dashboard for submissions
- [ ] **Spam Protection**: Honeypot field prevents spam bots
- [ ] **Email Notifications**: (Optional) Configure in Netlify

---

## 11. Windows Desktop App

### Installation
- [ ] **Installer Download**: Purge Setup 0.7.0.exe downloads correctly
- [ ] **Installer Runs**: Double-click launches installer
- [ ] **Install Path**: Can choose custom install location
- [ ] **Start Menu Shortcut**: Creates shortcut in Start Menu
- [ ] **Desktop Shortcut**: Creates desktop shortcut (optional)
- [ ] **File Associations**: Associates with relevant file types (if applicable)
- [ ] **Admin Privileges**: Requests admin if needed for system protection

### First Launch
- [ ] **Auto-start**: Prompts to enable startup on boot
- [ ] **Welcome Screen**: Shows onboarding/welcome message
- [ ] **Tutorial**: Optional tutorial or tour (if implemented)
- [ ] **System Tray Icon**: App icon appears in system tray

### Window Management
- [ ] **Window Size**: Default size is appropriate (not too small/large)
- [ ] **Resize**: Window can be resized
- [ ] **Minimize**: Minimize button works
- [ ] **Maximize**: Maximize button works
- [ ] **Close**: Close button minimizes to tray (or configurable)
- [ ] **Tray Menu**: Right-click tray icon shows menu
- [ ] **Restore from Tray**: Double-click tray icon restores window

### System Integration
- [ ] **Clipboard Access**: Can monitor clipboard
- [ ] **File System Access**: Can scan files
- [ ] **Registry Access**: Can check startup entries (Windows)
- [ ] **Network Access**: Can check URLs (if needed)
- [ ] **Notifications**: Windows notifications work

### Performance
- [ ] **Startup Time**: App launches within 5 seconds
- [ ] **CPU Usage**: Idle CPU usage <5%
- [ ] **Memory Usage**: Idle RAM usage <200MB
- [ ] **Disk Usage**: Installation size <500MB
- [ ] **Battery Impact**: Low battery drain on laptops

### Uninstallation
- [ ] **Uninstaller**: Can uninstall from Control Panel
- [ ] **Clean Removal**: Removes all files (except user data)
- [ ] **Settings Removal**: Option to remove settings during uninstall
- [ ] **Registry Cleanup**: Removes registry entries

---

## 12. Web App (https://purge.dussey.dev)

### Deployment & Hosting
- [ ] **URL Loads**: https://purge.dussey.dev loads without errors
- [ ] **HTTPS**: Site uses HTTPS (green padlock in browser)
- [ ] **SSL Certificate**: Valid SSL certificate
- [ ] **Page Load Time**: Loads within 3 seconds
- [ ] **Lighthouse Score**: >90 performance score

### Browser Compatibility
- [ ] **Chrome**: Works in latest Chrome
- [ ] **Firefox**: Works in latest Firefox
- [ ] **Safari**: Works in latest Safari
- [ ] **Edge**: Works in latest Edge
- [ ] **Mobile Chrome**: Works on Android Chrome
- [ ] **Mobile Safari**: Works on iOS Safari

### Responsive Design
- [ ] **Desktop (1920x1080)**: Layout looks good on large screens
- [ ] **Laptop (1366x768)**: Layout adapts to laptop screens
- [ ] **Tablet (768x1024)**: Layout adapts to tablet screens
- [ ] **Mobile (375x667)**: Layout adapts to mobile screens
- [ ] **Mobile (320x568)**: Layout works on small phones

### PWA Features (if implemented)
- [ ] **Install Prompt**: Can install as PWA
- [ ] **Offline Mode**: Basic functionality works offline
- [ ] **Service Worker**: Service worker registers correctly
- [ ] **App Icon**: Custom app icon shows on home screen

### Auth0 Integration
- [ ] **Login Redirect**: Auth0 redirect works on web
- [ ] **Callback Handling**: Auth0 callback URL works
- [ ] **Token Storage**: Auth tokens stored securely
- [ ] **Session Management**: Session persists across page reloads
- [ ] **Logout**: Logout clears session completely

### Features on Web
- [ ] **Dashboard**: Dashboard loads and displays correctly
- [ ] **Phishing Checker**: Can check URLs on web version
- [ ] **Settings**: Can modify settings on web
- [ ] **Analytics**: Analytics dashboard works
- [ ] **Feedback Widget**: Feedback submission works
- [ ] **Note**: Clipboard/file scanning disabled on web (browser limitation)

---

## 13. Cross-Platform Testing

### Windows Versions
- [ ] **Windows 11**: App works on Windows 11
- [ ] **Windows 10**: App works on Windows 10
- [ ] **Windows 8.1**: App works on Windows 8.1 (if supported)

### macOS (Future)
- [ ] **macOS Monterey**: App works on Monterey (when Mac support added)
- [ ] **macOS Big Sur**: App works on Big Sur

### Linux (Future)
- [ ] **Ubuntu 22.04**: App works on Ubuntu
- [ ] **Fedora**: App works on Fedora
- [ ] **Debian**: App works on Debian

---

## 14. Security Testing

### Authentication Security
- [ ] **HTTPS Only**: All auth requests use HTTPS
- [ ] **Token Expiry**: Auth tokens expire correctly
- [ ] **XSS Protection**: No XSS vulnerabilities in forms
- [ ] **CSRF Protection**: CSRF tokens used where needed
- [ ] **SQL Injection**: No SQL injection vectors (if using DB)

### Data Protection
- [ ] **Local Storage**: Sensitive data encrypted in local storage
- [ ] **No Plaintext Passwords**: Passwords never stored in plaintext
- [ ] **Secure Transmission**: Data transmitted over HTTPS only
- [ ] **API Keys**: API keys not exposed in frontend code

### Permissions
- [ ] **Least Privilege**: App requests minimum necessary permissions
- [ ] **Permission Prompts**: User prompted before sensitive operations
- [ ] **Clipboard Access**: Clipboard access is opt-in

---

## 15. Error Handling

### Network Errors
- [ ] **Offline Mode**: Graceful degradation when offline
- [ ] **API Timeout**: Shows error if API times out
- [ ] **Failed Request**: Shows retry option on failed requests

### Form Validation
- [ ] **Empty Fields**: Prevents submission with empty required fields
- [ ] **Invalid Email**: Validates email format
- [ ] **Field Limits**: Enforces min/max length limits
- [ ] **Error Messages**: Shows helpful error messages

### Edge Cases
- [ ] **No Threats Found**: Handles empty scan results gracefully
- [ ] **Large Files**: Handles scanning very large files
- [ ] **Special Characters**: Handles file paths with special characters
- [ ] **Long Paths**: Handles Windows long path names (>260 chars)
- [ ] **Corrupted Files**: Handles corrupted files without crashing

### Error Recovery
- [ ] **Crash Recovery**: App recovers from crashes gracefully
- [ ] **Auto-save**: Settings auto-save (don't lose progress)
- [ ] **Error Logs**: Errors logged for debugging

---

## 16. Accessibility

### Keyboard Navigation
- [ ] **Tab Navigation**: Can navigate with Tab key
- [ ] **Enter/Space**: Buttons activate with Enter/Space
- [ ] **Escape**: Escape closes modals
- [ ] **Arrow Keys**: Can navigate lists with arrow keys

### Screen Reader Support
- [ ] **Alt Text**: Images have alt text
- [ ] **ARIA Labels**: Interactive elements have ARIA labels
- [ ] **Focus Indicators**: Focused elements have visible outline
- [ ] **Semantic HTML**: Uses proper HTML5 semantic tags

### Visual Accessibility
- [ ] **Contrast Ratio**: Text has 4.5:1 contrast ratio (WCAG AA)
- [ ] **Font Size**: Minimum 16px font size
- [ ] **Color Blindness**: UI works with color blindness
- [ ] **Dark Mode**: Dark theme is WCAG compliant

---

## 17. Performance Benchmarks

### Scan Performance
- [ ] **Quick Scan**: <2 minutes for typical system
- [ ] **Full Scan**: <30 minutes for typical system
- [ ] **CPU Impact**: <30% CPU during scan
- [ ] **Memory Impact**: <500MB RAM during scan

### Real-time Protection
- [ ] **Clipboard Latency**: <100ms detection time
- [ ] **File Access Latency**: <50ms overhead per file access
- [ ] **URL Check Latency**: <500ms for URL analysis

### UI Performance
- [ ] **Page Load**: Each tab loads within 1 second
- [ ] **Smooth Scrolling**: 60fps scrolling in activity log
- [ ] **Animations**: Smooth transitions (no jank)

---

## 18. Auto-Update System

### Update Detection
- [ ] **Check for Updates**: Manually check for updates
- [ ] **Auto-check**: Automatically checks on startup (if enabled)
- [ ] **Update Notification**: Notifies when update available
- [ ] **Release Notes**: Shows release notes for new version

### Update Installation
- [ ] **Download**: Downloads update in background
- [ ] **Progress Bar**: Shows download progress
- [ ] **Install**: Installs update on next restart
- [ ] **Rollback**: Can rollback to previous version if update fails

---

## 19. Telemetry & Analytics (Optional)

### Opt-in Telemetry
- [ ] **Opt-in Required**: Telemetry off by default
- [ ] **Clear Disclosure**: User knows what data is collected
- [ ] **Anonymous**: No PII collected
- [ ] **Toggle**: Can disable telemetry anytime

### Collected Data (if opted in)
- [ ] **Usage Stats**: App opens, feature usage
- [ ] **Performance**: Scan times, CPU/RAM usage
- [ ] **Errors**: Crash reports, error logs
- [ ] **Threats**: Threat counts (no file paths)

---

## 20. Edge Case Testing

### Unusual Scenarios
- [ ] **Fresh Install**: Works on clean system with no files
- [ ] **Heavy Load**: Works with 1000+ files in activity log
- [ ] **Long Runtime**: Stable after running for 24+ hours
- [ ] **Sleep/Wake**: Works after system sleep/wake cycle
- [ ] **User Switch**: Works after switching Windows users
- [ ] **Multiple Instances**: Handles running multiple app instances
- [ ] **Slow System**: Works on low-end hardware (2GB RAM, old CPU)

### Data Limits
- [ ] **Large Scans**: Can scan 100,000+ files
- [ ] **Long Paths**: Handles paths >260 characters
- [ ] **Unicode**: Handles Unicode characters in file names
- [ ] **Special Characters**: Handles spaces, &, %, etc. in paths

---

## 21. Legal & Compliance

### Privacy Compliance
- [ ] **Privacy Policy**: Privacy policy accessible
- [ ] **Terms of Service**: ToS accessible
- [ ] **GDPR**: Compliant with GDPR (if applicable)
- [ ] **Data Deletion**: User can request data deletion

### Licensing
- [ ] **Open Source License**: LICENSE file in repo
- [ ] **Third-party Licenses**: Credits for dependencies
- [ ] **Export Compliance**: No export restrictions

---

## 22. Pre-Launch Checklist

### Code Quality
- [ ] **No Console Errors**: No errors in browser/desktop console
- [ ] **No Console Warnings**: Minimal warnings in console
- [ ] **TypeScript**: No TypeScript errors (`npm run build` succeeds)
- [ ] **Linting**: Code passes linter (`npm run lint`)
- [ ] **Tests**: All tests pass (if tests exist)

### Assets & Content
- [ ] **Logo**: Logo displays correctly everywhere
- [ ] **Icons**: All icons display correctly
- [ ] **Images**: All images load (no broken images)
- [ ] **Text**: No typos in user-facing text
- [ ] **Grammar**: All text is grammatically correct

### Documentation
- [ ] **README**: README is up-to-date
- [ ] **Installation Guide**: Installation instructions are clear
- [ ] **User Guide**: Basic usage documented
- [ ] **FAQ**: Common questions answered
- [ ] **Changelog**: CHANGELOG.md updated for v0.7.0

### Deployment
- [ ] **Production Build**: `npm run build` succeeds with no errors
- [ ] **Build Size**: Build size <10MB (warning threshold)
- [ ] **Environment Variables**: All env vars set correctly in Netlify
- [ ] **Domain**: Custom domain configured (purge.dussey.dev)
- [ ] **HTTPS**: HTTPS working on production
- [ ] **GitHub Release**: v0.7.0-beta release created
- [ ] **Download Link**: Windows installer download works

---

## ✅ Final Pre-Launch Sign-off

Before posting to Reddit and executing marketing plan:

- [ ] **All Critical Items Tested**: All items with 🔴 priority completed
- [ ] **No Blocking Bugs**: No bugs that prevent core functionality
- [ ] **Performance Acceptable**: App is fast and responsive
- [ ] **Auth Works**: Can sign up, log in, log out without issues
- [ ] **Core Features Work**: Clipboard protection, phishing detection work
- [ ] **Desktop App Works**: Windows installer and desktop app work
- [ ] **Web App Works**: Web app at purge.dussey.dev works
- [ ] **Feedback System Works**: Can submit feedback via widget
- [ ] **Ready for Users**: Confident app is ready for beta testers

---

## 📊 Testing Metrics

### Success Criteria
- **Critical Bugs**: 0 blocking bugs
- **High Priority Bugs**: <5 high priority bugs
- **Performance**: All benchmarks met
- **Compatibility**: Works on Windows 10/11, Chrome/Firefox/Edge
- **User Experience**: No confusing UI elements

### Known Issues (Document Here)
1. [List any known non-blocking issues]
2. [Example: "Activity log performance slows with >10,000 entries"]
3. [Example: "Web app clipboard protection requires browser extension (future)"]

---

## 🎯 Priority Levels

For efficient testing, focus on these priorities:

**🔴 P0 - Critical (MUST work before launch):**
- Authentication (login/logout)
- Core protection (clipboard, phishing detection)
- Windows installer
- Web app deployment
- Feedback submission

**🟡 P1 - High (Should work, but can fix post-launch):**
- All tabs functional
- Settings persistence
- Activity logging
- Theme switching

**🟢 P2 - Medium (Nice to have):**
- Analytics dashboard
- Export features
- Advanced settings
- Scheduled scans

**⚪ P3 - Low (Future improvements):**
- AI assistant
- PWA features
- Performance optimizations

---

**Ready to begin testing? Start with P0 items, then work through P1-P3.**

Once all P0 and P1 items are ✅, you're ready to launch! 🚀
