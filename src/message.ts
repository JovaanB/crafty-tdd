export class MessageTooLongError extends Error {}

export class EmptyMessageError extends Error {}

export class Message {
  constructor(
    private readonly _id: string,
    private _text: MessageText,
    private readonly _author: string,
    private readonly _publishedAt: Date
  ) {}

  get id() {
    return this._id;
  }

  get author() {
    return this._author;
  }

  get text() {
    return this._text.value;
  }

  get publishedAt() {
    return this._publishedAt;
  }

  editText(text: string) {
    this._text = MessageText.of(text);
  }

  get data() {
    return {
      id: this._id,
      author: this._author,
      text: this.text,
      publishedAt: this._publishedAt,
    };
  }

  static fromData(data: Message["data"]) {
    return new Message(
      data.id,
      MessageText.of(data.text),
      data.author,
      data.publishedAt
    );
  }
}

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
