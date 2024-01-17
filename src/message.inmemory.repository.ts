import { Message } from "./message";
import { MessageRepository } from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>();
  save(msg: Message): Promise<void> {
    this._save(msg);

    return Promise.resolve();
  }

  getById(messageId: string): Promise<Message> {
    return Promise.resolve(this.messages.get(messageId)!);
  }

  getMessageById(messageId: string) {
    return this.messages.get(messageId);
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach(this._save.bind(this));
  }

  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      Array.from(this.messages.values())
        .filter((msg) => msg.author === user)
        .map((msg) => ({
          id: msg.id,
          author: msg.author,
          text: msg.text,
          publishedAt: msg.publishedAt,
        }))
    );
  }

  private _save(msg: Message) {
    this.messages.set(msg.id, msg);
  }
}
