import type { Application } from "../declarations";
import messages from "./messages/messages.service";
import progress from './progress/progress.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(messages);
  app.configure(progress);
}
