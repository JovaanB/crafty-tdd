import { FollowingFixture, createFollowingFixture } from "./following.fixture";

describe("Feature: Following a user", () => {
  let fixture: FollowingFixture;

  beforeEach(() => {
    fixture = createFollowingFixture();
  });

  test("Alice can follow Bob", async () => {
    fixture.givenUserFollowees({
      user: "Alice",
      followees: ["Charlie"],
    });

    await fixture.whenUserFollows({
      user: "Alice",
      userToFollow: "Bob",
    });

    await fixture.thenUserFolloweesShouldBe({
      user: "Alice",
      followees: ["Charlie", "Bob"],
    });
  });
});
