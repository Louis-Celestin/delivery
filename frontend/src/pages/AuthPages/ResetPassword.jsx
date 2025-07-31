import ResetPasswordForm from "../../components/auth/ResetPasswordForm"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"

export default function ResetPassword() {
    return(
        <>
            <PageBreadcrumb pageTitle="Modifier mot de passe"/>
            <ResetPasswordForm />
        </>
    )
}