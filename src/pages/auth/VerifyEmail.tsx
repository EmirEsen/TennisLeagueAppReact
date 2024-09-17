import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchVerifyAccount } from '../../store/feature/authSlice';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        if (token) {
            dispatch(fetchVerifyAccount(token))
                .unwrap() // unwrap to handle success/failure without thunk action wrappers
                .then(() => {
                    toast.success(<>
                        Account verified successfully!<br />
                        You can sign-in!
                    </>, {
                        duration: 5000,
                        icon: '🎉'
                    });
                    setLoading(false);
                    navigate('/'); // redirect to home page
                })
                .catch((err: any) => {
                    toast.error('Account verification failed. Please try again.');
                    setError(err?.message || 'Verification failed');
                    setLoading(false);
                });
        } else {
            setError('Invalid verification token.');
            setLoading(false);
        }
    }, [location.search, navigate, dispatch]);

    return (
        <div>
            {loading ? (
                <p>Verifying your account...</p>
            ) : error ? (
                <p>{error}</p>
            ) : null}
        </div>
    );
};

export default VerifyEmail;