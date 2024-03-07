import { ViewWallUseCase } from "../application/usecases/view-wall.usecase";
import { InMemoryFolloweeRepository } from "../infra/followee.inmemory.repository";
import { InMemoryMessageRepository } from "../infra/message.inmemory.repository";
import { StubDateProvider } from "../infra/stub-date-provider";
import { FollowingFixture, createFollowingFixture } from "./following.fixture";
import { messageBuilder } from "./mesage.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: Viewing user wall", () => {
  let messagingFixture: MessagingFixture;
  let followingFixture: FollowingFixture;
  let fixture: Fixture;

  beforeEach(() => {
    messagingFixture = createMessagingFixture();
    followingFixture = createFollowingFixture();
    fixture = createFixture({
      messageRepository: messagingFixture.messageRepository,
      followeeRepository: followingFixture.followeeRepository,
    });
  });

  describe("Rule: All the messages from the user and her followees should appear in reverse chronological order", () => {});
  test("Charlie has subscribed to Alice's timeline and view an aggregated list of all subscriptions", async () => {
    fixture.givenNowIs(new Date("2023-02-09T15:15:30.000Z"));
    messagingFixture.givenTheFollowingMessagesExist([
      messageBuilder()
        .withId("message-1")
        .authoredBy("Alice")
        .withText("I love the weather today")
        .withPublishedAt(new Date("2023-02-07T16:27:59.000Z"))
        .build(),
      messageBuilder()
        .withId("message-2")
        .authoredBy("Bob")
        .withText("Hi it's Bob")
        .withPublishedAt(new Date("2023-02-07T16:29:00.000Z"))
        .build(),
      messageBuilder()
        .withId("message-3")
        .authoredBy("Charlie")
        .withText("I'm in New York today! Anyone wants to have a coffee?")
        .withPublishedAt(new Date("2023-02-07T16:31:00.000Z"))
        .build(),
    ]);
    followingFixture.givenUserFollowees({
      user: "Charlie",
      followees: ["Alice"],
    });

    await fixture.whenUserSeesTheWallOf("Charlie");

    fixture.thenUserShouldSee([
      {
        author: "Charlie",
        text: "I'm in New York today! Anyone wants to have a coffee?",
        publicationTime: "2804 minutes ago",
      },
      {
        author: "Alice",
        text: "I love the weather today",
        publicationTime: "2807 minutes ago",
      },
    ]);
  });
});

const createFixture = ({
  messageRepository,
  followeeRepository,
}: {
  messageRepository: InMemoryMessageRepository;
  followeeRepository: InMemoryFolloweeRepository;
}) => {
  let wall: { author: string; text: string; publicationTime: string }[];
  const dateProvider = new StubDateProvider();
  const viewWallUseCase = new ViewWallUseCase(
    messageRepository,
    followeeRepository,
    dateProvider
  );

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheWallOf(user: string) {
      wall = await viewWallUseCase.handle({ user });
    },
    thenUserShouldSee(
      expectedWall: { author: string; text: string; publicationTime: string }[]
    ) {
      expect(wall).toEqual(expectedWall);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
