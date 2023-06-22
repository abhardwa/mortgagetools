import { useState, useCallback } from 'react';
import {useDispatch} from 'react-redux';

export function useThunk(thunk) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const runThink = useCallback((arg) => {
        setIsLoading(true);
        dispatch(thunk(arg))
        .unwrap()
        .catch(err=> setError(err))
        .finally(()=> setIsLoading(false))
    },[dispatch, thunk]);

    return [runThink, isLoading, error];

};

//USAGE:
// const [doFetchUsers, isLoadingUsers, loadingUsersError] = useThunk (fetchUsers);

// useEffect (() => {
//     doFetchUsers();

// }, [doFetchUsers])