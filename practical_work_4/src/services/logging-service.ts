import Backendless from "backendless";
import type { User, UserToLogin, UserToRegister } from "@/schemas/user";
import { eventLog } from "@/event-log";

enum LoggerType {
  AUTH_LOGGER = "AUTH_LOGGER",
  FILESYSTEM_LOGGER = "FILESYSTEM_LOGGER",
  GEOLOCATION_LOGGER = "GEOLOCATION_LOGGER",
}

Backendless.Logging.setLogReportingPolicy(1, 1);

export class LoggingService {
  public static get AuthLogger() {
    return Backendless.Logging.getLogger(LoggerType.AUTH_LOGGER);
  }

  public static get FileSystemLogger() {
    return Backendless.Logging.getLogger(LoggerType.FILESYSTEM_LOGGER);
  }

  public static get GeolocationLogger() {
    return Backendless.Logging.getLogger(LoggerType.GEOLOCATION_LOGGER);
  }
}
