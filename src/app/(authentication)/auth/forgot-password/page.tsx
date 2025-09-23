import AuthContauiner from '../components/AuthContainer';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { AuthContainerHeader } from '../components/AuthContainerHeader';

export default function ForgotPasswordPage() {

    return (
        <AuthContauiner>
            <AuthContainerHeader
                heading='Forgot your password?'
                subHeading={`Enter your email address and we' ll send you a link to reset your password.`}
            />
            <ForgotPasswordForm />
        </AuthContauiner>
    );
}