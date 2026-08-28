<template>
  <div class="text-center mb-8">
    <h2 class="text-3xl font-semibold mb-4">Sign in to Account!</h2>
    <p class="text-gray-300 text-xl">Please enter your email and password to continue.</p>
  </div>

  <form @submit.prevent="handleSubmit">
    <!-- Email Field -->
    <div class="mb-5">
      <label for="email" class="my-label">Email</label>
      <input type="email" id="email" v-model="formData.email" class="my-input" placeholder="Enter your email" />
    </div>

    <!-- Password Field -->
    <password-comp v-model="formData.password" class="mb-3" />
    <!-- Remember Password & Forgot Password -->
    <div class="flex items-center justify-between">
      <label class="flex items-center">
        <input type="checkbox" checked
          class="w-4 h-4 text-teal-500 bg-gray-800 border-gray-600 rounded focus:ring-teal-500 focus:ring-2">
        <span class="ml-2 text-sm text-teal-600">Remember password</span>
      </label>
      <router-link to="forgot-password" class="text-sm text-teal-600 hover:text-teal-500 underline">
        Forgot password?
      </router-link>
    </div>

    <!-- Sign In Button -->
    <action-button class="mt-10">SIGN IN</action-button>

  </form>
</template>

<script>
import ActionButton from '@/components/ActionButton.vue';
import PasswordComp from '@/components/PasswordComp.vue';

export default {
  name: "LoginPage",
  components: { PasswordComp, ActionButton },
  mounted() {
    this.$store.commit('setFormData', {email: '', password: ''})
  },
  methods: {
    handleSubmit() {
      this.httpReq({
        callback: ({ tokens }) => {
          if (!tokens?.accessToken) return;
          localStorage.setItem('token', tokens?.accessToken);
          this.$router.replace('/');
        }
      });
    },
  },
};
</script>

<style></style>
