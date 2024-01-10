import { messageBuilder } from "./mesage.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: Viewing a personnal timeline", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages published on her timeline", async () => {
      const aliceMessageBuilder = messageBuilder().authoredBy("Alice");
      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder
          .withId("message-1")
          .withText("My first message")
          .withPublishedAt(new Date("2023-02-07T16:27:59.000Z"))
          .build(),
        messageBuilder()
          .withId("message-2")
          .authoredBy("Bob")
          .withText("Hi it's Bob")
          .withPublishedAt(new Date("2023-02-07T16:29:00.000Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-3")
          .withText("How are you all?")
          .withPublishedAt(new Date("2023-02-07T16:31:00.000Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-4")
          .withText("My last message")
          .withPublishedAt(new Date("2023-02-07T16:31:30.000Z"))
          .build(),
      ]);

      fixture.givenNowIs(new Date("2023-02-07T16:32:00.000Z"));

      await fixture.whenUserSeesTheTimelineOf("Alice");

      fixture.thenUserShouldSee([
        {
          author: "Alice",
          text: "My last message",
          publicationTime: "less than a minute ago",
        },
        {
          author: "Alice",
          text: "How are you all?",
          publicationTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "My first message",
          publicationTime: "4 minutes ago",
        },
      ]);
    });
  });
});
