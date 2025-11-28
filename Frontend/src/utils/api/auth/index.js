import { loginUser } from './login';
import { registerUser } from './register';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';

export const auth = {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword
};
