import { getMutationDataWithCustomHeader } from '../util/apolloApiUtil'
import { OWNER_PASSWORD_RESET_TOKEN_VERIFY, OWNER_RESET_PASSWORD_CHANGING } from '../graphql/mutations/auth'
import { API } from '../util/statusCode'

export const state = () => ({
  isAuthenticated: false,
  user: {},
  verifyToken: '',
  resetPasswordJwt: '',
  resetPassUser: null
})

export const mutations = {
  SET_USER_DATA: (state, userData) => {
    state.isAuthenticated = !!userData.jwt
    state.user = userData
    state.resetPassUser = null
  },
  SET_VERIFY_TOKEN: (state, jwt) => {
    state.verifyToken = jwt
  },
  SET_RESET_PASSWORD_JWT: (state, jwt) => {
    state.resetPasswordJwt = jwt
  },
  REMOVE_RESET_PASS_USER: (state) => {
    state.resetPassUser = null
  },
  LOGOUT_USER: (state) => {
    state.isAuthenticated = false
    state.user = {}
    state.verifyToken = ''
    state.resetPassUser = null
  }
}

export const actions = {
  requestPerformLogout: async ({ commit }) => {
    await commit('LOGOUT_USER')
  },
  requestVerifyToken: async ({ commit }, {
    $apollo,
    token
  }) => {
    const { data } = await getMutationDataWithCustomHeader($apollo, OWNER_PASSWORD_RESET_TOKEN_VERIFY, { token }, { jwt: null })
    console.log('requestVerifyToken-->', data)
    if (data.OwnerPasswordResetTokenVerify && data.OwnerPasswordResetTokenVerify.code === API.SUCCESS) {
      commit('SET_RESET_PASSWORD_JWT', data.OwnerPasswordResetTokenVerify.jwt)
      return {
        code: data.OwnerPasswordResetTokenVerify.code,
        msg: data.OwnerPasswordResetTokenVerify.msg
      }
    } else {
      return {
        code: API.ERROR,
        msg: data.OwnerPasswordResetTokenVerify ? data.OwnerPasswordResetTokenVerify.msg : 'Something went wrong, please try again.'
      }
    }
  },
  requestOwnerCreateNewPassword: async ({ commit }, {
    $apollo,
    password,
    jwt
  }) => {
    const { data } = await getMutationDataWithCustomHeader($apollo, OWNER_RESET_PASSWORD_CHANGING, { password }, { jwt })
    console.log('requestOwnerCreateNewPassword-->', data)
    if (data.OwnerResetPasswordChanging && data.OwnerResetPasswordChanging.code === API.SUCCESS) {
      return {
        code: data.OwnerResetPasswordChanging.code,
        msg: data.OwnerResetPasswordChanging.msg
      }
    } else {
      return {
        code: API.ERROR,
        msg: data.OwnerResetPasswordChanging ? data.OwnerResetPasswordChanging.msg : 'Something went wrong, please try again.'
      }
    }
  }
}

export const getters = {
  user: ({ user }) => user,
  jwt: ({ user }) => `Bearer ${user.jwt}`,
  resetPasswordJwt: ({ resetPasswordJwt }) => `Bearer ${resetPasswordJwt}`,
  isAuthenticated: ({ isAuthenticated }) => isAuthenticated
}
