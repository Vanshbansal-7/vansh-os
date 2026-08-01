# Part 1 — Database Design & Core Schema

# 08_DATABASE_SCHEMA.md
# Part 1 — Database Design & Core Schema

Version: 1.0

Status: LOCKED

Priority: Critical

---

# Database Philosophy

The database is the single source of truth for Vansh OS.

Rules

• Every piece of information has exactly one owner.
• No duplicate data.
• Relationships over repetition.
• UUID as primary key.
• Automatic timestamps.
• Soft delete where appropriate.
• Optimized for long-term scalability.

---

# Core Entities

Authentication

↓

User

↓

Mission

↓

Career

↓

Learning

↓

Life

↓

Shared Services

---

# USERS

Stores

User ID

Name

Email

Profile Image

Timezone

Theme

Created At

Updated At

---

# DAILY MISSIONS

Stores

Mission ID

User ID

Title

Description

Date

Status

Completion %

Priority

Estimated Duration

Created At

Updated At

---

# STUDY SESSIONS

Stores

Session ID

Mission ID

Module

Title

Description

Start Time

End Time

Priority

Status

Notes

Progress

Estimated Duration

Completion Time

---

# CAREER TABLES

Companies

Applications

Interviews

Resume Versions

Projects

GitHub

LinkedIn

Certificates

Career Notes

Career Goals

---

# LEARNING TABLES

Subjects

Topics

DSA Questions

Practice Sessions

Roadmaps

Resources

Notes

Revision Queue

Learning Goals

Mock Tests

---

# LIFE TABLES

Weight History

Food Log

Water Log

Habit Log

Football Sessions

Journal Entries

Health Goals

Mood Log

---

# DOCUMENTS

Stores

Resume

Certificates

Marksheets

Identity Documents

Project PDFs

Images

Notes

Folders

Tags

---

# UNIVERSAL NOTES

Supports

Markdown

Images

Files

Tables

Links

Tags

Pinned

Archive

Version History

---

# DEADLINES

Stores

Title

Module

Priority

Due Date

Reminder

Status

Reference ID

---

# NOTIFICATIONS

Stores

Notification Type

Priority

Title

Message

Read

Created Time

Source Module

---

# SETTINGS

Theme

Language

Notification Preferences

Privacy

Accessibility

AI Preferences

Sync Preferences

---

# RELATIONSHIPS

User

↓

Mission

↓

Sessions

↓

Progress

Career

↓

Applications

↓

Companies

↓

Resume Versions

Learning

↓

Subjects

↓

Topics

↓

Questions

Life

↓

Habits

↓

Logs

↓

Analytics

---

# COMMON FIELDS

Every table contains

id

user_id

created_at

updated_at

deleted_at (when applicable)

---

# INDEXING

Index

Email

Mission Date

Deadline Date

Session Date

Company Name

Topic Name

Document Name

Search Keywords

---

# SEARCHABLE TABLES

Projects

Companies

Notes

Topics

Questions

Resources

Documents

Sessions

Deadlines

Everything searchable.

---

# DATABASE PRINCIPLES

Never duplicate user information.

Never duplicate company information.

Never duplicate resources.

Reference instead of copying.

---

# STORAGE

Profile Images

Resume PDFs

Certificates

Screenshots

Documents

Project Images

Exports

Stored securely using cloud storage.

---

End of Part 1.

# Part 2 — Relationships, Security, Storage & Future Architecture


# 08_DATABASE_SCHEMA.md
# Part 2 — Relationships, Security, Storage & Future Architecture

Version: 1.0

Status: LOCKED

Priority: Critical

---

# RELATIONSHIP RULES

Every entity has exactly one owner.

Relationships should always use Foreign Keys.

No duplicated ownership.

Examples

User
│
├── Missions
├── Career
├── Learning
├── Life
├── Documents
├── Notifications
└── Settings

---

# CASCADE RULES

Deleting a user

↓

Delete

Profile

Settings

Notifications

Sessions

Logs

Private Documents

Archive instead of permanent deletion where possible.

---

# DATA OWNERSHIP

Mission Engine

Owns

Mission

Sessions

Timeline

Daily Progress

Career Engine

Owns

Companies

Applications

Interviews

Resume Versions

Projects

Learning Engine

Owns

Subjects

Topics

Questions

Roadmaps

Resources

Revision Queue

Life Engine

Owns

Health

Calories

Weight

Habits

Journal

Football

System Engine

Owns

Settings

Theme

Devices

Sync

Backups

---

# ANALYTICS LAYER

Analytics never owns data.

It reads from

Career

Learning

Life

Mission

Generates

Daily

Weekly

Monthly

Yearly Reports

---

# SEARCH ARCHITECTURE

Universal Search Index

Indexes

Projects

Companies

Subjects

Topics

Notes

Documents

Deadlines

Sessions

Resources

Certificates

Resume Versions

Everything searchable.

---

# FILE STORAGE

Folders

/profile

/resumes

/certificates

/projects

/documents

/images

/exports

/backups

Every user has isolated storage.

---

# ACCESS CONTROL

Users can access

Only their own data.

No cross-user visibility.

Row Level Security enabled.

---

# BACKUP STRATEGY

Automatic Daily Backup

Weekly Snapshot

Monthly Snapshot

Manual Backup

Restore Point Support

---

# SYNCHRONIZATION

Laptop

↓

Cloud

↓

Phone

Phone

↓

Cloud

↓

Laptop

Realtime whenever possible.

Offline queue when unavailable.

Automatic conflict resolution.

---

# DATABASE EVENTS

Mission Completed

↓

Progress Updated

↓

Analytics Updated

↓

Dashboard Refreshed

↓

Achievements Updated

---

Application Submitted

↓

Career Analytics Updated

↓

Reminder Scheduled

↓

Dashboard Updated

---

Weight Logged

↓

Health Analytics Updated

↓

Dashboard Widget Updated

---

# PERFORMANCE

Indexes on

Email

Dates

Company

Topics

Documents

Deadlines

User ID

Search Keywords

Target Query Time

<100ms

---

# SECURITY

Encrypted Connections

HTTPS Only

JWT Authentication

Row Level Security

Secure Storage

Audit Logs

Rate Limiting

Input Validation

Output Sanitization

Environment Variables

No secrets in frontend.

---

# DATABASE MIGRATIONS

Every schema update

↓

Migration File

↓

Version Control

↓

Rollback Support

↓

Deployment

Never modify production manually.

---

# FUTURE READY TABLES

AI Memory

User Patterns

Recommendations

Achievements

Gamification

Finance

Reading

Languages

Marketplace

Plugins

Reserved for Version 2+

---

# AUDIT LOGS

Track

Login

Logout

Sync

Export

Import

Delete

Restore

Critical Changes

---

# ERROR RECOVERY

Failed Sync

↓

Retry Queue

↓

Conflict Resolution

↓

User Notification

↓

Successful Merge

No silent failures.

---

# DATA RETENTION

Soft Delete

30 Days Recovery

Permanent Delete

On User Confirmation

Backups excluded from accidental deletion.

---

# DATABASE QUALITY CHECKLIST

✓ No Duplicate Data

✓ Indexed Queries

✓ Foreign Keys

✓ Secure Access

✓ Automatic Timestamps

✓ Optimized Search

✓ Backup Enabled

✓ Cloud Sync

✓ Migration Ready

✓ Scalable

✓ Production Ready

---

# FINAL DATABASE PRINCIPLE

The database should never become the bottleneck.

It should remain clean, predictable, secure, and scalable for years of growth.

Every future feature must integrate into this architecture without requiring structural redesign.

End of 08_DATABASE_SCHEMA.md