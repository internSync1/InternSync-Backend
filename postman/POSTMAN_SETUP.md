# Postman Setup Guide for Internship Platform API

## 🚀 Quick Start

1. **Import Collection**: Import `Internship-Platform-API.postman_collection.json`
2. **Import Environment**: Import `Internship-Platform-Environment.postman_environment.json`
3. **Select Environment**: Choose "Internship-Platform-Environment" from the dropdown
4. **Get Firebase Token**: Use the `index.html` file to get a fresh Firebase ID token
5. **Set Token**: Update the `firebase_id_token` variable in the environment
6. **Start Testing**: Begin with the "User Sync" endpoint

## 📋 Prerequisites

- **Postman Desktop App** (recommended) or Postman Web
- **Firebase Project** with Authentication enabled
- **Railway Deployment**: https://internsync-production.up.railway.app

## 🔧 Setup Instructions

### Step 1: Import Files

1. **Open Postman**
2. **Import Collection**:
   - Click "Import" button
   - Select `Internship-Platform-API.postman_collection.json`
   - Click "Import"

3. **Import Environment**:
   - Click "Import" button again
   - Select `Internship-Platform-Environment.postman_environment.json`
   - Click "Import"

### Step 2: Configure Environment

1. **Select Environment**:
   - Click the environment dropdown (top-right)
   - Select "Internship-Platform-Environment"

2. **Verify Base URL**:
   - Open the environment (gear icon)
   - Confirm `base_url` is set to: `https://internsync-production.up.railway.app`

### Step 3: Get Firebase Token

1. **Open `index.html`** in your browser
2. **Register/Login** with Firebase Auth
3. **Get Token**:
   - Open browser console (F12)
   - Run: `firebase.auth().currentUser.getIdToken(true)`
   - Copy the returned token

### Step 4: Set Token in Postman

1. **Open Environment Variables**:
   - Click the gear icon (top-right)
   - Select "Internship-Platform-Environment"

2. **Update Token**:
   - Find `firebase_id_token`
   - Paste your token in the "Current Value" column
   - Click "Save"

## 🧪 Testing Workflow

### 1. Authentication Test
```
POST {{base_url}}/v1/user/sync
Authorization: Bearer {{firebase_id_token}}
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "firebaseUid": "user_uid",
    "email": "user@example.com",
    "firstName": "User",
    "profilePicture": "",
    "isActive": true
  }
}
```

### 2. User Profile Test
```
GET {{base_url}}/v1/user/profile
Authorization: Bearer {{firebase_id_token}}
```

### 3. Update Profile Test
```
PUT {{base_url}}/v1/user/profile
Authorization: Bearer {{firebase_id_token}}
Content-Type: application/json

{
  "firstName": "Updated Name",
  "lastName": "Updated Last",
  "phone": "+1234567890"
}
```

## 📁 Collection Structure

### 🔐 Authentication
- **User Sync**: Create/update user in MongoDB from Firebase

### 👤 User Management
- **Get Profile**: Retrieve user profile
- **Update Profile**: Update user information

### 💼 Jobs
- **Get All Jobs**: List all available jobs
- **Get Job by ID**: Get specific job details
- **Create Job**: Create new job posting
- **Update Job**: Modify existing job
- **Delete Job**: Remove job posting

### 📝 Applications
- **Get All Applications**: List user's applications
- **Get Application by ID**: Get specific application
- **Create Application**: Apply for a job
- **Update Application**: Modify application
- **Delete Application**: Withdraw application

### 🔖 Bookmarks
- **Get All Bookmarks**: List user's bookmarks
- **Create Bookmark**: Save job to bookmarks
- **Delete Bookmark**: Remove bookmark

### 🏷️ Interests
- **Get All Interests**: List user's interests
- **Create Interest**: Add new interest
- **Update Interest**: Modify interest
- **Delete Interest**: Remove interest

### ❓ Questions
- **Get All Questions**: List all questions
- **Get Question by ID**: Get specific question
- **Create Question**: Add new question
- **Update Question**: Modify question
- **Delete Question**: Remove question

### 📁 Files
- **Upload File**: Upload file to server
- **Get File**: Download file by filename

## 🔄 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API base URL | `https://internsync-production.up.railway.app` |
| `firebase_id_token` | Firebase ID token | `eyJhbGciOiJSUzI1NiIs...` |
| `job_id` | Job ID for testing | `507f1f77bcf86cd799439011` |
| `application_id` | Application ID for testing | `507f1f77bcf86cd799439012` |
| `interest_id` | Interest ID for testing | `507f1f77bcf86cd799439013` |
| `question_id` | Question ID for testing | `507f1f77bcf86cd799439014` |
| `filename` | Filename for file operations | `resume.pdf` |
| `user_id` | User ID for testing | `507f1f77bcf86cd799439015` |

## 🚨 Troubleshooting

### Common Issues

#### 1. "No token provided" (401)
**Solution**: 
- Ensure environment is selected
- Check `firebase_id_token` has a value
- Get fresh token from `index.html`

#### 2. "Invalid or expired token" (401)
**Solution**:
- Token has expired (Firebase tokens expire after 1 hour)
- Get fresh token: `firebase.auth().currentUser.getIdToken(true)`
- Update environment variable

#### 3. "404 Not Found"
**Solution**:
- Check `base_url` is correct
- Verify endpoint path is correct
- Ensure server is running on Railway

#### 4. CORS Errors
**Solution**:
- This is a frontend issue, not Postman
- Backend should handle CORS properly

### Token Refresh

**Automatic Refresh** (in `index.html`):
```javascript
// Token refreshes every 50 minutes automatically
setInterval(() => {
  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.getIdToken(true);
  }
}, 50 * 60 * 1000);
```

**Manual Refresh**:
```javascript
// In browser console
firebase.auth().currentUser.getIdToken(true)
  .then(token => console.log(token));
```

## 📊 Testing Best Practices

### 1. **Start with Authentication**
- Always test `/v1/user/sync` first
- Ensure token is valid

### 2. **Use Environment Variables**
- Don't hardcode IDs in requests
- Use `{{variable_name}}` syntax

### 3. **Test Error Cases**
- Invalid tokens
- Missing required fields
- Invalid IDs

### 4. **Check Response Headers**
- Verify `Content-Type: application/json`
- Check status codes

### 5. **Save Important IDs**
- After creating resources, save IDs to environment
- Use for subsequent tests

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Postman Documentation**: https://learning.postman.com
- **API Documentation**: https://internsync-production.up.railway.app/api-docs

## 📞 Support

If you encounter issues:

1. **Check Console Logs**: Look for error messages
2. **Verify Environment**: Ensure correct environment is selected
3. **Test Token**: Use `index.html` to verify token works
4. **Check Railway**: Ensure deployment is running

---

**Happy Testing! 🎉** 