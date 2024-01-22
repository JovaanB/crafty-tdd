import { InMemoryMessageRepository } from "../infra/message.inmemory.repository";
import {
  PostMessageUseCase,
  PostMessageCommand,
} from "../application/usecases/post-message.usecase";
import { Message } from "../domain/message";
import { StubDateProvider } from "../infra/stub-date-provider";
import { ViewTimelineUsecase } from "../application/usecases/view-timeline.usecase";
import {
  EditMessageCommand,
  EditMessageUseCase,
} from "../application/usecases/edit-message.usecase";

export const createMessagingFixture = () => {
  const messageRepository = new InMemoryMessageRepository();
  const dateProvider = new StubDateProvider();
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[];
  let thrownError: Error;

  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  const editMessageUseCase = new EditMessageUseCase(messageRepository);
  const viewTimelineUseCase = new ViewTimelineUsecase(
    messageRepository,
    dateProvider
  );

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
    async whenUserEditsAMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    async whenUserSeesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    async thenMessageShouldBe(expectedMessage: Message) {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(expectedMessage).toEqual(expectedMessage);
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
