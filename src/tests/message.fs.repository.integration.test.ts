import * as path from "path";
import * as fs from "fs";
import { FileSystemMessageRepository } from "../message.fs.repository";
import { messageBuilder } from "./mesage.builder";

const testMessagePath = path.join(__dirname, `message.test.json`);

describe("FileSystemMessageRepository", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(testMessagePath, JSON.stringify([]));
  });
  test("save() can save message in file", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);

    await messageRepository.save(
      messageBuilder()
        .withId("1")
        .authoredBy("Alice")
        .withText("Hello")
        .withPublishedAt(new Date("2024-01-17T22:11:06.000Z"))
        .build()
    );

    const data = await fs.promises.readFile(testMessagePath);
    const messages = JSON.parse(data.toString());

    expect(messages).toEqual([
      {
        id: "1",
        author: "Alice",
        text: "Hello",
        publishedAt: "2024-01-17T22:11:06.000Z",
      },
    ]);
  });

  test("save() can edit an existing message in file", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);

    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: "1",
          author: "Alice",
          text: "Hello",
          publishedAt: "2024-01-17T22:11:06.000Z",
        },
      ])
    );

    await messageRepository.save(
      messageBuilder()
        .withId("1")
        .authoredBy("Alice")
        .withText("Hello edited")
        .withPublishedAt(new Date("2024-01-17T22:11:06.000Z"))
        .build()
    );

    const data = await fs.promises.readFile(testMessagePath);
    const messages = JSON.parse(data.toString());

    expect(messages).toEqual([
      {
        id: "1",
        author: "Alice",
        text: "Hello edited",
        publishedAt: "2024-01-17T22:11:06.000Z",
      },
    ]);
  });

  test("getById() returns message by id", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);

    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: "1",
          author: "Alice",
          text: "Hello",
          publishedAt: "2024-01-17T22:11:06.000Z",
        },
        {
          id: "2",
          author: "Bob",
          text: "Hello from Bob",
          publishedAt: "2024-01-17T22:11:05.000Z",
        },
      ])
    );

    const message = await messageRepository.getById("2");

    expect(message).toEqual(
      messageBuilder()
        .withId("2")
        .authoredBy("Bob")
        .withText("Hello from Bob")
        .withPublishedAt(new Date("2024-01-17T22:11:05.000Z"))
        .build()
    );
  });

  test("getAllOfUser() returns all messages of specific user", async () => {
    const messageRepository = new FileSystemMessageRepository(testMessagePath);

    await fs.promises.writeFile(
      testMessagePath,
      JSON.stringify([
        {
          id: "1",
          author: "Alice",
          text: "Hello",
          publishedAt: "2024-01-17T22:11:06.000Z",
        },
        {
          id: "2",
          author: "Bob",
          text: "Hello from Bob",
          publishedAt: "2024-01-17T22:11:05.000Z",
        },
        {
          id: "3",
          author: "Alice",
          text: "Hello from Alice",
          publishedAt: "2024-01-17T22:11:04.000Z",
        },
      ])
    );

    const messages = await messageRepository.getAllOfUser("Alice");

    expect(messages).toHaveLength;
    expect(messages).toEqual(
      expect.arrayContaining([
        messageBuilder()
          .withId("1")
          .authoredBy("Alice")
          .withText("Hello")
          .withPublishedAt(new Date("2024-01-17T22:11:06.000Z"))
          .build(),
        messageBuilder()
          .withId("3")
          .authoredBy("Alice")
          .withText("Hello from Alice")
          .withPublishedAt(new Date("2024-01-17T22:11:04.000Z"))
          .build(),
      ])
    );
  });
});
