// Auth Hooks
export {
  useLogin,
  useRegister,
  useLogout,
  useProfile,
  useUpdateProfile,
  useVerifyEmail,
  useResendVerifyEmail,
  useForgetPassword,
  useResetPassword,
  useChangePassword,
  useRefreshToken,
} from './use-auth';

// Subject Hooks (Public + Admin)
export {
  useSubjects,
  useActiveSubjects,
  useSubject,
  useAdminSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from './use-subjects';

// Grade Hooks (Public + Admin)
export {
  useGrades,
  useActiveGrades,
  useGrade,
  useAdminGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
} from './use-grades';

// School Type Hooks (Public + Admin)
export {
  useSchoolTypes,
  useActiveSchoolTypes,
  useSchoolType,
  useAdminSchoolTypes,
  useCreateSchoolType,
  useUpdateSchoolType,
  useDeleteSchoolType,
} from './use-school-types';

// Session Hooks
export {
  useUpcomingSessions,
  useCompletedSessions,
  useSession,
  useSessionDetails,
  useCancelSession,
  useRescheduleSession,
  useApproveReschedule,
  useRejectReschedule,
  useProposeSession,
  useAcceptSessionProposal,
  useRejectSessionProposal,
  useTrialSession,
  // Admin
  useAdminSessions,
  useSessionStats,
  useUnifiedSessions,
  SESSION_STATUS,
  PAYMENT_STATUS,
} from './use-sessions';

// Student Hooks
export {
  useStudents,
  useStudent,
  useBlockStudent,
  useUnblockStudent,
  useAdminUpdateStudentProfile,
} from './use-students';

// Tutor Hooks
export {
  useTutors,
  useTutor,
  useTutorStatistics,
  useBlockTutor,
  useUnblockTutor,
  useUpdateTutorSubjects,
  useAdminUpdateTutorProfile,
} from './use-tutors';

// Chat Hooks
export {
  useChats,
  useCreateChat,
  useMessages,
  useSendMessage,
  useMarkChatAsRead,
} from './use-chats';

// Notification Hooks
export {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from './use-notifications';

// Application Hooks (Applicant)
export { useSubmitApplication, useMyApplication, useUpdateMyApplication } from './use-applications';

// Admin Application Hooks
export {
  useAdminApplications,
  useAdminApplication,
  useSelectForInterview,
  useApproveApplication,
  useRejectApplication,
  useSendForRevision,
  useDeleteApplication,
} from './use-admin-applications';

// Trial Request Hooks
export {
  useCreateTrialRequest,
  useTrialRequest,
  useCancelTrialRequest,
  useExtendTrialRequest,
  useAvailableTrialRequests,
  useMyAcceptedTrialRequests,
  useAcceptTrialRequest,
  useMyRequests,
  TRIAL_REQUEST_STATUS,
  SCHOOL_TYPE,
  GRADE_LEVEL,
} from './use-trial-requests';

// Interview Slot Hooks
export {
  useInterviewSlots,
  useInterviewSlot,
  useCreateInterviewSlot,
  useUpdateInterviewSlot,
  useDeleteInterviewSlot,
  useCompleteInterviewSlot,
  useCancelInterviewSlot,
  useAvailableInterviewSlots,
  useBookInterviewSlot,
  useRescheduleInterviewSlot,
  useMyBookedInterview,
  useCancelMyInterview,
  useScheduledMeetings,
  useGetInterviewMeetingToken,
  INTERVIEW_SLOT_STATUS,
} from './use-interview-slots';

// Stripe Connect Hooks
export {
  useCreateStripeAccount,
  useGetOnboardingLink,
  useStripeOnboardingStatus,
  useStripeConnect,
} from './use-stripe';

// Subscription & Payment Method Hooks
export {
  useMySubscription,
  usePlanUsage,
  usePaymentHistory,
  useCancelSubscription,
  usePaymentMethods,
  useCreateSetupIntent,
  useAttachPaymentMethod,
  useSetDefaultPaymentMethod,
  useDeletePaymentMethod,
  PLAN_DISPLAY_NAMES,
  PLAN_DETAILS,
  CARD_BRAND_ICONS,
} from './use-subscription';

// Session Request Hooks
export {
  useCreateSessionRequest,
  useCancelSessionRequest,
  useExtendSessionRequest,
  useMySessionRequests,
  useMatchingSessionRequests,
  useAcceptSessionRequest,
  useSessionRequest,
  useAllSessionRequests,
  SESSION_REQUEST_STATUS,
} from './use-session-requests';

// Admin Stats Hooks
export {
  useOverviewStats,
  useRevenueByMonth,
  useUserDistribution,
  useRecentActivity,
  useDashboardStats,
  useMonthlyRevenue,
  usePopularSubjects,
  useTopTutors,
  useTopStudents,
  useUserGrowth,
} from './use-admin-stats';

// Review Hooks
export {
  useCreateReview,
  useMyReviews,
  useUpdateReview,
  useDeleteReview,
  useTutorReviews,
  useTutorReviewStats,
  useReview,
  useToggleReviewVisibility,
  useAdminCreateReview,
  useAdminUpdateReview,
  useAdminDeleteReview,
} from './use-reviews';

// Tutor Feedback Hooks
export {
  useSubmitTutorFeedback,
  usePendingFeedbacks,
  useTutorFeedbacks,
  useFeedbackBySession,
  useReceivedFeedbacks,
  FEEDBACK_TYPE,
  FEEDBACK_STATUS,
} from './use-tutor-feedback';

// Tutor Earnings Hooks
export {
  useTutorStats,
  usePayoutSettings,
  useUpdatePayoutSettings,
  useEarningsHistory,
  LEVEL_DISPLAY_NAMES,
  LEVEL_NUMBERS,
  PAYOUT_STATUS_LABELS,
  PAYOUT_STATUS_COLORS,
} from './use-tutor-earnings';

// Types
export type { Subject, SubjectFilters, SubjectsResponse } from './use-subjects';
export type { Grade, GradeFilters, GradesResponse } from './use-grades';
export type { SchoolType, SchoolTypeFilters, SchoolTypesResponse } from './use-school-types';
export type { Session, SessionFilters, UnifiedSession, UnifiedSessionFilters } from './use-sessions';
export type { Student, StudentFilters, AdminUpdateStudentProfilePayload } from './use-students';
export type { Tutor, TutorFilters, TutorsResponse } from './use-tutors';
export type { Chat, Message } from './use-chats';
export type { Notification } from './use-notifications';
export type { SubmitApplicationData, ApplicationResponse, TutorApplication, ApplicationStatus, UpdateMyApplicationData } from './use-applications';
export type { AdminApplication, AdminApplicationStatus, ApplicationFilters, AdminApplicationsResponse } from './use-admin-applications';
export type { TrialRequest, AcceptedTutor, CreateTrialRequestData, StudentInfo, GuardianInfo } from './use-trial-requests';
export type { InterviewSlot, InterviewSlotFilters, ScheduledMeeting, ScheduledMeetingsFilters, MeetingTokenResponse } from './use-interview-slots';
export type { StripeAccount, OnboardingStatus, CreateAccountResponse } from './use-stripe';
export type {
  Subscription,
  SubscriptionTier,
  SubscriptionStatus,
  PlanUsage,
  PaymentHistoryItem,
  PaymentHistoryResponse,
  PaymentMethod,
  SetupIntentResponse,
} from './use-subscription';
export type { SessionRequest, CreateSessionRequestData } from './use-session-requests';
export type {
  OverviewStats,
  Statistic,
  GrowthType,
  RevenueByMonth,
  UserDistribution,
  RoleDistribution,
  StatusDistribution,
  ActivityLogItem,
  ActivityLogResponse,
  ActionType,
  ActivityStatus,
} from './use-admin-stats';
export type {
  SessionReview,
  CreateReviewData,
  UpdateReviewData,
  ReviewStats,
  ReviewsResponse,
  AdminCreateReviewData,
} from './use-reviews';
export type { AdminUpdateTutorProfilePayload } from './use-tutors';
export type {
  TutorSessionFeedback,
  SubmitFeedbackData,
  PendingFeedbacksResponse,
  TutorFeedbacksResponse,
} from './use-tutor-feedback';
export type {
  TutorLevel,
  PayoutStatus,
  PayoutSettings,
  TutorStats,
  EarningsHistoryItem,
  EarningsHistoryResponse,
} from './use-tutor-earnings';

// Legal Policy Hooks
export {
  useLegalPolicies,
  useLegalPolicy,
  usePublicLegalPolicy,
  usePublicLegalPolicies,
  useUpsertLegalPolicy,
  useUpdateLegalPolicy,
  useDeleteLegalPolicy,
  useInitializeLegalPolicies,
  POLICY_TYPE,
  POLICY_TYPE_LABELS,
} from './use-legal-policies';
export type { LegalPolicy, UpsertPolicyPayload } from './use-legal-policies';

// Support Ticket Hooks
export {
  useTicketCategories,
  useCreateSupportTicket,
  useMyTickets,
  useMyTicket,
  useAdminTickets,
  useAdminTicket,
  useTicketStats,
  useUpdateTicketStatus,
  useUpdateTicketPriority,
  useAssignTicket,
  useAddAdminNotes,
  TICKET_CATEGORY,
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_PRIORITY_COLORS,
} from './use-support-tickets';
export type {
  SupportTicket,
  TicketCategory,
  CreateTicketData,
  TicketFilters,
  TicketsResponse,
  TicketStats,
} from './use-support-tickets';