// ============================================================
// Mapilio Mobile App — Shared Type Definitions
// ============================================================

// ------------------------------------------------------------
// Database
// ------------------------------------------------------------

export interface Capture {
  id: number;
  exif: string;
  location: string;
  project_key: string | null;
  organization_name: string | null;
  organization_key: string | null;
  sequence_uuid: string;
  path: string;
  hash: string | null;
  uploaded: boolean;
  filename: string;
  group_id: string | null;
  address: string | null;
  capture_id: number | null;
  default_storage_path: 'internal' | 'external' | null;
}

export interface CaptureGroup extends Capture {
  count: number;
}

export interface SequencesForUpload {
  sequences: Array<{ sequence_uuid: string }>;
  total: number;
}

// ------------------------------------------------------------
// Auth / User
// ------------------------------------------------------------

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInformation {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar: string | null;
  total_images: number;
  rank: number | null;
}

export type SocialLoginType = 'google' | 'facebook' | 'apple' | 'osm' | 'default';

export interface Credential {
  type: SocialLoginType;
  access_token?: string;
  refresh_token?: string;
}

// ------------------------------------------------------------
// Camera / GPS
// ------------------------------------------------------------

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export type StorageType = 'internal' | 'external';

// ------------------------------------------------------------
// Redux State
// ------------------------------------------------------------

export interface CameraState {
  gpsAccuracy: number | null;
  batteryLevel: number | null;
  batteryStatus: number | null;
  photoAmount: number;
  cameraLocation: GPSLocation | null;
  isOpened: boolean;
  isMocked: boolean;
  captureButtonStatus: boolean;
  rotateStatus: boolean;
  distanceBetween: number;
  lowResolution: boolean;
  accuracyLevel: string | null;
  autocaptureStart: boolean;
  startAccuracy: number | null;
  currentSequence: string | null;
  currentDB: string | null;
}

export interface AuthState {
  isLoading: boolean;
  auth: AuthToken | null;
  userInformation: UserInformation | null;
  error: string | false;
  accountType: string | null;
  credential: Credential | undefined;
}

export interface UploadState {
  progress: number;
  data: unknown[];
  activeSequence: string | null;
  switchSelector: number;
  rank: number | null;
  isUploaded: boolean;
}

export interface GeneralState {
  connectionStatus: boolean;
  language: string;
  config: Record<string, unknown> | null;
  maintenanceMode: boolean;
  currentPosition: GPSLocation | null;
  debugMode: boolean;
  mapMode: string;
  mailModalShown: boolean;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  avatar: string | null;
  total_images: number;
  rank: number;
}

export interface LeaderboardState {
  users: LeaderboardUser[];
  challengeUsers: LeaderboardUser[];
  challengeWinners: LeaderboardUser[];
  organizations: unknown[];
  usersMonth: LeaderboardUser[];
  usersWeek: LeaderboardUser[];
}

export interface SearchState {
  history: string[];
  locations: unknown[];
  error: string | null;
  loading: boolean;
}

export interface RootState {
  cameraReducer: CameraState;
  getTokenReducer: AuthState;
  uploadReducer: UploadState;
  generalReducer: GeneralState;
  leaderboardReducer: LeaderboardState;
  searchReducer: SearchState;
  imagesReducer: unknown;
  settingsReducer: unknown;
  marketplaceReducer: unknown;
  tooltipReducer: unknown;
}

// ------------------------------------------------------------
// Navigation
// ------------------------------------------------------------

export type RootStackParamList = {
  StackNavigator: undefined;
  TabNavigator: undefined;
  ProfileNavigator: undefined;
  CameraNavigator: undefined;
  CameraTab: undefined;
  UploadTab: undefined;
  Auth: undefined;
  Profile: undefined;
  Sequences: undefined;
  SequenceDetail: { sequenceId: string };
  feedDetail: { sequenceId: string };
  Upload: undefined;
  UploadCompleted: undefined;
  Camera: undefined;
  CameraSettings: undefined;
  GeneralSettings: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Marketplace: undefined;
  MarketplaceDetail: { item: unknown };
  MarketplaceReceived: undefined;
  MarketplaceReady: undefined;
  MarketplaceSoon: undefined;
  Home: undefined;
  CaptureWalkthrough: undefined;
  WelcomeWalkthrough: undefined;
  NoInternetAccess: undefined;
  Map: undefined;
  NonUserTab: undefined;
  ProfileSequence: undefined;
  WebviewScreen: { uri: string; title?: string };
  ProfileSettings: undefined;
  profileEdit: undefined;
  Leaders: undefined;
  Language: undefined;
  HowToScore: undefined;
  CaptureCompleted: { groupId: string; count: number };
  Award: { award: unknown };
  DeleteAccount: undefined;
  StackUserFeed: undefined;
  StackUserFeedDetail: { item: unknown };
};

// ------------------------------------------------------------
// API
// ------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}
