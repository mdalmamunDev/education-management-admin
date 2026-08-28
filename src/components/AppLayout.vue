<template>
  <div class="flex gap-3 p-4 h-screen w-screen app-font">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <div class="flex-1 overflow-auto hide-scrollbar">
      <!-- Header -->
      <div class="bg-g px-10 py-4 rounded-lg flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-white">Welcome, {{ auth?.name }}</h1>
          <p class="text-gray-300 mt-1">Have a nice day! Here's what's happening today.</p>
        </div>
        <div class="flex items-center space-x-6">
          <div class="relative bg-[#B2B6B6] w-14 h-14 border-[2px] flex items-center justify-center rounded-full">
            <i class="fa-regular fa-bell text-3xl cursor-pointer hover:text-white transition-colors"></i>
            <span
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
          </div>
          <div class="flex items-center space-x-2">
            <img class="w-14 h-14 rounded-full border-[2px]"
              src="https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww"
              alt="">
            <div>
              <div class="text-white font-medium">{{ auth?.name }}</div>
              <div class="text-gray-300 text-sm text-end">Admin</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="py-8">
        <router-view />
      </div>
    </div>
  </div>

</template>

<script>
import SideBar from './SideBar.vue';
import socket from '@/plugins/socket';

export default {
  name: "AppLayout",
  components: { SideBar },
  mounted() {
    const existAuth = this.$store.getters.auth;
    if (!existAuth?._id) {
      socket?.emit("user-connected", { userId: existAuth?._id });
      this.httpReq({
        customUrl: 'user/u/me',
        method: 'get',
        callback: (data) => {
          socket?.emit("user-connected", { userId: data?._id });
          this.$store.commit('setAuth', data);
        },
        errorCallback: () => {
          localStorage.removeItem('token');
          this.$router.push('/auth/login');
        }
      });
    }
  }
};
</script>
