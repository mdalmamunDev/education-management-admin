<template>
  <div v-if="details.name" class="bg-1">
    <div class="p-14 w-full max-w-5xl">
      <!-- Header with profile info -->
      <div class="flex items-center space-x-4 mb-6">
        <!-- Profile Picture -->
        <!-- <img class="w-14 h-14 object-cover rounded-full" :src="showImg(null)" alt=""> -->

        <!-- Name and Address -->
        <div>
          <h2 class="text-lg font-medium mb-2">{{ details.name || "N/A" }}</h2>
          <p class="text-gray-400 text-sm">Status: <span v-html="printStatus(details.status || 'N/A')"></span></p>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Email Address -->
        <div class="w-fit">
          <h3 class="text-sm font-medium mb-2">Sport</h3>
          <div class="flex justify-center items-center gap-2 text-light">
            <img class="w-[18px]" src="/icons/side-bar/sport.svg" alt="">
            <span class="text-sm">{{ details.sport?.name }}</span>
          </div>
        </div>
        <!-- Age Group -->
        <div>
          <h3 class="text-sm font-medium mb-2">Age Group</h3>
          <div class="flex items-center space-x-2 text-light">
            <i class="fa fa-cake"></i>
            <span class="text-sm">{{details.startAge}}-{{details.endAge}}yr</span>
          </div>
        </div>
        <!-- Total Match Played -->
        <div>
          <h3 class="text-sm font-medium mb-2">Total Match Played</h3>
          <div class="flex items-center space-x-2 text-light">
            <i class="fas fa-users"></i>
            <span class="text-sm">{{ details.matches?.length || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- View Options Tabs -->
    <div class="flex bg-g">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-6 py-3 text-md font-medium transition-colors relative" :class="activeTab === tab.id
          ? 'text-white'
          : 'text-gray-400 hover:text-gray-300'">
        {{ tab.label }}
        <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
      </button>
    </div>

    <div class="bg-1 min-h-[40vh]">
      <table v-show="activeTab === 'statistics'" class="w-full text-center">
        <!-- Table Header -->
        <thead class="bg-2">
          <tr class="text-gray-300 text-sm font-medium">
            <template v-for="(item, index) in headers" :key="index">
              <th class="my-td" :class="index === 0 ? 'text-start ps-8' : ''">
                {{ item }}
              </th>
            </template>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-gray-600">
          <tr v-for="(item, index) in details?.teamAndScore" :key="index">
            <td class="my-td-1st ps-8">{{ index + 1 }}</td>
            <td class="my-td">{{ item.score }}</td>
            <td class="my-td">{{ item.teamId?.name || 'N/A' }}</td>
            <td class="my-td flex gap-2 items-center justify-center">
              <user-with-email :user="item.teamId?.coachIds?.[0]" />
              <span class="text-lg" v-if="item.teamId?.coachIds?.length > 1">
                + {{ item.teamId?.coachIds?.length - 1 }}
              </span>
            </td>
            <td class="my-td">{{ item.teamId?.athleteIds?.length || 0 }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Reels View -->
      <div v-if="activeTab === 'reels'">
        <league-media :leagueId="$route.params.id" type="video" />
      </div>

      <!-- Photos View -->
      <div v-else-if="activeTab === 'photos'">
        <league-media :leagueId="$route.params.id" type="image" />
      </div>


      <!-- Chat View -->
      <div v-else-if="activeTab === 'chat'">
        <div class="bg-gray-800 rounded-lg">
          <messages-com :url-suffix="`thread/${details?.messageThreadId}`" class="bg-1 mx-auto" />
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import UserWithEmail from '@/components/UserWithEmail.vue';
import LeagueMedia from './LeagueMedia.vue';
import MessagesCom from '@/components/MessagesCom.vue';

export default {
  name: "LeagueDetailsPage",
  components: { UserWithEmail, LeagueMedia, MessagesCom },
  data() {
    return {
      headers: ["#", "Score", "Team", "Coaches", "Athletes"],
      details: {},
      teamInfo: {},
      activeTab: 'statistics',
      tabs: [
        { id: 'statistics', label: 'Statistics' },
        { id: 'reels', label: 'Reels' },
        { id: 'photos', label: 'Photos' },
        { id: 'chat', label: 'Chat' }
      ],
      reels: [
        // Example data - replace with actual data
        // { thumbnail: '/path/to/thumbnail.jpg', title: 'Amazing Goal', likes: 234, views: 1200 }
      ],
      photos: [
        // Example data - replace with actual data
        // { url: '/path/to/photo.jpg', caption: 'Team Victory', date: '2024-01-15' }
      ],
      messages: [
        // Example data - replace with actual data
        // { sender: 'Robert Fox', text: 'Great game today!', time: '10:30 AM', isOwn: false }
      ],
      newMessage: ''
    };
  },
  methods: {
  },
  mounted() {
    this.id = this.$route.params.id;

    this.fetchData({
      urlSuffix: this.id,
      callback: (data) => {
        this.details = data;
        this.$store.commit('setDataList', { data: data.teamAndScore });

        // Load additional data for other tabs
        // this.loadReels();
        // this.loadPhotos();
        // this.loadMessages();
      }
    });
  },
};
</script>