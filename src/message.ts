export class MessageTooLongError extends Error {}

export class EmptyMessageError extends Error {}

export type Message = {
  id: string;
  text: MessageText;
  author: string;
  publishedAt: Date;
};

export class MessageText {
  private constructor(readonly value: string) {}

  static of(value: string) {
    if (value.trim().length === 0) {
      throw new EmptyMessageError();
    }

    if (value.length > 280) {
      throw new MessageTooLongError();
    }

    return new MessageText(value);
  }
}
