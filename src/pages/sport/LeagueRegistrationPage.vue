<template>
  <data-table title="All League Request List" :headers="headers" :show-action="false" :show-search="false" :show-add-btn="false">
    <template #filters>
      <select v-model="filters.leagueId" @change="fetchData()"
        class="bg-white text-gray-900 p-4 py-2 rounded-xl border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option :value="undefined">All League</option>
        <option v-for="league in leagueList" :key="league._id" :value="league._id">
          {{ league.name }}
        </option>
      </select>
    </template>
    
    <template #default="{ item }">
      <td class="my-td-1st"><user-with-email class="!justify-start" :user="item.athlete"></user-with-email></td>
      <td class="my-td">{{ item.league?.name || 'N/A' }}</td>
      <td class="my-td">{{ item.preferredPosition || 'N/A' }}</td>
      <td class="my-td">{{ `${item.jerseyNumber} or ${item.additionalJerseyNumber}` }}</td>
      <td class="my-td">
        <div>
          <h5>{{ item.participantEmergencyContact?.phone }}</h5>
          <h6>{{ item.participantEmergencyContact?.name }} (<span class="text-sm text-gray-300">{{ item.participantEmergencyContact?.relationship }}</span>)</h6>
        </div>
      </td>
      <td class="my-td">{{ `${item.preferredFriendsToPlayWith}` }}</td>
    </template>

    <template #modal>
      <!-- Name -->
      <div class="p-1 my-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name">
      </div>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import UserWithEmail from '@/components/UserWithEmail.vue';

export default {
  name: "LeagueRegistrationPage",
  components: { DataTable, UserWithEmail },
  data() {
    return {
      headers: ["Athlete", "League", "Position", "Jersey No", "Emergency Contact", "Preferred Friends"],
      leagueList: [],
    };
  },
  mounted() {
    this.httpReq({
      customUrl: 'league/all',
      method: 'get',
      callback: data => this.leagueList = data
    });
  },
};
</script>