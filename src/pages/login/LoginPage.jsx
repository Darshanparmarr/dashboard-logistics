 import axios from 'axios';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/global/Container';

const LoginPage = () => {

  const [errMsg, setErrMsg] = useState("")
  const navigate = useNavigate()

  return (
    <>
        <Container className=" h-screen flex items-center justify-center">

        <Formik
          initialValues={{ username: "", password: "" }}
          validate={(values) => {
            const error = {};
            if (values.username.trim().length == 0) {
              error.username = "Please enter correct username";
            }

            if (values.password.trim().length == 0) {
              error.password = "Please enter correct username";
            }            return error;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {

              axios.post("https://dummyjson.com/auth/login", values)
                .then(response => {
                  setErrMsg("")
                  console.log(response);
                  sessionStorage.setItem("accessToken", response.data.accessToken)
                  navigate("/dashboard")
                  
                })
                .catch(err => {
                  console.log(err.response);
                  setErrMsg(err.response.data.message)
                })

            }, 400);
          }}
        >
          {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
          }) => (
            
            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4" >
              <legend className="fieldset-legend text-2xl">Login</legend>

              <label className="label">Username</label>
                    <input type="text" name='username' className="input" placeholder="Username" onChange={handleChange} onBlur={handleBlur} value={values.username} />
                    <p className="text-red-700 mb-3">{errors.username && touched.username && errors.username}</p>

              <label className="label">Password</label>
                  <input type="password" name='password' className="input" placeholder="Password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                  <p className="text-red-700 mb-3">{errors.password && touched.password && errors.password}</p>

                <p className='text-red-700'>{errMsg}</p>
                <button type="submit" disabled={isSubmitting} className="btn btn-neutral mt-4">Login</button>
              </fieldset>  
            </form>

       )
            
          }
        </Formik>
        
        </Container>
    </>
  )
}

export default LoginPage