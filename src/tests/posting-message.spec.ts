import {
  EmptyMessageError,
  Message,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";

describe("Feature: Posting a message", () => {
  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", () => {
      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsAMessage({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
      });

      thenPostedMessageShouldBe({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      });
    });

    test("Alice cannot post a message with more than 280 characters", () => {
      const textWithLengthOf281Characters = "a".repeat(281);

      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsAMessage({
        id: "message-id",
        text: textWithLengthOf281Characters,
        author: "Alice",
      });

      thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post a message with an empty text", () => {
      const emptyText = "";

      givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      whenUserPostsAMessage({
        id: "message-id",
        text: emptyText,
        author: "Alice",
      });

      thenErrorShouldBe(EmptyMessageError);
    });
  });
});

let message: Message;
let thrownError: Error;

class InMemoryMessageRepository {
  save(msg: Message) {
    message = msg;
  }
}

class StubDateProvider {
  now: Date;
  getNow() {
    return this.now;
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);

function givenNowIs(_now: Date) {
  dateProvider.now = _now;
}

function whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
  try {
    postMessageUseCase.handle(postMessageCommand);
  } catch (error) {
    thrownError = error;
  }
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}

function thenErrorShouldBe(expectedErrorClass: new () => Error) {
  expect(thrownError).toBeInstanceOf(expectedErrorClass);
}
