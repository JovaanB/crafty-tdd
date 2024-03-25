#!/usr/bin/env node
import { Command } from "commander";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/application/usecases/post-message.usecase";
import {
  FollowUserCommand,
  FollowUserUseCase,
} from "./src/application/usecases/follow-user.usecase";
import { FileSystemMessageRepository } from "./src/infra/message.fs.repository";
import { ViewTimelineUsecase } from "./src/application/usecases/view-timeline.usecase";
import { ViewWallUseCase } from "./src/application/usecases/view-wall.usecase";
import {
  EditMessageCommand,
  EditMessageUseCase,
} from "./src/application/usecases/edit-message.usecase";
import { RealDateProvider } from "./src/infra/real-date-provider";
import { FileSystemFolloweeRepository } from "./src/infra/followee.fs.repository";

const messageRepository = new FileSystemMessageRepository();
const followeeRepository = new FileSystemFolloweeRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const followUserUseCase = new FollowUserUseCase(followeeRepository);
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const viewTimelineUseCase = new ViewTimelineUsecase(
  messageRepository,
  dateProvider
);
const viewWallUseCase = new ViewWallUseCase(
  messageRepository,
  followRepository,
  dateProvider
);

const program = new Command();

program
  .version("0.0.1")
  .description("Crafty social network")
  .addCommand(
    new Command("post")
      .argument("<user>", "The current user")
      .argument("<message>", "The message to post")
      .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: Math.round(Math.random() * 10000).toString(),
          author: user,
          text: message,
        };

        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log(`✔️ Message posté par ${user}: ${message}`);
          process.exit(0);
        } catch (error) {
          console.error("❌ " + error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("edit")
      .argument("<message-id>", "The id of the message to edit")
      .argument("<message>", "The new message")
      .action(async (messageId, newText) => {
        const editMessageCommand: EditMessageCommand = {
          messageId,
          text: newText,
        };

        try {
          await editMessageUseCase.handle(editMessageCommand);
          console.log(`✔️ Message ${messageId} modifié : ${newText}`);
          process.exit(0);
        } catch (error) {
          console.error("❌ " + error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("follow")
      .argument("<user>", "The current user")
      .argument("<user-to-follow>", "The user to follow")
      .action(async (user, userToFollow) => {
        const followUserCommand: FollowUserCommand = {
          user,
          userToFollow,
        };

        try {
          await followUserUseCase.handle(followUserCommand);
          console.log(`✔️ ${user} follows ${userToFollow}`);
          process.exit(0);
        } catch (error) {
          console.error("❌ " + error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("view")
      .argument("<user>", "The user to view the timeline of")
      .action(async (user) => {
        try {
          const timeline = await viewTimelineUseCase.handle({ user });
          console.table(timeline);
          process.exit(0);
        } catch (error) {
          console.error("❌ " + error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("wall")
      .argument("<user>", "The user to view the wall of")
      .action(async (user) => {
        try {
          const wall = await viewWallUseCase.handle({ user });
          console.table(wall);
          process.exit(0);
        } catch (error) {
          console.error("❌ " + error);
          process.exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync(process.argv);
}

main();
