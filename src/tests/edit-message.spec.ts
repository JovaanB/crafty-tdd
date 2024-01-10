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

      fixture.thenMessageShouldBe(
        aliceMessageBuilder.withText("Hello world").build()
      );
    });
  });
});
