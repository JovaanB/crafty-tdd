import { Message } from "../message";

export const messageBuilder = ({
  id = "fake-id",
  text = "fake-text",
  author = "fake-author",
  publishedAt = new Date("2023-01-19T19:00:00.000Z"),
}: {
  id?: string;
  text?: string;
  author?: string;
  publishedAt?: Date;
} = {}) => {
  const props = {
    id,
    text,
    author,
    publishedAt,
  };

  return {
    withId(_id: string) {
      return messageBuilder({ ...props, id: _id });
    },
    withText(_text: string) {
      return messageBuilder({ ...props, text: _text });
    },
    authoredBy(_author: string) {
      return messageBuilder({ ...props, author: _author });
    },
    withPublishedAt(_publishedAt: Date) {
      return messageBuilder({ ...props, publishedAt: _publishedAt });
    },
    build(): Message {
      return {
        id: props.id,
        text: props.text,
        author: props.author,
        publishedAt: props.publishedAt,
      };
    },
  };
};
