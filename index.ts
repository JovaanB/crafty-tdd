#!/usr/bin/env node
import { Command } from "commander";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/post-message.usecase";
import { FileSystemMessageRepository } from "./src/message.fs.repository";
import { ViewTimelineUsecase } from "./src/view-timeline.usecase";
import { EditMessageCommand, EditMessageUseCase } from "./src/edit-message.usecase";

class RealDateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const viewTimelineUseCase = new ViewTimelineUsecase(
  messageRepository,
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
  );

async function main() {
  await program.parseAsync(process.argv);
}

main();
