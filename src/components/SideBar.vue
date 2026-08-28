<template>
  <div class="w-[260px] max-h-full overflow-auto hide-scrollbar bg-g rounded-md flex flex-col">
    <!-- Logo -->
    <div class="p-10 border-b border-[#BDBDBD]">
      <img src="/logo.svg" alt="">
    </div>


    <!-- Navigation -->
    <nav class="px-4 py-6 pt-10 space-y-2">
      <template v-for="(item, index) in sidebarItems" :key="index">
        <!-- If item has children -->
        <div v-if="item.children" class="space-y-1">
          <!-- Parent Item -->
          <div class="sidebar-item rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer"
            @click="toggleMenu(index)">
            <div class="flex items-center space-x-3">
              <img :src="`/icons/side-bar/${item.icon}.svg`" alt="">
              <span class="text-white">{{ item.label }}</span>
            </div>
            <span class="text-gray-400 text-xs">
              <i :class="openIndex === index ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </span>
          </div>

          <!-- Children Items -->
          <div v-show="openIndex === index" class="pl-10 space-y-2 transition-all duration-200">
            <router-link v-for="(child, cIndex) in item.children" :key="cIndex" :to="child.path"
              class="sidebar-item rounded-lg px-3 py-2 flex items-center space-x-3 cursor-pointer text-sm"
              :class="$route.path === child.path ? 'btn-g' : ''">
              <img :src="`/icons/side-bar/${child.icon}.svg`" alt="">
              <span class="text-gray-300">{{ child.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- If item has no children -->
        <router-link v-else :to="item.path"
          class="sidebar-item rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer"
          :class="$route.path.includes(item.path) ? 'btn-g' : ''">
          <img :src="`/icons/side-bar/${item.icon}.svg`" alt="">
          <span class="text-white">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>
    <!-- Logout -->
    <div class="p-4 mt-10">
      <div @click="showAlert"
        class="bg-gray-900 rounded-lg px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-700 transition-colors">
        <img src="/icons/side-bar/log-out.svg" />
        <span class="text-red-300">Log Out</span>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'SideBar',
  data() {
    return {
      openIndex: null, // Track which menu is open
      sidebarItems: [
        { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
        { label: "Athlete", path: "/athlete", icon: "athlete" },
        { label: "Coach", path: "/coach", icon: "coach" },
        { label: "Parent", path: "/parent", icon: "coach" },
        { label: "Skill List", path: "/skill", icon: "assignment-list" },
        { label: "Assignment List", path: "/assignment", icon: "assignment-list" },
        { label: "Private Lesson", path: "/lesson", icon: "session-management" },
        {
          label: "Sports", icon: "league", children: [
            { label: "Sport List", path: "/sport", icon: "league" },
            { label: "Manage Teams", path: "/sport/team", icon: "manage-teams" },
            { label: "League List", path: "/sport/league", icon: "league" },
            { label: "League Reg", path: "/sport/league-registration", icon: "league" },
            { label: "Matches", path: "/sport/matches", icon: "schedules" },
            // { label: "Scores & Details", path: "/sport/scores-details", icon: "scores" },
            // { label: "Statistics", path: "/sport/statistics", icon: "statistics" },
            // { label: "Standings", path: "/sport/standings", icon: "standings" },
            // { label: "Permissions & Chats", path: "/sport/permissions-chats", icon: "permissions" },
            // { label: "Announcements", path: "/sport/announcements", icon: "announcements" },
            // { label: "Reports & Exporting", path: "/sport/reports-exporting", icon: "reports" },
          ]
        },
        {
          label: "After School P.", icon: "after-school-program", children: [
            { label: "School", path: "/after-school-program/schools", icon: "after-school-program" },
            { label: "Student", path: "/after-school-program/student", icon: "after-school-program" },
            { label: "Routes", path: "/after-school-program/routes", icon: "after-school-program" },
            { label: "Assign School", path: "/after-school-program/route-school", icon: "after-school-program" },
          ]
        },
        {
          label: "Settings", icon: "settings", children: [
            { label: "Profile", path: "/profile", icon: "profile" },
            { label: "Change Password", path: "/change-password", icon: "change-password" },
            { label: "Privacy Policy", path: "/privacy-policy", icon: "privacy-policy" },
            { label: "Terms & Conditions", path: "/terms-conditions", icon: "terms-conditions" },
            { label: "About Us", path: "/about-us", icon: "about-us" },
          ]
        },
      ],
    };
  },
  methods: {
    toggleMenu(index) {
      this.openIndex = this.openIndex === index ? null : index;
    },
    showAlert() {
      Swal.fire({
        title: 'Do you want to Logout?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Logout',
      }).then((result) => {
        if (!result.isConfirmed) {
          localStorage.removeItem('token');
          this.$store.commit('setAuth', null);
          this.$router.push('/auth/login');
        }
      });
    }
  },
}
</script>

<style scoped>
.sidebar-item {
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #0175F2;
}
</style>