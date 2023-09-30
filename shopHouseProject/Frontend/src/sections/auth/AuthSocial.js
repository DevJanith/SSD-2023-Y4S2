// material
import { Button, Divider, Stack, Typography } from '@mui/material';
// component
import Iconify from '../../components/Iconify';

import { GoogleLogin } from '@react-oauth/google';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  return (
    <>
      {/* <Stack direction="row" spacing={2}> */}
        <GoogleLogin
          onSuccess={ async (credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }} 
          width={'100%'}
          size='large'
          shape='square'
        />
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
