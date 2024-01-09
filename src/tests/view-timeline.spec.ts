import { Message } from "../message";
import { StubDateProvider } from "../stub-date-provider";
import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { ViewTimelineUsecase } from "../view-timeline.usecase";

describe("Feature: Viewing a personnal timeline", () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages published on her timeline", async () => {
      fixture.givenTheFollowingMessagesExist([
        {
          id: "message-1",
          text: "My first message",
          author: "Alice",
          publishedAt: new Date("2023-02-07T16:28:00.000Z"),
        },
        {
          id: "message-2",
          text: "Hi it's Bob",
          author: "Bob",
          publishedAt: new Date("2023-02-07T16:29:00.000Z"),
        },
        {
          id: "message-3",
          text: "How are you all?",
          author: "Alice",
          publishedAt: new Date("2023-02-07T16:31:00.000Z"),
        },
        {
          id: "message-4",
          text: "My last message",
          author: "Alice",
          publishedAt: new Date("2023-02-07T16:31:30.000Z"),
        },
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

const createFixture = () => {
  let timeline: { author: string; text: string; publicationTime: string }[];
  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const viewTimelineUseCase = new ViewTimelineUsecase(
    messageRepository,
    dateProvider
  );

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    thenUserShouldSee(
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    ) {
      expect(timeline).toEqual(expectedTimeline);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
