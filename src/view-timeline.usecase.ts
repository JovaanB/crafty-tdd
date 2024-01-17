import { MessageRepository } from "./message.repository";
import { DateProvider } from "./post-message.usecase";

const ONE_MINUTE_IN_MS = 60000;

export class ViewTimelineUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle({
    user,
  }: {
    user: string;
  }): Promise<{ author: string; text: string; publicationTime: string }[]> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);
    messagesOfUser.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    return messagesOfUser.map((msg) => ({
      author: msg.author,
      text: msg.text.value,
      publicationTime: this.publicationTime(msg.publishedAt),
    }));
  }

  private publicationTime(publishedAt: Date) {
    const now = this.dateProvider.getNow();
    const diffInMs = now.getTime() - publishedAt.getTime();
    const minutes = Math.floor(diffInMs / ONE_MINUTE_IN_MS);

    if (minutes < 1) {
      return "less than a minute ago";
    }
    if (minutes < 2) {
      return "1 minute ago";
    }

    return `${minutes} minutes ago`;
  }
}
