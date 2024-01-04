import {
  EmptyMessageError,
  Message,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  let fixture: ReturnType<typeof createFixture>;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
      });

      fixture.thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", () => {
      const textWithLengthOf281Characters = "a".repeat(281);

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithLengthOf281Characters,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post a message with an empty text", () => {
      const emptyText = "";

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: emptyText,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice cannot post a message with only spaces", () => {
      const textWithOnlySpaces = " ".repeat(10);

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithOnlySpaces,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});

class InMemoryMessageRepository {
  message: Message;
  save(msg: Message) {
    this.message = msg;
  }
}

class StubDateProvider {
  now: Date;
  getNow() {
    return this.now;
  }
}

const createFixture = () => {
  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );

  let thrownError: Error;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
      try {
        postMessageUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(messageRepository.message);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};
