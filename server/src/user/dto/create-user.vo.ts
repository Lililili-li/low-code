import { User } from "../entities/user.entity";

export class CreateUserVo extends User {
  profile?: Record<string, any> | null
}
