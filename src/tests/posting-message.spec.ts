import { messageBuilder } from "./mesage.builder";
import { MessageTooLongError, EmptyMessageError } from "../domain/message";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: Posting a message", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", async () => {
      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "Hello world",
        author: "Alice",
      });

      await fixture.thenMessageShouldBe(
        messageBuilder()
          .withId("message-id")
          .withText("Hello world")
          .authoredBy("Alice")
          .withPublishedAt(new Date("2023-01-19T19:00:00.000Z"))
          .build()
      );
    });

    test("Alice cannot post a message with more than 280 characters", async () => {
      const textWithLengthOf281Characters = "a".repeat(281);

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithLengthOf281Characters,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post a message with an empty text", async () => {
      const emptyText = "";

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: emptyText,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice cannot post a message with only spaces", async () => {
      const textWithOnlySpaces = " ".repeat(10);

      fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

      await fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithOnlySpaces,
        author: "Alice",
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
