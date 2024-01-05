#!/usr/bin/env node
import { Command } from "commander";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/post-message.usecase";
import { InMemoryMessageRepository } from "./src/message.inmemory.repository";

class RealDateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
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
      .action((user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: "some-id",
          author: user,
          text: message,
        };

        try {
          postMessageUseCase.handle(postMessageCommand);
          console.log(`✔️ Message posté par ${user}: ${message}`);
          console.table(messageRepository.message);
          process.exit(0);
        } catch (error) {
          console.error("❌" + error);
          process.exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync(process.argv);
}

main();
