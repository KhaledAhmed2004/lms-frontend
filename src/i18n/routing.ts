import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // Supported locales
  locales: ['de-de', 'en-gb'],

  // Default locale (German)
  defaultLocale: 'de-de',

  // Always use locale prefix for clean canonical URLs (recommended for SEO)
  localePrefix: 'always',

  // Localized pathnames: maps internal (folder) path → per-locale slug
  pathnames: {
    // ── PUBLIC PAGES (user) ──────────────────────────────────────────────
    '/': {
      'de-de': '/',
      'en-gb': '/',
    },
    '/about': {
      'de-de': '/ueber-uns',
      'en-gb': '/about',
    },
    '/contact': {
      'de-de': '/kontakt',
      'en-gb': '/contact',
    },
    '/careers': {
      'de-de': '/karriere',
      'en-gb': '/careers',
    },
    '/privacy': {
      'de-de': '/datenschutz',
      'en-gb': '/privacy',
    },
    '/terms': {
      'de-de': '/agb-schueler',
      'en-gb': '/terms-students',
    },
    '/terms-for-tutors': {
      'de-de': '/agb-tutoren',
      'en-gb': '/terms-tutors',
    },
    '/legal-notice': {
      'de-de': '/impressum',
      'en-gb': '/legal-notice',
    },
    '/cancellation-policy': {
      'de-de': '/widerrufsbedingungen',
      'en-gb': '/cancellation-policy',
    },
    '/cookie-policy': {
      'de-de': '/cookie-richtlinie',
      'en-gb': '/cookie-policy',
    },

    // ── AUTH PAGES ───────────────────────────────────────────────────────
    '/login': {
      'de-de': '/anmelden',
      'en-gb': '/login',
    },
    '/register': {
      'de-de': '/registrieren',
      'en-gb': '/register',
    },
    '/otp': {
      'de-de': '/otp',
      'en-gb': '/otp',
    },
    '/reset': {
      'de-de': '/passwort-zuruecksetzen',
      'en-gb': '/reset-password',
    },
    '/setnewpassword': {
      'de-de': '/neues-passwort',
      'en-gb': '/set-new-password',
    },

    // ── STUDENT DASHBOARD PAGES ──────────────────────────────────────────────
    '/student/session': {
      'de-de': '/schueler/einheiten',
      'en-gb': '/student/sessions',
    },
    '/student/messages': {
      'de-de': '/schueler/nachrichten',
      'en-gb': '/student/messages',
    },
    '/student/profile': {
      'de-de': '/schueler/profil',
      'en-gb': '/student/profile',
    },
    '/student/resources': {
      'de-de': '/schueler/materialien',
      'en-gb': '/student/resources',
    },
    '/student/subscription': {
      'de-de': '/schueler/abonnement',
      'en-gb': '/student/subscription',
    },
    '/student/support': {
      'de-de': '/schueler/hilfe',
      'en-gb': '/student/support',
    },
    '/student/notification': {
      'de-de': '/schueler/benachrichtigungen',
      'en-gb': '/student/notifications',
    },

    // ── TEACHER DASHBOARD PAGES ──────────────────────────────────────────────
    '/teacher/overview': {
      'de-de': '/lehrer/einheiten',
      'en-gb': '/teacher/sessions',
    },
    '/teacher/requests': {
      'de-de': '/lehrer/anfragen',
      'en-gb': '/teacher/requests',
    },
    '/teacher/messages': {
      'de-de': '/lehrer/nachrichten',
      'en-gb': '/teacher/messages',
    },
    '/teacher/earnings': {
      'de-de': '/lehrer/einnahmen',
      'en-gb': '/teacher/earnings',
    },
    '/teacher/profile': {
      'de-de': '/lehrer/profil',
      'en-gb': '/teacher/profile',
    },
    '/teacher/resources': {
      'de-de': '/lehrer/materialien',
      'en-gb': '/teacher/resources',
    },
    '/teacher/support': {
      'de-de': '/lehrer/hilfe',
      'en-gb': '/teacher/support',
    },
    '/teacher/notification': {
      'de-de': '/lehrer/benachrichtigungen',
      'en-gb': '/teacher/notifications',
    },

    // ── FREE TRIAL PAGES ───────────────────────────────────────────────────
    '/free-trial-student': {
      'de-de': '/probestunde',
      'en-gb': '/free-trial',
    },
    '/free-trial-student-dash': {
      'de-de': '/probestunde-dashboard',
      'en-gb': '/free-trial-dashboard',
    },
    '/free-trial-teacher': {
      'de-de': '/lehrer-bewerbung',
      'en-gb': '/teacher-application',
    },
    '/free-trial-teacher-dash': {
      'de-de': '/bewerbung-dashboard',
      'en-gb': '/application-dashboard',
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
