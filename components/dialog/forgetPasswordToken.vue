<template>
  <div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card flat>
        <v-card-title class="primary white--text">
          Verify Forget Password Token
        </v-card-title>
        <ApolloMutation
          :mutation="require('@/graphql/mutations/forgetPasswordTokenVerify.graphql')"
          :variables="{ token }"
          @done="verifyForgetPasswordToken"
        >
          <template #default="{ mutate }">
            <v-form ref="form" class="pa-8">
              <label>Verify token: </label>
              <v-text-field
                v-model="token"
                class="mt-2"
                color="primary"
                placeholder="Send your token"
                prepend-inner-icon="mdi-shield-key"
                filled
                dense
                rounded
              />
              <div class="text-center">
                <v-btn class="primary white--text" small rounded @click="TokenSendRequest()">
                  submit
                </v-btn>
              </div>
              <button ref="networkCall" :disabled="isLoading" @click.prevent="mutate()" />
            </v-form>
          </template>
        </ApolloMutation>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { API } from '../../util/statusCode'

export default {
  name: 'ForgetPasswordToken',
  data () {
    return {
      dialog: false,
      token: '',
      isLoading: false
    }
  },
  created () {
    this.$nuxt.$on('toggleForgetPasswordToken', () => {
      this.dialog = !this.dialog
    })
  },
  methods: {
    ...mapActions('auth', ['requestVerifyToken']),
    createNewPasswordDialog () {
      this.$nuxt.$emit('toggleCreatePassword')
    },
    verifyForgetPasswordToken (val) {
      if (this.token !== '') {
        const { data } = val
        console.log(data)
      } else {
        alert('Request Fail')
      }
    },
    async TokenSendRequest () {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        const res = await this.requestVerifyToken({
          $apollo: this.$apollo,
          token: this.token
        })
        // this.$refs.networkCall.click()
        this.isLoading = false
        if (res.code === API.SUCCESS) {
          this.dialog = false
          this.createNewPasswordDialog()
        } else {
          this.$notifier.showMessage({
            content: res.msg,
            color: res.code
          })
        }
      } else {
        console.log('Not valid')
      }
    }
  }
}
</script>

<style scoped>

</style>
