const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "Job Platform API",
    "version": "1.0.0",
    "description": "API documentation for the Job platform backend."
  },
  "servers": [
    {
      "url": "https://internsync-production.up.railway.app",
      "description": "Production server"
    }
  ],
  "tags": [
    { "name": "Applications", "description": "Endpoints for managing job applications" },
    { "name": "Auth", "description": "Authentication related endpoints (register, login, OTP)" },
    { "name": "User Profile", "description": "Endpoints for managing user profiles" },
    { "name": "Jobs", "description": "Endpoints for managing jobs" },
    { "name": "Bookmarks", "description": "Endpoints for managing user bookmarks" },
    { "name": "Interests", "description": "Endpoints for managing interests" },
    { "name": "Questions", "description": "Endpoints for managing questions" },
    { "name": "Files", "description": "Endpoints for file management (e.g., uploads)" },
  ],
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Enter JWT token in the format: Bearer <token>"
      }
    },
    "schemas": {
      "JobCompany": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "example": "Global Corp" },
          "aboutUs": {
            "type": "string",
            "example": "Leading innovation worldwide."
          },
          "gallery": { "type": "array", "items": { "type": "string" }, "example": ["img_url1.jpg", "img_url2.png", "img_url3.jpg"]},
          "address": {
            "type": "string",
            "example": "789 Business Ave, Metropolis"
          },
          "hours": { "type": "string", "example": "Mon-Fri, 8am - 5pm" },
          "phone": { "type": "string", "example": "+1-555-0200" },
          "website": {
            "type": "string",
            "example": "https://globalcorp.example.com"
          }
        },
        "required": ["name"]
      },
      "JobDescription": {
        "type": "object",
        "properties": {
          "details": {
            "type": "string",
            "example": "Lead and manage key development projects."
          },
          "requirements": {
            "type": "string",
            "example": "5+ years experience in software development, project management."
          },
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
          "_id": { // Changed from 'id' to '_id' to match the model's primary key
            "type": "string",
            "format": "uuid",
            "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "description": "Unique identifier for the job (UUID)"
          }, // Changed from 'id' to '_id' to match the model's primary key
          "designation": { "type": "string", "example": "Senior Software Engineer" },
          "company": { "$ref": "#/components/schemas/JobCompany" },
          "description": { "$ref": "#/components/schemas/JobDescription" },
          "duration": { "type": "string", "example": "Full-time" },
          "location": { "type": "string", "example": "New York, NY" }, // Added location
          "labels": { // Added labels
            "type": "array",
            "items": { "type": "string" },
            "example": ["Remote", "Full-time", "Engineering"]
          },
          // "skillsRequired" is removed as it's not in jobSchemaModel
          // "skillsRequired": {
          //   "type": "array",
          //   "items": { "type": "string" },
          //   "example": ["Java", "Spring Boot", "Microservices"]
          // },
          "startDate": {
            "type": "string",
            "format": "date",
            "example": "2024-07-01"
          },
          "endDate": { "type": "string", "format": "date", "example": "2025-06-30" },
          "applicationDeadline": {
            "type": "string",
            "format": "date",
            "example": "2024-06-15"
          },
          "status": {
            "type": "string",
            "enum": ["OPEN", "CLOSED"],
            "example": "OPEN"
          },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "JobRequest": {
        "type": "object",
        "properties": {
          "designation": { "type": "string", "example": "Senior Software Engineer" },
          "company": { "$ref": "#/components/schemas/JobCompany" },
          "description": { "$ref": "#/components/schemas/JobDescription" },
          "duration": { "type": "string", "example": "9hr-10hr" },
          "location": { "type": "string", "example": "New York, NY" }, // Added location
          "labels": { // Added labels
            "type": "array",
            "items": { "type": "string" },
            "example": ["Remote", "Full-time", "Engineering"]
          },
          // "skillsRequired" is removed as it's not in jobSchemaModel
          // "skillsRequired": {
          //   "type": "array",
          //   "items": { "type": "string" },
          //   "example": ["Java", "Spring Boot", "Microservices"]
          // },
          "startDate": { "type": "string", "format": "date", "example": "2025-06-30" },
          "endDate": { "type": "string", "format": "date", "example": "2025-06-30" },
          "applicationDeadline": {
            "type": "string",
            "format": "date",
            "example": "2024-06-15"
          }
        },
        "required": ["designation", "company", "description"]
      },
      "WorkExperience": {
        "type": "object",
        "properties": {
          "jobTitle": { "type": "string", "example": "Software Developer" },
          "company": { "type": "string", "example": "Tech Solutions Inc." },
          "startDate": { "type": "string", "format": "date", "example": "2020-06-01" },
          "endDate": { "type": "string", "format": "date", "nullable": true, "example": "2022-05-30" },
          "current": { "type": "boolean", "example": false },
          "description": { "type": "string", "nullable": true, "example": "Developed and maintained web applications." }
        },
        "required": ["jobTitle", "company", "startDate", "current"]
      },
      "User": {
        "type": "object",
        "properties": {
          "_id": { // Changed from id to _id
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
          },
          "firstName": { "type": "string", "example": "John" },
          "lastName": { "type": "string", "example": "Doe" },
          "email": {
            "type": "string",
            "format": "email",
            "example": "john.doe@example.com"
          },
          "phoneNumber": { "type": "string", "example": "+1234567890" },
          "profilePicture": {
            "type": "string",
            "format": "url",
            "example": "http://example.com/profile.jpg"
          },
          "gender": { "type": "string", "example": "Male" },
          "dateOfBirth": {
            "type": "string",
            "format": "date",
            "example": "1990-01-01"
          },
          "isActive": { "type": "boolean", "example": true },
          "role": {
            "type": "string",
            "enum": ["APPLICANT", "ADMIN", "RECRUITER"],
            "example": "APPLICANT"
          },
          "interests": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid",
              "description": "ID of an interest (UUID).",
              "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
            },
            "description": "Array of Interest IDs associated with the user."
          },
          "answers": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "question": {
                  "type": "string",
                  "format": "uuid",
                  "description": "ID of the question (UUID).",
                  "example": "d290f1ee-6c54-4b01-90e6-d701748f0852"
                },
                "answer": {
                  "type": "string",
                  "example": "This is my answer."
                },
                "_id": {
                  "type": "string",
                  "description": "Unique ID for this answer entry (typically auto-generated MongoDB ObjectId for subdocuments).",
                  "example": "60d0fe4f5311236168a109dd"
                }
              }
            },
            "description": "Array of question-answer pairs for the user."
          },
          "aboutMe": {
            "type": "string",
            "example": "A passionate software developer with a knack for problem-solving."
          },
          "resume": {
            "type": "string",
            "format": "url",
            "nullable": true,
            "example": "http://example.com/uploads/john_doe_resume.pdf"
          },
          "workExperience": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/WorkExperience"
            }
          },
          "education": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": ["B.Sc. Computer Science - XYZ University"]
          },
          "skills": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "example": ["TypeScript", "Node.js", "React"]
          },
          "languages": {
            "type": "array",
            "items": { "type": "string" },
            "example": ["English", "Spanish"]
          },
          "appreciation": {
            "type": "array",
            "items": { "type": "string" },
            "example": ["Team Player Award 2021"]
          }
        }
      },
      "RegisterRequest": {
        "type": "object",
        "required": ["email"],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "newuser@example.com"
          }
        }
      },
      "RegisterUserResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "OTP sent successfully." },
          "otp": {
            "type": "string",
            "example": "123456",
            "description": "The OTP generated (for dev/testing purposes)."
          }
        }
      },
      "VerifyOtpRequest": {
        "type": "object",
        "required": ["email", "otp"],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "newuser@example.com"
          },
          "otp": { "type": "string", "example": "123456" }
        }
      },
      "VerifyOtpResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": {
            "type": "string",
            "example": "OTP verified successfully"
          },
          "token": {
            "type": "string",
            "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          },
          "user": {
            "type": "object",
            "properties": {
              "id": { "type": "string", "format": "uuid", "example": "d290f1ee-6c54-4b01-90e6-d701748f0851" },
              "email": { // Example user ID should be UUID
                "type": "string",
                "format": "email",
                "example": "user@example.com"
              }
            }
          }
        }
      },
      "LoginRequest": {
        "type": "object",
        "required": ["email", "password"],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com"
          },
          "password": {
            "type": "string",
            "format": "password",
            "example": "password123"
          }
        }
      },
      "LoginResponse": {
        "type": "object",
        "properties": {
          "user": { "$ref": "#/components/schemas/User" },
          "statusCode": { "type": "integer", "example": 200 },
          "accessToken": {
            "type": "string",
            "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      "UpdateProfileRequest": {
        "type": "object",
        "properties": {
          "firstName": { "type": "string", "example": "John" },
          "email": { // Added email field
            "type": "string",
            "format": "email",
            "example": "john.doe.updated@example.com"
          },
          "lastName": { "type": "string", "example": "Doe" },
          "phoneNumber": { "type": "string", "example": "+19876543210" },
          "profilePicture": {
            "type": "string",
            "format": "url",
            "example": "http://example.com/new_pic.jpg"
          },
          "gender": { "type": "string", "example": "Male" },
          "dateOfBirth": {
            "type": "string",
            "format": "date",
            "example": "1990-01-15"
          },
          "password": {
            "type": "string",
            "format": "password",
            "description": "Only if changing password",
            "example": "newSecurePassword123"
          },
          "interests": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid",
              "description": "Interest ID (UUID)",
              "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
            },
            "description": "Array of Interest IDs to associate with the user."
          },
          "answers": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "question": {
                  "type": "string",
                  "format": "uuid",
                  "description": "Question ID (UUID)",
                  "example": "d290f1ee-6c54-4b01-90e6-d701748f0852"
                },
                "answer": { "type": "string", "example": "My updated answer for this question." }
              },
              "required": ["question", "answer"]
            },
            "description": "Array of question-answer pairs. This will likely replace the existing answers array for the user."
          },
          "aboutMe": {
            "type": "string",
            "example": "Updated about me section: Still a passionate software developer..."
          },
          "resume": {
            "type": "string",
            "format": "url",
            "nullable": true,
            "example": "http://example.com/uploads/john_doe_updated_resume.pdf"
          },
          "workExperience": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/WorkExperience"
            },
            "description": "Provide the full array of work experiences. This will replace the existing work experience."
          },
          "education": {
            "type": "array",
            "items": { "type": "string" },
            "example": ["M.Sc. Advanced Computing - ABC University"]
          },
          "skills": {
            "type": "array",
            "items": { "type": "string" },
            "example": ["TypeScript", "Node.js", "React", "GraphQL"]
          },
          "languages": {
            "type": "array",
            "items": { "type": "string" },
            "example": ["English", "Spanish", "German"]
          },
          "appreciation": {
            "type": "array",
            "items": { "type": "string" }
          },
        }
      },
      "FileUploadResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string", "example": "File uploaded successfully." },
          "data": {
            "type": "object",
            "properties": {
              "url": { "type": "string", "format": "url", "example": "http://example.com/uploads/generated-file-name.pdf" },
              "originalname": { "type": "string", "example": "my_resume.pdf" }, // Corrected from originalName
              "mimetype": { "type": "string", "example": "application/pdf" },   // Corrected from mimeType
              "size": { "type": "integer", "example": 123456, "description": "File size in bytes" }
            },
            "required": ["url", "originalName", "mimeType", "size"]
          }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "status": { "type": "integer", "example": 400 }, // Aligned with global error handler
          "message": { "type": "string", "example": "Error message details" } // Aligned with global error handler
        }
      },
      "SuccessMessageResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "message": { "type": "string" }
        }
      },
      "ForgotPasswordRequest": {
        "type": "object",
        "required": ["email"],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com"
          }
        }
      },
      "ResetPasswordRequest": {
        "type": "object",
        "required": ["email", "otp", "newPassword"],
        "properties": {
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com"
          },
          "otp": { "type": "string", "example": "123456" },
          "newPassword": {
            "type": "string",
            "format": "password",
            "example": "newStrongPassword123"
          }
        }
      },
      "Bookmark": {
        "type": "object",
        "properties": {
          "_id": { // Changed from id to _id
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0853",
            "description": "Bookmark ID (UUID)"
          },
          "userId": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "description": "ID of the user who bookmarked (UUID)"
          },
          "jobId": { "type": "string", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef", "description": "ID of the bookmarked job" },
          "createdAt": { "type": "string", "format": "date-time" },
          // "updatedAt" removed as bookmarkModel has updatedAt: false
        }
      },
      "BookmarkResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true },
          "data": { "$ref": "#/components/schemas/Bookmark" },
          "message": {
            "type": "string",
            "example": "Job already bookmarked",
            "description": "Optional message, present if the job was already bookmarked."
          }
        }
      },
      "BookmarkedJobDetails": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef", "description": "Job ID" },
          "designation": { "type": "string", "example": "Software Engineer" },
          "company": { "$ref": "#/components/schemas/JobCompany" },
          "description": { "$ref": "#/components/schemas/JobDescription" }, // Added based on controller populate
          "location": { "type": "string", "example": "Remote" },
          "labels": { "type": "array", "items": { "type": "string" }, "example": ["Remote", "Tech"] }, // Added based on controller populate
          "status": { "type": "string", "enum": ["OPEN", "CLOSED"], "example": "OPEN" }
        },
        "description": "Subset of Job details populated for user's bookmarks list."
      },
      "BookmarkWithPopulatedJob": {
        "type": "object",
        "allOf": [{ "$ref": "#/components/schemas/Bookmark" }],
        "properties": { "jobId": { "$ref": "#/components/schemas/BookmarkedJobDetails" } }
      },
      "ApplicationStatusEnum": {
        "type": "string",
        "enum": ["PENDING", "APPROVED", "REJECTED"],
        "example": "PENDING", // Corrected example
        "description": "Status of the application"
      },
      "Application": {
        "type": "object",
        "properties": {
          "_id": { // Changed from id to _id
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0854",
            "description": "Application ID (UUID)"
          },
          "jobId": { "type": "string", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef", "description": "ID of the applied job" },
          "userId": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "description": "ID of the applicant user (UUID)"
          },
          "applicantName": { "type": "string", "example": "Jane Doe" },
          // "contactEmail" and "skills" removed as they are not in the model provided in this context
          "resumeUrl": { "type": "string", "format": "url", "example": "/uploads/jane_doe_resume.pdf", "description": "Path/URL to the applicant's resume" },
          "portfolioUrl": { "type": "string", "format": "url", "nullable": true, "example": "https://jane.doe.portfolio.com", "description": "Applicant's portfolio link" }, // Added
          "text": { "type": "string", "example": "Cover letter or additional information provided by the applicant." }, // Added
          "status": { "$ref": "#/components/schemas/ApplicationStatusEnum" }, // Replaced submittedAt with createdAt and updatedAt from model timestamps
          "createdAt": { "type": "string", "format": "date-time", "description": "Timestamp when the application was created/submitted" },
          "updatedAt": { "type": "string", "format": "date-time" }
        },
        "required": ["_id", "jobId", "userId", "applicantName", "resumeUrl", "text", "status", "createdAt", "updatedAt"] // Corrected required fields
      },
      "CreateApplicationRequest": {
        "type": "object",
        "required": ["resumeUrl", "text"],
        "properties": {
          "ApplicantName": { "type": "string", "nullable": true, "example": "Jane Doe", "description": "Applicant's full name (optional, defaults to logged-in user's name)" },
          "resumeUrl": { "type": "string", "format": "url", "example": "/uploads/my_resume.pdf", "description": "Path/URL to the uploaded resume" },
          "portfolioLink": { "type": "string", "format": "url", "nullable": true, "example": "https://myportfolio.com", "description": "Link to applicant's portfolio (optional). Note: Model does not currently store this." },
          "text": { "type": "string", "example": "I am very interested in this position because...", "description": "Cover letter or additional information." }
          // "skills" removed as it's not in the controller's req.body expectation for this context
        }
      },
      "PopulatedJobDetailsForUserApplication": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef", "description": "Job ID" },
          "designation": { "type": "string", "example": "Software Engineer Job" }, // Changed from title and "Intern" to "Job"
          "description": { "$ref": "#/components/schemas/JobDescription" }, // Added based on controller populate
          "company": { "$ref": "#/components/schemas/JobCompany" },
          "location": { "type": "string", "example": "New York" }, // Added based on controller populate
          "labels": { "type": "array", "items": { "type": "string" }, "example": ["Full-time", "Remote"] } // Added based on controller populate
        },
        "description": "Subset of Job details populated for user's applications list."
      },
      "ApplicationWithPopulatedJob": {
        "type": "object",
        "properties": {
          "_id": { // Changed from id
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0854"
          },
          "jobId": { "$ref": "#/components/schemas/PopulatedJobDetailsForUserApplication" },
          "userId": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
          },
          "applicantName": { "type": "string", "example": "Jane Doe" },
          "resumeUrl": { "type": "string", "format": "url", "example": "/uploads/resume.pdf" },
          "portfolioUrl": { "type": "string", "format": "url", "nullable": true, "example": "https://jane.doe.portfolio.com" },
          "text": { "type": "string", "example": "Cover letter content..." },
          "status": { "$ref": "#/components/schemas/ApplicationStatusEnum" },
          // "submittedAt" replaced by createdAt/updatedAt
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "ApplicationSummaryData": {
        "type": "object",
        "properties": {
          "total": { "type": "integer", "example": 100 },
          "accepted": { "type": "integer", "example": 20 },
          "rejected": { "type": "integer", "example": 30 },
          "pending": { "type": "integer", "example": 50 }
        }
      },
      "PopulatedUserInfoForApplicationAdminView": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "description": "User ID (UUID)"
          },
          "firstName": { "type": "string", "example": "John" },
          "lastName": { "type": "string", "example": "Doe" },
          "email": { "type": "string", "format": "email", "example": "john.doe@example.com" },
          "profilePicture": { "type": "string", "format": "url", "example": "http://example.com/profile.jpg" }
        },
        "description": "Subset of User details populated for admin view of applications."
      },
      "SkillMatchDetails": {
        "type": "object",
        "properties": {
          "matchedSkills": { "type": "array", "items": { "type": "string" }, "example": ["Node.js", "MongoDB"] },
          "missingSkills": { "type": "array", "items": { "type": "string" }, "example": ["React"] },
          "additionalSkills": { "type": "array", "items": { "type": "string" }, "example": ["Express.js"] },
          "matchScore": { "type": "number", "format": "float", "example": 66.67, "description": "Percentage of required skills matched" }
        }
      },
      "ApplicationWithUserDetailsAndSkillMatch": {
        "type": "object",
        "properties": {
          "_id": { // Changed from id
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0854"
          },
          "jobId": { "type": "string", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef" },
          "userId": { "$ref": "#/components/schemas/PopulatedUserInfoForApplicationAdminView" },
          "applicantName": { "type": "string", "example": "Jane Doe" },
          "resumeUrl": { "type": "string", "format": "url", "example": "/uploads/resume.pdf" },
          "portfolioUrl": { "type": "string", "format": "url", "nullable": true, "example": "https://jane.doe.portfolio.com" },
          "text": { "type": "string", "example": "Cover letter content..." },
          "status": { "$ref": "#/components/schemas/ApplicationStatusEnum" },
          // "submittedAt" replaced by createdAt/updatedAt
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" },
          "skillMatchDetails": { "$ref": "#/components/schemas/SkillMatchDetails" }
        }
      },
      "ApplicationWithUserDetails": { // New schema without skillMatchDetails
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "format": "uuid",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0854"
          },
          "jobId": { "type": "string", "example": "a1b2c3d4-e5f6-7890-1234-567890abcdef" },
          "userId": { "$ref": "#/components/schemas/PopulatedUserInfoForApplicationAdminView" },
          "applicantName": { "type": "string", "example": "Jane Doe" },
          "resumeUrl": { "type": "string", "format": "url", "example": "/uploads/resume.pdf" },
          "portfolioUrl": { "type": "string", "format": "url", "nullable": true, "example": "https://jane.doe.portfolio.com" },
          "text": { "type": "string", "example": "Cover letter content..." },
          "status": { "$ref": "#/components/schemas/ApplicationStatusEnum" },
          // "submittedAt" replaced by createdAt/updatedAt
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "UpdateApplicationStatusRequest": {
        "type": "object",
        "required": ["status"],
        "properties": {
          "status": { "$ref": "#/components/schemas/ApplicationStatusEnum" }
        }
      },
      "Interest": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "format": "uuid",
            "description": "Unique identifier for the interest (UUID).",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0855"
          },
          "name": {
            "type": "string",
            "description": "Name of the interest.",
            "example": "Software Development"
          },
          "isActive": {
            "type": "boolean",
            "description": "Whether the interest is active.",
            "default": true,
            "example": true
          }
        }
      },
      "InterestInput": {
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the interest.",
            "example": "Data Science"
          }
        }
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
          "data": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Interest" }
          }
        }
      },
      "Question": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string",
            "format": "uuid",
            "description": "Unique identifier for the question (UUID).",
            "example": "d290f1ee-6c54-4b01-90e6-d701748f0856"
          },
          "text": {
            "type": "string",
            "description": "The text of the question.",
            "example": "What are your career goals?"
          },
          "isActive": {
            "type": "boolean",
            "description": "Whether the question is active.",
            "default": true,
            "example": true
          }
        }
      },
      "QuestionInput": {
        "type": "object",
        "required": ["text"],
        "properties": {
          "text": {
            "type": "string",
            "description": "The text of the question.",
            "example": "Describe a challenging project."
          }
        }
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
          "data": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Question" }
          }
        }
      },
      "SuccessConfirmationResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean", "example": true }
        }
      }
    }
  },
  "paths": {
    "/v1/application/job/{jobId}": {
      "post": {
        "tags": ["Applications"],
        "summary": "Create a new application for a job",
        "description": "Allows an authenticated user (Applicant) to submit an application for a specific job. The job must be open for applications.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "jobId",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890ab" }, // Example UUID
            "required": true,
            "description": "The ID of the job to apply for."
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/CreateApplicationRequest" }
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
          "400": { "description": "Bad request (e.g., already applied, invalid input).", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { "description": "Unauthorized. User needs to be logged in.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "404": { "description": "Job not found or not open for applications.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      },
      "get": { // Added GET to the same path, replacing /all
        "tags": ["Applications"],
        "summary": "Get all applications for a specific job (Admin)", // Admin
        "description": "Retrieves all applications submitted for a specific job, including applicant details and skill match scores. Requires Admin privileges.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "jobId",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890ab" }, // Example UUID
            "required": true,
            "description": "The ID of the job to retrieve applications for."
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved applications for the job.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "count": { "type": "integer", "example": 1 },
                    "data": { "type": "array", "items": { "$ref": "#/components/schemas/ApplicationWithUserDetails" } } // Updated schema
                  }
                }
              }
            }
          },
          "401": { "description": "Unauthorized. Admin access required.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "404": { "description": "Job not found.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        },
      }
    },
    "/v1/application/user/applications": {
      "get": {
        "tags": ["Applications"],
        "summary": "Get applications submitted by the logged-in user",
        "description": "Retrieves a list of all job applications submitted by the currently authenticated user (Applicant).",
        "security": [{ "BearerAuth": [] }],
        "parameters": [ // Added pagination parameters
          {
            "in": "query",
            "name": "freeText",
            "schema": { "type": "string" },
            "required": false,
            "description": "Search on Application status."
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
            "description": "Number of items per page."
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully retrieved user's applications.",
            "content": {
              "application/json": {
                "schema": { // Updated to IPaginationResponse structure
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "pageNo": { "type": "integer", "example": 1 },
                    "offset": { "type": "integer", "example": 10 },
                    "totalItems": { "type": "integer", "example": 5 },
                    "totalPages": { "type": "integer", "example": 1 },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/ApplicationWithPopulatedJob" }
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
    "/v1/application/summary": {
      "get": {
        "tags": ["Applications"],
        "summary": "Get summary of all applications (Admin)", // Admin
        "description": "Retrieves a summary of all applications, including total, accepted, rejected, and pending counts. Requires Admin privileges.",
        "security": [{ "BearerAuth": [] }],
        "responses": {
          "200": {
            "description": "Successfully retrieved application summary.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "data": { "$ref": "#/components/schemas/ApplicationSummaryData" }
                  }
                }
              }
            }
          },
          "401": { "description": "Unauthorized. Admin access required.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/v1/application/{applicationId}/status/{status}": { // status added to path
      "patch": {
        "tags": ["Applications"],
        "summary": "Update application status (Admin)", // Admin
        "description": "Updates the status of a specific application (e.g., to APPROVED or REJECTED). Requires Admin privileges.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "applicationId",
            "schema": {
              "type": "string",
              "format": "uuid",
              "example": "d290f1ee-6c54-4b01-90e6-d701748f0854"
            },
            "required": true,
            "description": "The ID of the application to update."
          },
          { // New path parameter for status
            "in": "path",
            "name": "status",
            "schema": { "$ref": "#/components/schemas/ApplicationStatusEnum" },
            "required": true,
            "description": "The new status for the application (PENDING, APPROVED, REJECTED)."
          }
        ],
        // requestBody is removed as status is now a path parameter.
        "responses": {
          "200": {
            "description": "Application status updated successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "data": { "$ref": "#/components/schemas/Application" },
                    "message": { "type": "string", "example": "Application status updated successfully."} // Added message field
                  }
                }
              }
            }
          },
          "400": { "description": "Bad request (e.g., invalid status provided).", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "401": { "description": "Unauthorized. Admin access required.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "404": { "description": "Application not found.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/v1/user/register": {
      "post": {
        "tags": ["Auth"],
        "summary": "Register a new user",
        "description": "Registers a new user with an email and sends an OTP for verification.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/RegisterRequest" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OTP sent successfully or Account created successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterUserResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad request (e.g., email missing, user already exists).",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/otp-verify": {
      "post": {
        "tags": ["Auth"],
        "summary": "Verify OTP",
        "description": "Verifies the OTP sent to the user's email, activates the account, and returns a JWT.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/VerifyOtpRequest" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OTP verified successfully.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/VerifyOtpResponse" }
              }
            }
          },
          "400": {
            "description": "Bad request (e.g., missing fields, user not found, OTP not found).",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            "description": "Unauthorized (e.g., invalid OTP, OTP expired).",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/login": {
      "post": {
        "tags": ["Auth"],
        "summary": "Login user",
        "description": "Logs in an existing user with email and password, returns a JWT.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/LoginRequest" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User logged in successfully.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/LoginResponse" }
              }
            }
          },
          "400": {
            "description": "Bad request (e.g., missing fields, user not found, invalid credentials, user not active).",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/profile": { // Consolidated path for GET and PUT user profile
      "put": {
        "tags": ["User Profile"], // Changed tag
        "summary": "Update user profile",
        "description": "Updates the profile of the authenticated user. Requires authentication.",
        "security": [{ "BearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/UpdateProfileRequest" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User profile updated successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessMessageResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad request (e.g., validation errors).",
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
        "tags": ["User Profile"],
        "summary": "Get current user profile",
        "description": "Retrieves the profile of the authenticated user. Requires authentication.",
        "security": [{ "BearerAuth": [] }],
        "responses": {
          "200": {
            "description": "User profile retrieved successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "message": { "type": "string", "example": "Profile fetched successfully." },
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
          },
          "404": {
            "description": "User not found.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/forgot-password": {
      "post": {
        "tags": ["Auth"],
        "summary": "Request password reset OTP",
        "description": "Sends an OTP to the user's email address to initiate password reset. The actual email sending is conceptual in the current controller implementation.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ForgotPasswordRequest" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OTP sent to your email (conceptually).",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "OTP sent to your email" }
                  }
                }
              }
            }
          },
          "404": {
            "description": "User not found.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/v1/user/reset-password": {
      "post": {
        "tags": ["Auth"],
        "summary": "Reset user password",
        "description": "Allows a user to reset their password using the OTP received via email and a new password.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ResetPasswordRequest" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Password has been successfully reset.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string", "example": "Password has been successfully reset" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request (e.g., missing fields, invalid or expired OTP).",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } }
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
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } }
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
              // You can add more specific content types if your server can determine them
              // e.g., "image/png": { schema: { type: "string", format: "binary" } }
            }
          },
          "401": { "description": "Unauthorized. User needs to be logged in.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "404": { "description": "File not found.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "500": { "description": "Internal server error during file download.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      },
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
          }
        ],
        "responses": {
          "200": {
            "description": "A list of jobs.",
            "content": {
              "application/json": {
                "schema": { // This schema should align with IPaginationResponse
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
        "description": "Retrieves a specific job by its unique ID.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890cd" }, // Example UUID
            "required": true,
            "description": "The ID of the job to retrieve."
          }
        ],
        "responses": {
          "200": {
            "description": "Successful retrieval of job details.",
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
        "summary": "Update an existing job (Admin)",
        "description": "Updates the details of an existing job. Requires admin privileges.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890cd" }, // Example UUID
            "required": true,
            "description": "The ID of the job to update."
          }
        ],
        "requestBody": {
          "description": "Job object with updated fields.",
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
        "summary": "Delete a job  (Admin)",
        "description": "Deletes a job by its ID. Requires admin privileges.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890cd" }, // Example UUID
            "required": true,
            "description": "The ID of the job to delete."
          }
        ],
        "responses": {
          "200": {
            "description": "Job deleted successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SuccessMessageResponse"
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
    "/v1/job/{id}/close": {
      "patch": {
        "tags": ["Jobs"],
        "summary": "Close a job (Admin)",
        "description": "Marks a job as closed. Requires admin privileges.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890cd" }, // Example UUID
            "required": true,
            "description": "The ID of the job to close."
          }
        ],
        "responses": {
          "200": {
            "description": "Job closed successfully.",
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
    "/v1/bookmark/job/{jobId}": {
      "post": {
        "tags": ["Bookmarks"],
        "summary": "Bookmark a job",
        "description": "Allows an authenticated user (Applicant) to bookmark a specific job. If the job is already bookmarked by the user, it returns the existing bookmark information along with a message.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "jobId",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890ef" }, // Example UUID
            "required": true,
            "description": "The ID of the job to bookmark."
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
          "200": {
            "description": "Job was already bookmarked by the user.",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/BookmarkResponse" }
              }
            }
          },
          "401": {
            "description": "Unauthorized. User needs to be logged in.",
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
      "delete": { // Added DELETE operation to the same path for removing a bookmark
        "tags": ["Bookmarks"],
        "summary": "Remove a bookmark for a job",
        "description": "Allows an authenticated user (Applicant) to remove their bookmark for a specific job.",
        "security": [{ "BearerAuth": [] }],
        "parameters": [
          {
            "in": "path",
            "name": "jobId",
            "schema": { "type": "string", "format": "uuid", "example": "a1b2c3d4-e5f6-7890-1234-567890ef" }, // Example UUID
            "required": true,
            "description": "The ID of the job to remove bookmark."
          }
        ],
        "responses": {
          "200": {
            "description": "Bookmark removed successfully.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "example": true },
                    "data": { "type": "object", "example": {}, "description": "Empty object indicates success." }
                  }
                }
              }
            }
          },
          "401": { "description": "Unauthorized. User needs to be logged in.", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } },
          "404": { "description": "Bookmark not found (or job not found, though controller checks bookmark directly).", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/v1/bookmark/user": { // Path changed to match bookmarkRoute.ts
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
    }
  }
}

export default swaggerDocument;