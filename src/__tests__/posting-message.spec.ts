import { DateProvider, MessageRepository } from "./../post-message.usecase";
import {
  Message,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostMessage({
        id: "message-id",
        text: "Hello World",
        author: "Alice",
      });

      thenMessageShouldBe({
        id: "message-id",
        text: "Hello World",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });
  });
});

let message: Message;

class InMemoryMessageRepository implements MessageRepository {
  save(msg: Message): void {
    message = msg;
  }
}

class StubDateProvider implements DateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);

const givenNowIs = (_now: Date) => {
  dateProvider.now = _now;
};

const whenUserPostMessage = (postMessageCommand: PostMessageCommand) => {
  postMessageUseCase.handle(postMessageCommand);
};

const thenMessageShouldBe = (expectedMessage: Message) => {
  expect(expectedMessage).toEqual(message);
};
