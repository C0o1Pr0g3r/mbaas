import Backendless from "backendless";
import type { User, UserToLogin, UserToRegister } from "@/schemas/user";
import { eventLog } from "@/event-log";
import type { Mail } from "@/schemas/mail";

export class MailService {
  public static async sendMail(mail: Mail) {
    const result = await Backendless.Messaging.sendEmail(
      mail.subject,
      new Backendless.Bodyparts({ textmessage: mail.body }),
      [mail.recipient],
    );
    console.log("Result:", result);
  }
}
