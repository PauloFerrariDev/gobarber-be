import { Router } from "express";
import CreateUserService from "src/services/UsersServices/CreateUser.service";

const usersRouter = Router();

// Rota: Receber requisição, chamar outro arquivo, devolver uma resposta

usersRouter.post("/", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.run({ name, email, password });

    return response.status(201).json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default usersRouter;
