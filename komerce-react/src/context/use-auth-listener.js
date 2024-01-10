import React, {useContext} from 'react';
import AuthContext from './authContext';

export default function useAuthListener(){
    const authCtx = useContext(AuthContext);
    console.log(authCtx)
}