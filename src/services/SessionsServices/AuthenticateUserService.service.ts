import { getRepository } from "typeorm";
import { compare } from "bcryptjs";

import User from "src/models/User";

interface Request {
  email: string;
  password: string;
}

class AuthenticateUserService {
  public async run({ email, password }: Request): Promise<User> {
    const errorMessage = "Incorrect email/password combination.";

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new Error(errorMessage);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error(errorMessage);
    }

    delete user.password;

    return user;
  }
}

export default AuthenticateUserService;
