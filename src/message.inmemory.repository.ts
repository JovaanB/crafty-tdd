import { Message } from "./post-message.usecase";

export class InMemoryMessageRepository {
  message: Message;
  save(msg: Message): Promise<void> {
    this.message = msg;
    return Promise.resolve();
  }
}
