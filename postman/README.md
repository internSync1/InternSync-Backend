# Postman Collection for Internship Platform API

This folder contains all the Postman files needed to test the Firebase-authenticated Internship Platform API.

## 📁 Files in this folder:

### 1. **`Internship-Platform-API.postman_collection.json`**
- Complete API collection with all endpoints
- Organized by feature (Authentication, User Profile, Jobs, etc.)
- Firebase Bearer token authentication setup
- Sample request bodies and descriptions

### 2. **`Internship-Platform-Environment.postman_environment.json`**
- Environment variables for easy configuration
- Base URL, Firebase tokens, and dynamic IDs
- Supports multiple environments (dev, staging, prod)

### 3. **`POSTMAN_SETUP.md`**
- Comprehensive setup and usage guide
- Step-by-step testing workflow
- Troubleshooting and best practices

## 🚀 Quick Start:

1. **Import Collection**: Import `Internship-Platform-API.postman_collection.json` into Postman
2. **Import Environment**: Import `Internship-Platform-Environment.postman_environment.json` into Postman
3. **Select Environment**: Choose "Internship Platform Environment" from the dropdown
4. **Get Firebase Token**: Use the HTML test page or Firebase tools to get an ID token
5. **Set Token**: Update the `firebase_id_token` variable in the environment
6. **Start Testing**: Begin with "Sync User with Firebase" endpoint

## 📋 What's Included:

- ✅ **Authentication** - Firebase user sync
- ✅ **User Profile** - Get/Update user profiles
- ✅ **File Management** - Upload/Download/Delete files
- ✅ **Jobs** - Full CRUD operations (Admin)
- ✅ **Applications** - Submit and manage applications
- ✅ **Bookmarks** - Bookmark/unbookmark jobs
- ✅ **Interests** - Manage interests (Admin)
- ✅ **Questions** - Manage questions (Admin)

## 🔧 Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API base URL | `http://localhost:5000` |
| `firebase_id_token` | Firebase auth token | (from Firebase) |
| `job_id` | Job ID for testing | (auto-set) |
| `application_id` | Application ID | (auto-set) |
| `filename` | File name for operations | (auto-set) |

## 📖 Detailed Guide:

See `POSTMAN_SETUP.md` for comprehensive instructions, troubleshooting, and best practices.

## 🔄 Updates:

This collection is designed to work with the Firebase-authenticated Internship Platform API. If the API changes, update the collection accordingly.

---

**Note**: Keep your Firebase service account keys secure and never commit them to version control. 