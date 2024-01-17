import * as path from "path";
import * as fs from "fs";
import { Message, MessageText } from "./message";
import { MessageRepository } from "./message.repository";

export class FileSystemMessageRepository implements MessageRepository {
  constructor(
    private readonly messagePath = path.join(__dirname, `message.json`)
  ) {}

  async save(message: Message): Promise<void> {
    const messages = await this.getMessages();

    const messageIndex = messages.findIndex((msg) => msg.id === message.id);
    if (messageIndex !== -1) {
      messages[messageIndex] = message;
    } else {
      messages.push(message);
    }

    return fs.promises.writeFile(
      this.messagePath,
      JSON.stringify(
        messages.map((m) => ({
          id: m.id,
          author: m.author,
          publishedAt: m.publishedAt,
          text: m.text.value,
        }))
      )
    );
  }

  private async getMessages(): Promise<Message[]> {
    const data = await fs.promises.readFile(this.messagePath, "utf-8");
    const messages = JSON.parse(data.toString()) as {
      id: string;
      text: string;
      author: string;
      publishedAt: string;
    }[];

    return messages.map((msg) => ({
      id: msg.id,
      text: MessageText.of(msg.text),
      author: msg.author,
      publishedAt: new Date(msg.publishedAt),
    }));
  }

  async getAllOfUser(user: string): Promise<Message[]> {
    const messages = await this.getMessages();

    return messages.filter((msg) => msg.author === user);
  }

  async getById(id: string): Promise<Message> {
    const messages = await this.getMessages();

    return messages.filter((msg) => msg.id === id)[0];
  }
}
