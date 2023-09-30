// material
import { Button, Divider, Typography } from '@mui/material';
// component

import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../../pages/Project/UserManagement/Session';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  let navigate = useNavigate()

  const [responseData, setResponseData] = useState(null);
  const [successData, setSuccessData] = useState()
  const [errorData, setErrorData] = useState()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)

  const signInWithGoogle = async (codeResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/shop-house/user/sign-in', {
        type: 'google',
        code: codeResponse.code
      });

      authenticate(response.data)
      setSuccessData(response.data)
      setIsPending(false)
      setIsSuccess(true)

      // Assuming the response contains JSON data
      setResponseData(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      console.log(codeResponse)
      // call sign in API
      signInWithGoogle(codeResponse)
    },
    onError: err => console.log(err),
    flow: 'auth-code',
  });

  useEffect(() => {
    console.log("test-auth", responseData);
  }, [responseData])

  useEffect(() => {
    // if (isSuccess == true || isError == true) {
    //   console.log("form sent to initial state");
    // }
    if (isSuccess) {
      navigate('/dashboard/app', { replace: true });
    }
  }, [isSuccess, isError])

  return (
    <>
      {/* <Stack direction="row" spacing={2}> */}
      {/* <GoogleLogin
        onSuccess={async (credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        width={'100%'}
        size='large'
        shape='square'
      /> */}

      <Button color='primary' variant='contained' onClick={() => login()}>
        Sign in with Google 🚀{' '}
      </Button >
      {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button> */}
      {/* 
        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
        </Button> */}
      {/* </Stack> */}

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
