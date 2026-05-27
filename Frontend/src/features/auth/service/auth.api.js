import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

// REGISTER
export const register = async ({ fullname, email, password, contactNumber,isSeller }) => {
  const { data } = await authApiInstance.post("/register", {
    fullname,
    email,
    password,
    contactNumber,
    isSeller
  });

  return data;
};


export const login = async ({email,password})=>{
  const {data} = await authApiInstance.post("/login",{
    email,
    password
  })
  return data;
}

export async function getMe()
{
  const response = await authApiInstance.get("/me");
  return response.data
}