import { Router } from "express";
import multer from "multer";
import uploadConfig from "src/config/upload";
import CreateUserService from "src/services/UsersServices/CreateUser.service";
import UpdateUserAvatarService from "src/services/UsersServices/UpdateUserAvatar.service";
import ensureAuthenticated from "src/middlewares/ensureAuthenticated";

// Rota: Receber requisição, chamar outro arquivo, devolver uma resposta
const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.run({ name, email, password });

  return response.status(201).json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.run({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
);

export default usersRouter;
