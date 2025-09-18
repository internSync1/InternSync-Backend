const swaggerDocument: any = {
  "openapi": "3.0.0",
  "info": {
    "title": "Internship Platform API",
    "version": "1.0.0",
    "description": "API documentation for the Internship platform backend."
  },
  "servers": [
    {
      "url": "https://internsync-production.up.railway.app",
      "description": "Production server"
    }
  ],
  "tags": [
    { "name": "Applications", "description": "Endpoints for managing job applications" },
    { "name": "Authentication", "description": "Endpoints for Firebase authentication and user sync" },
    { "name": "User Profile", "description": "Endpoints for managing user profiles" },
    { "name": "Jobs", "description": "Endpoints for managing jobs" },
    { "name": "Bookmarks", "description": "Endpoints for managing user bookmarks" },
    { "name": "Interests", "description": "Endpoints for managing interests" },
    { "name": "Questions", "description": "Endpoints for managing questions" },
    { "name": "Files", "description": "Endpoints for file management (e.g., uploads)" },
    { "name": "OTP Authentication", "description": "Endpoints for OTP-based authentication" },
    { "name": "Notifications", "description": "Device registration and in-app notifications" },
    { "name": "Content", "description": "Static content such as House Rules" },
    { "name": "Swipe", "description": "Swipe-based job discovery" }
  ],
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "Firebase ID Token",
        "description": "Enter Firebase ID token in the format: Bearer <token>"
      }
    },
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "firebaseUid": { "type": "string", "example": "firebase_uid_123" },
          "email": { "type": "string", "format": "email", "example": "user@example.com" },
          "firstName": { "type": "string", "example": "John" },
          "lastName": { "type": "string", "example": "Doe" },
          "phoneNumber": { "type": "string", "example": "+1234567890" },
          "profilePicture": { "type": "string", "example": "https://example.com/avatar.jpg" },
          "headline": { "type": "string", "example": "Student, Designer, Developer, Volunteer" },
          "aboutMe": { "type": "string", "example": "Tell us about yourself" },
          "resumeUrl": { "type": "string", "example": "https://example.com/uploads/resume.pdf" },
          "workExperience": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/WorkExperience" }
          },
          "education": { "type": "array", "items": { "$ref": "#/components/schemas/Education" } },
          "skills": { "type": "array", "items": { "type": "string" } },
          "languages": { "type": "array", "items": { "type": "string" } },
          "appreciation": { "type": "array", "items": { "$ref": "#/components/schemas/Appreciation" } },
          "gender": { "type": "string", "example": "female" },
          "dateOfBirth": { "type": "string", "format": "date" },
          "isActive": { "type": "boolean", "example": true },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        },
        "required": ["firebaseUid", "email"]
      },
      "WorkExperience": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "jobTitle": { "type": "string", "example": "Manager" },
          "company": { "type": "string", "example": "Acme Inc" },
          "startDate": { "type": "string", "format": "date", "example": "2024-01-01" },
          "endDate": { "type": "string", "format": "date", "nullable": true, "example": "2024-06-30" },
          "current": { "type": "boolean", "example": false },
          "description": { "type": "string", "example": "Worked on mobile app" }
        }
      },
      "Education": {
        "type": "object",
        "properties": {
          "institution": { "type": "string", "example": "University of Oxford" },
          "degree": { "type": "string", "example": "BSc" },
          "fieldOfStudy": { "type": "string", "example": "Information Technology" },
          "startDate": { "type": "string", "format": "date", "example": "2019-09-01" },
          "endDate": { "type": "string", "format": "date", "nullable": true, "example": "2023-08-31" },
          "current": { "type": "boolean", "example": false },
          "grade": { "type": "string", "example": "3.8 GPA" },
          "location": { "type": "string", "example": "Oxford, UK" },
          "description": { "type": "string", "example": "Coursework in systems, AI, and UX." }
        },
        "required": ["institution"]
      },
      "Appreciation": {
        "type": "object",
        "properties": {
          "title": { "type": "string", "example": "Wireless Symposium (WS)" },
          "issuer": { "type": "string", "example": "Young Scientists" },
          "date": { "type": "string", "format": "date", "example": "2024-06-01" },
          "description": { "type": "string", "example": "Awarded for best poster on 5G systems" },
          "url": { "type": "string", "example": "https://example.com/certificates/ws-2024" }
        },
        "required": ["title"]
      },
      "JobCompany": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "example": "Global Corp" },
          "logoUrl": { "type": "string", "example": "https://example.com/logo.png" },
          "industry": { "type": "string", "example": "Technology" },
          "aboutUs": { "type": "string", "example": "Leading innovation worldwide." },
          "gallery": { "type": "array", "items": { "type": "string" }, "example": ["img_url1.jpg", "img_url2.png", "img_url3.jpg"] },
          "address": { "type": "string", "example": "789 Business Ave, Metropolis" },
          "hours": { "type": "string", "example": "Mon-Fri, 8am - 5pm" },
          "phone": { "type": "string", "example": "+1-555-0200" },
          "website": { "type": "string", "example": "https://globalcorp.example.com" }
        },
        "required": ["name"]
      },
      "JobDescription": {
        "type": "object",
        "properties": {
          "details": { "type": "string", "example": "Lead and manage key development projects." },
          "requirements": { "type": "string", "example": "5+ years experience in software development, project management." },
          "stipend": {
            "type": "object",
            "properties": {
              "currency": { "type": "string", "example": "USD" },
              "amount": { "type": "number", "example": 80000 }
            }
          }
        },
        "required": ["details", "stipend"]
      },
      "Job": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef" },
          "title": { "type": "string", "example": "Senior Software Engineer" },
          "company": { "$ref": "#/components/schemas/JobCompany" },
          "description": { "$ref": "#/components/schemas/JobDescription" },
          "duration": { "type": "string", "example": "Full-time" },
          "location": { "type": "string", "example": "New York, NY" },
          "labels": { "type": "array", "items": { "type": "string" }, "example": ["Remote", "Full-time", "Engineering"] },
          "startDate": { "type": "string", "format": "date" },
          "endDate": { "type": "string", "format": "date" },
          "applicationDeadline": { "type": "string", "format": "date" },
          "status": { "type": "string", "enum": ["OPEN", "CLOSED", "DRAFT"], "example": "OPEN" },
          "jobType": { "type": "string", "example": "Full-Time" },
          "weeklyHours": { "type": "number", "example": 40 },
          "isRemote": { "type": "boolean", "example": true },
          "visibility": {
            "type": "object",
            "properties": {
              "displayInApp": { "type": "boolean", "example": true },
              "featured": { "type": "boolean", "example": false }
            }
          },
          "relevancyScore": { "type": "number", "example": 10 },
          "tags": { "type": "array", "items": { "type": "string" } },
          "categories": { "type": "array", "items": { "type": "string" } },
          "sourceUrl": { "type": "string", "example": "https://example.com/job" },
          "source": { "type": "string", "example": "CSV Import" },
          "prize": { "type": "string", "example": "$1000" },
          "sourceType": { "type": "string", "enum": ["csv", "web"], "example": "csv" },
          "bannerImageUrl": { "type": "string", "example": "https://example.com/banner.png" },
          "applyMode": { "type": "string", "enum": ["external", "native"], "example": "external" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        },
        "required": ["title", "company", "description"]
      },
      "JobRequest": {
        "type": "object",
        "properties": {
          "title": { "type": "string", "example": "Senior Software Engineer" },
          "jobType": { "type": "string", "example": "Full-Time" },
          "weeklyHours": { "type": "number", "example": 40 },
          "isRemote": { "type": "boolean", "example": true },
          "visibility": {
            "type": "object",
            "properties": {
              "displayInApp": { "type": "boolean", "example": true },
              "featured": { "type": "boolean", "example": false }
            }
          },
          "company": { "$ref": "#/components/schemas/JobCompany" },
          "description": { "$ref": "#/components/schemas/JobDescription" },
          "duration": { "type": "string", "example": "Full-time" },
          "location": { "type": "string", "example": "New York, NY" },
          "labels": { "type": "array", "items": { "type": "string" }, "example": ["Remote", "Full-time", "Engineering"] },
          "startDate": { "type": "string", "format": "date" },
          "endDate": { "type": "string", "format": "date" },
          "applicationDeadline": { "type": "string", "format": "date" }
        },
        "required": ["title", "company", "description", "applicationDeadline"]
      },
      "Application": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "jobId": { "type": "string", "format": "uuid" },
          "userId": { "type": "string", "format": "uuid" },
          "applicantName": { "type": "string", "example": "John Doe" },
          "portfolioUrl": { "type": "string", "example": "https://portfolio.example.com" },
          "resumeUrl": { "type": "string", "example": "https://resume.example.com" },
          "status": { "type": "string", "enum": ["PENDING", "ACCEPTED", "REJECTED"], "example": "PENDING" },
          "text": { "type": "string", "example": "I am interested in this position..." },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        },
        "required": ["jobId", "userId", "applicantName", "resumeUrl", "text"]
      },
      "ApplicationRequest": {
        "type": "object",
        "properties": {
          "jobId": { "type": "string", "format": "uuid" },
          "applicantName": { "type": "string", "example": "John Doe" },
          "portfolioUrl": { "type": "string", "example": "https://portfolio.example.com" },
          "resumeUrl": { "type": "string", "example": "https://resume.example.com" },
          "text": { "type": "string", "example": "I am interested in this position..." }
        },
        "required": ["jobId", "applicantName", "resumeUrl", "text"]
      },
      "Bookmark": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "userId": { "type": "string", "format": "uuid" },
          "jobId": { "type": "string", "format": "uuid" },
          "createdAt": { "type": "string", "format": "date-time" }
        },
        "required": ["userId", "jobId"]
      },
      "BookmarkWithPopulatedJob": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "userId": { "type": "string", "format": "uuid" },
          "jobId": { "$ref": "#/components/schemas/Job" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      "Interest": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "name": { "type": "string", "example": "Software Development" },
          "isActive": { "type": "boolean", "example": true },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        },
        "required": ["name"]
      },
      "InterestInput": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "example": "Software Development" }
        },
        "required": ["name"]
      },
      "InterestResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "data": { "$ref": "#/components/schemas/Interest" }
        }
      },
      "InterestsResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "data": { "type": "array", "items": { "$ref": "#/components/schemas/Interest" } }
        }
      },
      "Question": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "format": "uuid" },
          "question": { "type": "string", "example": "What is your experience with React?" },
          "isActive": { "type": "boolean", "example": true },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        },
        "required": ["question"]
      },
      "QuestionInput": {
        "type": "object",
        "properties": {
          "question": { "type": "string", "example": "What is your experience with React?" }
        },
        "required": ["question"]
      },
      "QuestionResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "data": { "$ref": "#/components/schemas/Question" }
        }
      },
      "QuestionsResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "data": { "type": "array", "items": { "$ref": "#/components/schemas/Question" } }
        }
      },
      "MediaUrlPayload": {
        "type": "object",
        "properties": {
          "url": { "type": "string", "example": "/uploads/generated-file-name.png" },
          "publicUrl": { "type": "string", "example": "/uploads/generated-file-name.png" },
          "absoluteUrl": { "type": "string", "example": "https://api.example.com/uploads/generated-file-name.png" }
        }
      },
      "FileUploadResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "File uploaded successfully" },
          "url": { "type": "string", "example": "/uploads/generated-file-name.png" },
          "publicUrl": { "type": "string", "example": "/uploads/generated-file-name.png" },
          "absoluteUrl": { "type": "string", "example": "https://api.example.com/uploads/generated-file-name.png" },
          "data": {
            "type": "object",
            "properties": {
              "url": { "type": "string", "example": "/uploads/generated-file-name.png" },
              "publicUrl": { "type": "string", "example": "/uploads/generated-file-name.png" },
              "absoluteUrl": { "type": "string", "example": "https://api.example.com/uploads/generated-file-name.png" },
              "downloadUrl": { "type": "string", "example": "/v1/file/download/generated-file-name.png" },
              "filename": { "type": "string", "example": "generated-file-name.png" },
              "originalname": { "type": "string", "example": "photo.png" },
              "mimetype": { "type": "string", "example": "image/png" },
              "size": { "type": "number", "example": 1024000 }
            }
          }
        }
      },
      "SuccessMessageResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "Operation completed successfully" }
        }
      },
      "SuccessConfirmationResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "Item deleted successfully" }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": false },
          "message": { "type": "string", "example": "Error message" }
        }
      },
      "AuthStatusResponse": {
        "type": "object",
        "properties": {
          "authenticated": { "type": "boolean", "example": true },
          "authStatus": { "type": "string", "enum": ["valid", "expired", "missing"], "example": "valid" },
          "user": {
            "type": "object",
            "properties": {
              "uid": { "type": "string", "example": "firebase_uid_123" },
              "email": { "type": "string", "example": "user@example.com" }
            },
            "nullable": true
          }
        }
      },
      "LazyAuthErrorResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": false },
          "message": {
            "type": "string",
            "enum": [
              "Invalid verification code",
              "Verification code has expired. Please request a new one.",
              "An account with this email already exists",
              "Too many failed attempts. Please request a new verification code.",
              "Please wait at least 1 minute before requesting a new verification code"
            ],
            "example": "Invalid verification code"
          }
        }
      },
      "OTPRequest": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com",
            "description": "Email address to send OTP to"
          }
        },
        "required": ["email"]
      },
      "OTPVerificationRequest": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com",
            "description": "Email address that received the OTP"
          },
          "otp": {
            "type": "string",
            "pattern": "^[0-9]{6}$",
            "example": "123456",
            "description": "6-digit verification code"
          }
        },
        "required": ["email", "otp"]
      },
      "OTPResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "Verification code sent to your email. Please check your inbox." },
          "email": { "type": "string", "format": "email", "example": "user@example.com" }
        }
      },
      "OTPVerifyOnlyResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "Email verified successfully. You can now create your Firebase account with password." },
          "email": { "type": "string", "format": "email", "example": "user@example.com" }
        }
      },
      "FinalizeSignupRequest": {
        "type": "object",
        "properties": {
          "uid": { "type": "string", "example": "firebase-uid-123" },
          "email": { "type": "string", "format": "email", "example": "user@example.com" }
        },
        "required": ["uid", "email"]
      },
      "FinalizeSignupResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "Account finalized successfully" },
          "user": {
            "type": "object",
            "properties": {
              "uid": { "type": "string", "example": "firebase-uid-123" },
              "email": { "type": "string", "format": "email", "example": "user@example.com" }
            }
          }
        }
      },
      "OTPVerificationResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "Account created successfully! Welcome to InternSync." },
          "user": {
            "type": "object",
            "properties": {
              "uid": { "type": "string", "example": "firebase-user-id" },
              "email": { "type": "string", "format": "email", "example": "user@example.com" },
              "isNewUser": { "type": "boolean", "example": true }
            }
          },
          "requiresPasswordSetup": {
            "type": "boolean",
            "example": true,
            "description": "If true, the client should prompt the user to create a password using the Firebase client SDK (updatePassword) after signing in with the returned customToken."
          },
          "customToken": { "type": "string", "example": "firebase-custom-token-for-frontend-auth" }
        }
      },
      "OTPErrorResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": false },
          "message": {
            "type": "string",
            "enum": [
              "Invalid verification code",
              "Verification code has expired. Please request a new one.",
              "An account with this email already exists",
              "Too many failed attempts. Please request a new verification code.",
              "Please wait at least 1 minute before requesting a new verification code"
            ],
            "example": "Invalid verification code"
          }
        }
      }
    }
  },
  "paths": {
    "/v1/user/auth-status": {
      "get": {
        "tags": ["Authentication"],
        "summary": "Check authentication status",
        "description": "Checks the current authentication status. Works with valid, expired, or missing tokens. Returns authStatus and user info if available. Uses lazy authentication.",
        "security": [{ "BearerAuth": [] }],
        "responses": {
          "200": {
            "description": "Authentication status retrieved successfully.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/AuthStatusResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/sync": {
      "post": {
        "tags": ["Authentication"],
        "summary": "Sync Firebase user with backend",
        "description": "Creates or fetches a user in MongoDB based on the authenticated Firebase user. Uses lazy authentication - handles expired tokens gracefully with proper error responses instead of immediate failure.",
        "security": [{ "BearerAuth": [] }],
        "responses": {
          "200": {
            "description": "User synced successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "user": { "$ref": "#/components/schemas/User" },
                    "authStatus": { "type": "string", "example": "valid" }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Authentication issues - expired, missing, or invalid token.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/LazyAuthErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/profile": {
      "get": {
        "tags": ["User Profile"],
        "summary": "Get user profile",
        "description": "Fetches the profile of the authenticated user.",
        "security": [{ "BearerAuth": [] }],
        "responses": {
          "200": {
            "description": "User profile fetched successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "user": { "$ref": "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      "put": {
        "tags": ["User Profile"],
        "summary": "Update user profile",
        "description": "Updates the profile of the authenticated user.",
        "security": [{ "BearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/User" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User profile updated successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Profile updated" }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/file/upload": {
      "post": {
        "tags": ["Files"],
        "summary": "Upload a file",
        "description": "Uploads a file (e.g., resume, profile picture) to the server. The server will store the file and return its URL and other metadata. Requires authentication.",
        "security": [{ "BearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "The file to upload."
                  }
                },
                "required": ["file"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "File uploaded successfully.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/FileUploadResponse" }
              }
            }
          },
          "400": {
            "description": "Bad request (e.g., no file provided, invalid file type, file too large).",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            "description": "Unauthorized. User needs to be logged in.",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } }
          },
          "500": { "description": "Internal server error during file upload.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/v1/file/download/{filename}": {
      "get": {
        "tags": ["Files"],
        "summary": "Download a file",
        "description": "Downloads a specific file from the server using its unique filename (as returned by the upload endpoint). Requires authentication.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "name": "filename",
            "in": "path",
            "required": true,
            "description": "The unique filename of the file to download (e.g., 'generated-file-name.pdf').",
            "schema": { "type": "string", "example": "generated-file-name.pdf" }
          }
        ],
        "responses": {
          "200": {
            "description": "File downloaded successfully. The content type will vary based on the file.",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary",
                  "description": "The binary content of the file."
                }
              }
            }
          },
          "401": { "description": "Unauthorized. User needs to be logged in.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "404": { "description": "File not found.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "500": { "description": "Internal server error during file download.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/v1/file/delete/{filename}": {
      "delete": {
        "tags": ["Files"],
        "summary": "Delete a file",
        "description": "Deletes a specific file from the server using its unique filename. Requires authentication and appropriate permissions (e.g., uploader or admin).",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "name": "filename",
            "in": "path",
            "required": true,
            "description": "The unique filename of the file to delete (e.g., 'generated-file-name.pdf').",
            "schema": { "type": "string", "example": "generated-file-name.pdf" }
          }
        ],
        "responses": {
          "200": {
            "description": "File deleted successfully.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/SuccessMessageResponse" }
              }
            }
          },
          "401": { "description": "Unauthorized. User needs to be logged in.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "403": {
            "description": "Forbidden. User does not have permission to delete this file.",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } }
          },
          "404": { "description": "File not found.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "500": { "description": "Internal server error during file deletion.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/v1/job": {
      "get": {
        "tags": ["Jobs"],
        "summary": "Get all jobs",
        "description": "Retrieves a list of jobs, optionally filtered by status.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "query",
            "name": "freeText",
            "schema": {
              "type": "string"
            },
            "required": false,
            "description": "Search on multiple fields like title, company, location, etc."
          },
          {
            "in": "query",
            "name": "pageNo",
            "schema": { "type": "integer", "default": 1, "minimum": 1 },
            "required": false,
            "description": "Page number for pagination."
          },
          {
            "in": "query",
            "name": "offset",
            "schema": { "type": "integer", "default": 10, "minimum": 1 },
            "required": false,
            "description": "Number of items per pageNo."
          },
          { "in": "query", "name": "status", "schema": { "type": "string" } },
          { "in": "query", "name": "startDate", "schema": { "type": "string", "format": "date" } },
          { "in": "query", "name": "endDate", "schema": { "type": "string", "format": "date" } },
          { "in": "query", "name": "sortBy", "schema": { "type": "string", "enum": ["appsReceived_asc", "appsReceived_desc", "relevance_desc", "deadline_asc", "deadline_desc"] } },
          { "in": "query", "name": "categories", "schema": { "type": "string" }, "description": "Comma-separated categories" },
          { "in": "query", "name": "tags", "schema": { "type": "string" }, "description": "Comma-separated tags" },
          { "in": "query", "name": "sourceType", "schema": { "type": "string", "enum": ["csv", "web"] } },
          { "in": "query", "name": "isRemote", "schema": { "type": "boolean" } },
          { "in": "query", "name": "jobType", "schema": { "type": "string" }, "description": "Original field on Job documents (e.g., 'internship', 'scholarship', 'extracurricular', 'activity')." },
          { "in": "query", "name": "type", "schema": { "type": "string", "enum": ["internship", "scholarship", "extracurricular", "activity"] }, "description": "High-level filter alias mapped to jobType/categories." },
          { "in": "query", "name": "opportunityType", "schema": { "type": "string", "enum": ["internship", "scholarship", "extracurricular", "activity"] }, "description": "Alias of 'type' for flexibility." },
          { "in": "query", "name": "stipendMin", "schema": { "type": "number" } },
          { "in": "query", "name": "stipendMax", "schema": { "type": "number" } },
          { "in": "query", "name": "deadlineBefore", "schema": { "type": "string", "format": "date" } },
          { "in": "query", "name": "deadlineAfter", "schema": { "type": "string", "format": "date" } },
          { "in": "query", "name": "featured", "schema": { "type": "boolean" } }
        ]
    },
    "responses": {
      "200": {
        "description": "A list of jobs.",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "success": { "type": "boolean", "example": true },
                "pageNo": { "type": "integer", "example": 1 },
                "offset": { "type": "integer", "example": 10 },
                "totalItems": { "type": "integer", "example": 50 },
                "totalPages": { "type": "integer", "example": 5 },
                "nextPage": { "type": "integer", "example": 2, "nullable": true },
                "data": {
                  "type": "array",
                  "items": { "$ref": "#/components/schemas/Job" }
                }
              }
            }
          }
        }
      },
      "400": {
        "description": "Invalid status value.",
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/ErrorResponse" }
          }
        }
      }
    },
    "post": {
      "tags": ["Jobs"],
      "summary": "Create a new job (Admin)",
      "description": "Adds a new job to the platform. Requires admin privileges.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "description": "Job object that needs to be added.",
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/JobRequest" }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Job created successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "$ref": "#/components/schemas/Job" }
                }
              }
            }
          }
        },
        "400": {
          "description": "Invalid input, object invalid.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    }
  },

  "/v1/job/{id}": {
    "get": {
      "tags": ["Jobs"],
      "summary": "Get job by ID",
      "description": "Retrieves a specific job by its ID.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the job to retrieve.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Job retrieved successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "$ref": "#/components/schemas/Job" }
                }
              }
            }
          }
        },
        "404": {
          "description": "Job not found.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    },
    "put": {
      "tags": ["Jobs"],
      "summary": "Update job by ID (Admin)",
      "description": "Updates a specific job by its ID. Requires admin privileges.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the job to update.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          }
        }
      ],
      "requestBody": {
        "description": "Job object that needs to be updated.",
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/JobRequest" }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Job updated successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "$ref": "#/components/schemas/Job" }
                }
              }
            }
          }
        },
        "400": {
          "description": "Invalid input, object invalid.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "404": {
          "description": "Job not found.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    },
    "delete": {
      "tags": ["Jobs"],
      "summary": "Delete job by ID (Admin)",
      "description": "Deletes a specific job by its ID. Requires admin privileges.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the job to delete.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Job deleted successfully.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/SuccessConfirmationResponse" }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "404": {
          "description": "Job not found.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    }
  },
  "/v1/application": {
    "post": {
      "tags": ["Applications"],
      "summary": "Create a new application",
      "description": "Submits a new job application. Requires authentication.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "description": "Application object that needs to be submitted.",
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/ApplicationRequest" }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Application submitted successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "$ref": "#/components/schemas/Application" }
                }
              }
            }
          }
        },
        "400": {
          "description": "Invalid input, object invalid.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    },
    "get": {
      "tags": ["Applications"],
      "summary": "Get user's applications",
      "description": "Retrieves a list of applications submitted by the authenticated user.",
      "security": [{ "BearerAuth": [] }],
      "responses": {
        "200": {
          "description": "Applications retrieved successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "type": "array", "items": { "$ref": "#/components/schemas/Application" } }
                }
              }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    }
  },
  "/v1/application/{id}": {
    "get": {
      "tags": ["Applications"],
      "summary": "Get application by ID",
      "description": "Retrieves a specific application by its ID.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the application to retrieve.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Application retrieved successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "$ref": "#/components/schemas/Application" }
                }
              }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "404": {
          "description": "Application not found.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    }
  },
  "/v1/bookmark/{jobId}": {
    "post": {
      "tags": ["Bookmarks"],
      "summary": "Bookmark a job",
      "description": "Adds a job to the user's bookmarks. Requires authentication.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "jobId",
          "in": "path",
          "required": true,
          "description": "The ID of the job to bookmark.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          }
        }
      ],
      "responses": {
        "201": {
          "description": "Job bookmarked successfully.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "data": { "$ref": "#/components/schemas/Bookmark" }
                }
              }
            }
          }
        },
        "400": {
          "description": "Job already bookmarked or invalid job ID.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    },
    "delete": {
      "tags": ["Bookmarks"],
      "summary": "Remove bookmark",
      "description": "Removes a job from the user's bookmarks. Requires authentication.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "jobId",
          "in": "path",
          "required": true,
          "description": "The ID of the job to remove from bookmarks.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Bookmark removed successfully.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/SuccessConfirmationResponse" }
            }
          }
        },
        "401": {
          "description": "Unauthorized.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        },
        "404": {
          "description": "Bookmark not found.",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ErrorResponse" }
            }
          }
        }
      }
    }
  },
  "/v1/bookmark/user": {
    "get": {
      "tags": ["Bookmarks"],
      "summary": "Get user's bookmarked jobs",
      "description": "Retrieves a list of all jobs bookmarked by the currently authenticated user (Applicant), with job details populated.",
      "security": [{ "BearerAuth": [] }],
      "responses": {
        "200": {
          "description": "Successfully retrieved user's bookmarks.",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "count": { "type": "integer", "example": 1 },
                  "data": {
                    "type": "array",
                    "items": { "$ref": "#/components/schemas/BookmarkWithPopulatedJob" }
                  }
                }
              }
            }
          }
        },
        "401": { "description": "Unauthorized. User needs to be logged in.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/interests": {
    "post": {
      "tags": ["Interests"],
      "summary": "Create a new interest (Admin)",
      "description": "Adds a new interest to the system. Admin privileges are typically required for this operation.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/InterestInput" }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Interest created successfully.",
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/InterestResponse" } } }
        },
        "400": { "description": "Invalid input provided.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
        "401": { "description": "Unauthorized.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    },
    "get": {
      "tags": ["Interests"],
      "summary": "Get all active interests",
      "description": "Retrieves a list of all interests marked as active. Publicly accessible or requires basic authentication.",
      "security": [{ "BearerAuth": [] }],
      "responses": {
        "200": {
          "description": "A list of active interests.",
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/InterestsResponse" } } }
        },
        "500": { "description": "Internal server error.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/interests/{id}": {
    "delete": {
      "tags": ["Interests"],
      "summary": "Delete an interest by ID (Admin)",
      "description": "Deletes a specific interest using its unique ID. Admin privileges are typically required for this operation.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the interest to delete.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0855"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Interest deleted successfully.",
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SuccessConfirmationResponse" } } }
        },
        "401": { "description": "Unauthorized.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
        "404": { "description": "Interest not found with the given ID.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/questions": {
    "post": {
      "tags": ["Questions"],
      "summary": "Create a new question (Admin)",
      "description": "Adds a new question to the system. Admin privileges are typically required for this operation.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/QuestionInput" }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Question created successfully.",
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/QuestionResponse" } } }
        },
        "400": { "description": "Invalid input provided.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
        "401": { "description": "Unauthorized.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    },
    "get": {
      "tags": ["Questions"],
      "summary": "Get all active questions",
      "description": "Retrieves a list of all questions marked as active. Publicly accessible or requires basic authentication.",
      "security": [{ "BearerAuth": [] }],
      "responses": {
        "200": {
          "description": "A list of active questions.",
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/QuestionsResponse" } } }
        },
        "500": { "description": "Internal server error.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/questions/{id}": {
    "delete": {
      "tags": ["Questions"],
      "summary": "Delete a question by ID (Admin)",
      "description": "Deletes a specific question using its unique ID. Admin privileges are typically required for this operation.",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "The ID of the question to delete.",
          "schema": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0856"
          }
        }
      ],
      "responses": {
        "200": {
          "description": "Question deleted successfully.",
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SuccessConfirmationResponse" } } }
        },
        "401": { "description": "Unauthorized.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
        "404": { "description": "Question not found with the given ID.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/auth/signup/send-otp": {
    "post": {
      "tags": ["OTP Authentication"],
      "summary": "Send verification OTP for signup",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/OTPRequest" }
          }
        }
      },
      "responses": {
        "200": { "description": "Verification code sent", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPResponse" } } } },
        "400": { "description": "Invalid email format", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } },
        "409": { "description": "Account already exists", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } },
        "500": { "description": "Failed to send verification email", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/auth/signup/verify-otp": {
    "post": {
      "tags": ["OTP Authentication"],
      "summary": "Verify OTP for signup",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/OTPVerificationRequest" }
          }
        }
      },
      "responses": {
        "200": { "description": "Email verified successfully", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPVerifyOnlyResponse" } } } },
        "400": { "description": "Invalid or expired OTP", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } },
        "409": { "description": "Account already exists", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } },
        "429": { "description": "Too many failed attempts", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } }
      }
    }
  },
  "/v1/auth/signup/resend-otp": {
    "post": {
      "tags": ["OTP Authentication"],
      "summary": "Resend verification OTP for signup",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/OTPRequest" }
          }
        }
      },
      "responses": {
        "200": { "description": "New verification code sent", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPResponse" } } } },
        "409": { "description": "Account already exists", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } },
        "429": { "description": "Rate limit exceeded", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } }
      }
    }
  },
  "/v1/auth/signup/finalize": {
    "post": {
      "tags": ["OTP Authentication"],
      "summary": "Finalize signup by creating backend user after Firebase account is created",
      "description": "Requires Firebase ID token in Authorization header. Verifies token and creates user record linked to provided uid and email.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "$ref": "#/components/schemas/FinalizeSignupRequest" }
          }
        }
      },
      "responses": {
        "201": { "description": "Account finalized successfully", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/FinalizeSignupResponse" } } } },
        "400": { "description": "Missing/invalid input or OTP not verified", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OTPErrorResponse" } } } },
        "401": { "description": "Invalid or missing token", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
        "409": { "description": "User already exists", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
      }
    }
  },
  "/v1/swipe/next": {
    "get": {
      "tags": ["Swipe"],
      "summary": "Get next job for swiping (CSV-only by default)",
      "security": [{ "BearerAuth": [] }],
      "parameters": [
        { "in": "query", "name": "type", "schema": { "type": "string", "enum": ["internship", "scholarship", "extracurricular", "activity"] }, "description": "High-level filter: internship | scholarship | extracurricular. 'activity' is treated under the extracurricular bucket as well." },
        { "in": "query", "name": "opportunityType", "schema": { "type": "string", "enum": ["internship", "scholarship", "extracurricular", "activity"] }, "description": "Alias of 'type' for flexibility." }
      ],
      "responses": { "200": { "description": "Next job or null" } }
    }
  },
  "/v1/swipe/action": { "post": { "tags": ["Swipe"], "summary": "Submit a swipe action", "security": [{ "BearerAuth": [] }], "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "jobId": { "type": "string" }, "action": { "type": "string", "enum": ["like", "dislike", "superlike", "skip"] } }, "required": ["jobId", "action"] } } } }, "responses": { "200": { "description": "Action recorded" } } } },
  "/v1/swipe/history": { "get": { "tags": ["Swipe"], "summary": "Get swipe history", "security": [{ "BearerAuth": [] }], "responses": { "200": { "description": "History list" } } } },
  "/v1/swipe/liked": { "get": { "tags": ["Swipe"], "summary": "Get liked jobs", "security": [{ "BearerAuth": [] }], "responses": { "200": { "description": "Liked list" } } } },
  "/v1/swipe/stats": { "get": { "tags": ["Swipe"], "summary": "Get swipe stats", "security": [{ "BearerAuth": [] }], "responses": { "200": { "description": "Stats" } } } },
  "/v1/notifications/register-device": { "post": { "tags": ["Notifications"], "summary": "Register FCM device token", "security": [{ "BearerAuth": [] }], "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "token": { "type": "string" } }, "required": ["token"] } } } }, "responses": { "200": { "description": "Registered" } } } },
  "/v1/notifications/unregister-device": { "post": { "tags": ["Notifications"], "summary": "Unregister FCM device token", "security": [{ "BearerAuth": [] }], "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "token": { "type": "string" } }, "required": ["token"] } } } }, "responses": { "200": { "description": "Unregistered" } } } },
  "/v1/notifications": { "get": { "tags": ["Notifications"], "summary": "List notifications", "security": [{ "BearerAuth": [] }], "parameters": [{ "in": "query", "name": "unreadOnly", "schema": { "type": "boolean" } }, { "in": "query", "name": "pageNo", "schema": { "type": "integer", "default": 1 } }, { "in": "query", "name": "offset", "schema": { "type": "integer", "default": 20 } }], "responses": { "200": { "description": "List" } } } },
  "/v1/notifications/{id}/read": { "patch": { "tags": ["Notifications"], "summary": "Mark single notification as read", "security": [{ "BearerAuth": [] }], "parameters": [{ "in": "path", "name": "id", "schema": { "type": "string" }, "required": true }], "responses": { "200": { "description": "Marked" } } } },
  "/v1/notifications/read-all": { "patch": { "tags": ["Notifications"], "summary": "Mark all as read", "security": [{ "BearerAuth": [] }], "responses": { "200": { "description": "All marked" } } } },
  "/v1/notifications/test": { "post": { "tags": ["Notifications"], "summary": "Send test notification", "security": [{ "BearerAuth": [] }], "responses": { "200": { "description": "Test sent" } } } },
  "/v1/content/house-rules": {
    "get": { "tags": ["Content"], "summary": "Get House Rules", "responses": { "200": { "description": "Current house rules" } } },
    "put": { "tags": ["Content"], "summary": "Update House Rules (Admin)", "security": [{ "BearerAuth": [] }], "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "title": { "type": "string" }, "body": { "type": "string" }, "published": { "type": "boolean" } } } } } }, "responses": { "200": { "description": "Updated" } } }
  },
  "/v1/user/about": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update about me",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "aboutMe": { "type": "string" } }, "required": ["aboutMe"] }
          }
        }
      },
      "responses": { "200": { "description": "About me updated" } }
    }
  },
  "/v1/user/work-experience": {
    "post": {
      "tags": ["User Profile"],
      "summary": "Add work experience",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "jobTitle": { "type": "string" }, "company": { "type": "string" }, "startDate": { "type": "string", "format": "date" }, "endDate": { "type": "string", "format": "date" }, "current": { "type": "boolean" }, "description": { "type": "string" } }, "required": ["jobTitle", "company", "startDate"] }
          }
        }
      },
      "responses": { "201": { "description": "Work experience added" } }
    }
  },
  "/v1/user/work-experience/{id}": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update work experience",
      "security": [{ "BearerAuth": [] }],
      "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }],
      "requestBody": {
        "required": false,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "jobTitle": { "type": "string" }, "company": { "type": "string" }, "startDate": { "type": "string", "format": "date" }, "endDate": { "type": "string", "format": "date" }, "current": { "type": "boolean" }, "description": { "type": "string" } } }
          }
        }
      },
      "responses": { "200": { "description": "Work experience updated" } }
    },
    "delete": {
      "tags": ["User Profile"],
      "summary": "Delete work experience",
      "security": [{ "BearerAuth": [] }],
      "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }],
      "responses": { "200": { "description": "Work experience deleted" } }
    }
  },
  "/v1/user/skills": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update skills",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "skills": { "type": "array", "items": { "type": "string" } } }, "required": ["skills"] }
          }
        }
      },
      "responses": { "200": { "description": "Skills updated" } }
    }
  },
  "/v1/user/languages": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update languages",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "languages": { "type": "array", "items": { "type": "string" } } }, "required": ["languages"] }
          }
        }
      },
      "responses": { "200": { "description": "Languages updated" } }
    }
  },
  "/v1/user/education": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update education",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": { "education": { "type": "array", "items": { "$ref": "#/components/schemas/Education" } } },
              "required": ["education"]
            }
          }
        }
      },
      "responses": { "200": { "description": "Education updated" } }
    }
  },
  "/v1/user/appreciation": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update appreciation",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": { "appreciation": { "type": "array", "items": { "$ref": "#/components/schemas/Appreciation" } } },
              "required": ["appreciation"]
            }
          }
        }
      },
      "responses": { "200": { "description": "Appreciation updated" } }
    }
  },
  "/v1/user/profile-picture": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update profile picture URL",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "profilePicture": { "type": "string" }, "url": { "type": "string" } } }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Profile picture updated",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "message": { "type": "string", "example": "Profile picture updated" },
                  "url": { "type": "string", "example": "/uploads/pic.png" },
                  "publicUrl": { "type": "string", "example": "/uploads/pic.png" },
                  "absoluteUrl": { "type": "string", "example": "https://api.example.com/uploads/pic.png" },
                  "data": { "$ref": "#/components/schemas/MediaUrlPayload" }
                }
              }
            }
          }
        }
      }
    }
  },
  "/v1/user/resume": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update resume URL",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "resumeUrl": { "type": "string" }, "url": { "type": "string" } } }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Resume URL updated",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": { "type": "boolean", "example": true },
                  "message": { "type": "string", "example": "Resume URL updated" },
                  "url": { "type": "string", "example": "/uploads/resume.pdf" },
                  "publicUrl": { "type": "string", "example": "/uploads/resume.pdf" },
                  "absoluteUrl": { "type": "string", "example": "https://api.example.com/uploads/resume.pdf" },
                  "data": { "$ref": "#/components/schemas/MediaUrlPayload" }
                }
              }
            }
          }
        }
      }
    }
  },
  "/v1/user/headline": {
    "put": {
      "tags": ["User Profile"],
      "summary": "Update user headline (profile role)",
      "description": "Sets the user's profile headline, e.g., Student, Designer, Developer, Volunteer. Not to be confused with backend access role.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": { "type": "object", "properties": { "headline": { "type": "string", "example": "Designer" } }, "required": ["headline"] }
          }
        }
      },
      "responses": { "200": { "description": "Headline updated" } }
    }
  },
  "/v1/user/upload/profile-picture": {
    "post": {
      "tags": ["User Profile"],
      "summary": "Upload profile picture (multipart/form-data)",
      "description": "Accepts image file (jpg, jpeg, png, gif, webp); returns public URL fields.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "multipart/form-data": {
            "schema": {
              "type": "object",
              "properties": {
                "file": { "type": "string", "format": "binary" }
              },
              "required": ["file"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Profile picture uploaded",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/FileUploadResponse" }
            }
          }
        }
      }
    }
  },
  "/v1/user/upload/resume": {
    "post": {
      "tags": ["User Profile"],
      "summary": "Upload resume (multipart/form-data)",
      "description": "Accepts PDF or DOC/DOCX; returns public URL fields.",
      "security": [{ "BearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "multipart/form-data": {
            "schema": {
              "type": "object",
              "properties": {
                "file": { "type": "string", "format": "binary" }
              },
              "required": ["file"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Resume uploaded",
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/FileUploadResponse" }
            }
          }
        }
      }
    }
  }
}
};

export default swaggerDocument;