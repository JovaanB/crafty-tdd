import { InMemoryMessageRepository } from "../message.inmemory.repository";
import {
  PostMessageUseCase,
  PostMessageCommand,
} from "../post-message.usecase";
import { Message } from "../message";
import { StubDateProvider } from "../stub-date-provider";
import { ViewTimelineUsecase } from "../view-timeline.usecase";

export const createMessagingFixture = () => {
  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[];
  const viewTimelineUseCase = new ViewTimelineUsecase(
    messageRepository,
    dateProvider
  );

  let thrownError: Error;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    async whenUserEditsAMessage(message: {
      messageId: string;
      text: string;
    }) {},
    async whenUserSeesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    thenMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(
        messageRepository.getMessageById(expectedMessage.id)
      );
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
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
