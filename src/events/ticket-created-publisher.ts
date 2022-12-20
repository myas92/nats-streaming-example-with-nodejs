import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from "./subjects";
import { Publisher } from "./based-publisher";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
