import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../store/feature/config';

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}/api/v1/verify-email`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error('Verification failed');
                }

                navigate('/'); // Redirect to home page on success
            } catch (err) {
                setError('Verification failed.');
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div>
            {loading && <p>Verifying...</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default VerifyEmail;