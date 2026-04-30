/** Mongo's all-zero GUID. Used as a sentinel for "no value" in places where the
 *  backend expects a Guid but the frontend doesn't have one yet (notifications
 *  with no reference, etc.). */
export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

/** Display name shown in the sidebar header. */
export const APP_NAME = 'OmborPro';

/** localStorage key holding the JWT session payload. */
export const SESSION_STORAGE_KEY = 'ombor_session';

/**
 * Default organization id used when the user signs up without one. The backend
 * still expects a valid GUID, so we send this placeholder. If you're seeing
 * test/dev data leak across tenants, this is why — make it explicit instead.
 *
 * TODO(product): replace with a real org-creation flow before we ship multi-tenant.
 */
export const DEFAULT_REGISTRATION_ORG_ID = '00000000-0000-0000-0000-000000000001';
