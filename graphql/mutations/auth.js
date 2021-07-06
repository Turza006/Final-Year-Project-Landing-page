import gql from 'graphql-tag'

export const OWNER_PASSWORD_RESET_TOKEN_VERIFY = gql`
    mutation OwnerPasswordResetTokenVerify ($token: String) {
        OwnerPasswordResetTokenVerify (token: $token) {
            msg
            code
            jwt
        }
    }`

export const OWNER_RESET_PASSWORD_CHANGING = gql`
    mutation OwnerResetPasswordChanging ($password: String){
        OwnerResetPasswordChanging (password: $password){
            msg
            code
            jwt
        }
    }`
