import { MessageRepository } from "./message.repository";

export class ViewTimelineUsecase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async handle({
    user,
  }: {
    user: string;
  }): Promise<{ author: string; text: string; publicationTime: string }[]> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);
    messagesOfUser.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );

    return [
      {
        author: messagesOfUser[0].author,
        text: messagesOfUser[0].text,
        publicationTime: "1 minute ago",
      },
      {
        author: messagesOfUser[1].author,
        text: messagesOfUser[1].text,
        publicationTime: "4 minutes ago",
      },
    ];
  }
}
