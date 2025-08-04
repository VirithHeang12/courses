# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts at http://localhost:3000)
- **Build**: `npm run build`
- **Preview production build**: `npm run preview`
- **Generate static site**: `npm run generate`
- **Install dependencies**: `npm install`

## Architecture Overview

This is a Nuxt 3 application with the following key architectural components:

### Authentication & Database
- **Supabase** for authentication and file storage (videos stored in 'nuxt-courses' bucket)
- **Prisma** with PostgreSQL for database operations
- **Dual auth setup**: Legacy NextAuth schema models (Account, Session, User, VerificationToken) alongside Supabase auth
- Authentication redirects: login at `/login`, callback at `/confirm`, protected routes include `/about`

### Core Modules
- `@prisma/nuxt` - Database ORM integration
- `@nuxtjs/supabase` - Supabase client and auth
- `@nuxtjs/tailwindcss` - Utility-first CSS framework
- `@videojs-player/vue` - Video player component

### Project Structure
- **Pages**: Standard Nuxt file-based routing with authentication pages (login, password reset/update), courses, profile, and about
- **API Routes**: Server API in `/server/api/` handling:
  - Video operations (list, get by ID, upload) via Supabase storage
  - User profile retrieval via Prisma
  - Customer creation
- **Components**: Reusable video-player component with Video.js integration
- **Database**: Prisma schema with User, Account, Session, and Customer models

### Video System
- Videos stored in Supabase storage bucket 'nuxt-courses/videos/'
- Video listing API filters for video MIME types only
- Custom video player component with comprehensive controls and events
- Support for multiple video formats (MP4, WebM, OGG, HLS)

### Environment Configuration
Required environment variables:
- `SUPABASE_URL` and `SUPABASE_KEY` for Supabase integration
- `DATABASE_URL` and `DIRECT_URL` for Prisma PostgreSQL connection
- Auth secrets and OAuth provider credentials (GitHub, Google) in runtime config

### Key Integration Points
- Video player component expects video URLs from Supabase storage
- API routes use both Prisma (for user data) and Supabase (for file operations)
- Authentication flow integrates Supabase auth with custom redirect handling