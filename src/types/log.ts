export interface SystemLog {
  id?: string;
  deviceId: string;
  deviceTitle: string;
  action: "Turned ON" | "Turned OFF";
  timestamp: string; // ISO String
  adminName: string;
  adminEmail: string;
}
