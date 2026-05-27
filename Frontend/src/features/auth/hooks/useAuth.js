import { setUser, setLoading, setError } from "../state/auth.slice"
import { register,login,getMe} from "../service/auth.api"
import { useDispatch } from "react-redux"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({
        fullname,
        email,
        password,
        contactNumber,
        isSeller = false
    }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))         

            const data = await register({
                fullname,
                email,
                password,
                contactNumber,
                isSeller
            })

            if (data?.user) {
                dispatch(setUser(data.user))
             
            }
        } catch (error) {
            dispatch(setError(error?.message ?? "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

   async function handleLogin({ email, password }) {
  try {

    dispatch(setLoading(true));
    dispatch(setError(null));

    const data = await login({
      email,
      password,
    });

    if (data?.user) {
      dispatch(setUser(data.user));
    }

    return data; 

  } catch (error) {

    dispatch(setError(error?.message ?? "Login failed"));

  } finally {

    dispatch(setLoading(false));

  }
}

   async function handleGetMe() {
  try {

    dispatch(setLoading(true));

    const data = await getMe();
 
    if (data?.user) {
      dispatch(setUser(data.user));
    }

  } catch (error) {

    dispatch(setError(error?.message || "Failed to get user"));

  } finally {

    dispatch(setLoading(false));

  }
}

return {
  handleRegister,
  handleLogin,
  handleGetMe,
};
}