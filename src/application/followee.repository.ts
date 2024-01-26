import { Followee } from "../domain/followee";

export interface FolloweeRepository {
  saveFollowee(followee: Followee): Promise<void>;
}
