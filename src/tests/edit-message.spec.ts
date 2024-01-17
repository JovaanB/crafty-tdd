import { EmptyMessageError, MessageTooLongError } from "../message";
import { messageBuilder } from "./mesage.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: editing a message", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: The edited text should not be superior to 280 characters", () => {
    test("Alice can edit her message to a text with less than 280 characters", async () => {
      const aliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello wrld");

      fixture.givenTheFollowingMessagesExist([aliceMessageBuilder.build()]);

      await fixture.whenUserEditsAMessage({
        messageId: "message-id",
        text: "Hello world",
      });

      await fixture.thenMessageShouldBe(
        aliceMessageBuilder.withText("Hello world").build()
      );
    });

    test("Alice cannot edit her message to a text with more than 280 characters", async () => {
      const textWithLengthOf281Characters = "a".repeat(281);

      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello world")
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsAMessage({
        messageId: "message-id",
        text: textWithLengthOf281Characters,
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test("Alice cannot edit her message to an empty text", async () => {
      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello world")
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsAMessage({
        messageId: "message-id",
        text: "",
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
