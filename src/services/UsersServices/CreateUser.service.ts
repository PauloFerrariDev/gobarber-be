import { getRepository } from "typeorm";
import { hash } from "bcryptjs";

import User from "src/models/Users";

interface Request {
  name: string;
  email: string;
  password: string;
}

interface Response extends Omit<User, "password"> {}

class CreateUserService {
  public async run({ name, email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({ where: { email } });

    if (checkUserExists) {
      throw new Error("Email address already used");
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    const userResponse: Response = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userResponse;
  }
}

export default CreateUserService;
