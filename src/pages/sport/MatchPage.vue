<template>
  <data-table title="All Match’s List" :headers="headers" :action-info="false" :show-search="false"
    :def-form-data="defForm" modal-w="2xl">

    <template #filters>
      <select v-model="filters.leagueId" @change="fetchData()"
        class="bg-white text-gray-900 p-4 py-2 rounded-xl border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option :value="undefined">All Leagues</option>
        <option v-for="s in leagueList" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>

      <select v-model="filters.teamId" @change="fetchData()"
        class="bg-white text-gray-900 p-4 py-2 rounded-xl border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option :value="undefined">All Teams</option>
        <option v-for="s in teamList" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
    </template>

    <template #default="{ item }">
      <td class="my-td-1st">
        {{ item.teamA?.name || 'N/A' }}
        <i v-if="item.teamA?._id === item.winnerTeamId" class="fa-solid fa-trophy ms-2 text-green-400"></i>
      </td>
      <td class="my-td">
        {{ item.teamB?.name || 'N/A' }}
        <i v-if="item.teamB?._id === item.winnerTeamId" class="fa-solid fa-trophy ms-2 text-green-400"></i>
      </td>
      <td class="my-td">{{ item.league?.name || 'N/A' }}</td>
      <td class="my-td">{{ item.dateTime ? `${getDate(item.dateTime)} ${getTime(item.dateTime)}` : 'N/A' }}</td>
      <td class="my-td">{{ item.address || 'N/A' }}</td>
      <td class="my-td" v-html="printStatus(item.status, {
        scheduled: 'yellow',
        live: 'blue',
        completed: 'green',
        cancelled: 'red',
        postponed: 'grey',
      })"></td>
    </template>

    <template #modal>
      <!-- League -->
      <div class="p-1 mb-3">
        <label class="my-label">League</label>
        <select v-model="formData.leagueId" @change="onChangeLeague" class="my-input py-4">
          <option disabled value="">Select League</option>
          <template v-for="(item, index) in leagueList" :key="index">
            <option :value="item._id">{{ item.name }}</option>
          </template>
        </select>
      </div>

      <div class="grid grid-cols-2">
        <!-- Team A -->
        <div v-if="formData.leagueId && formData.teamIds" class="p-1 mb-3">
          <label class="my-label">Team A</label>
          <select v-model="formData.teamIds[0]" @change="onTeamAChange" class="my-input py-4">
            <option selected>Select Team</option>
            <template v-for="(item, index) in teamList" :key="index">
              <option :value="item._id">{{ item.name }}</option>
            </template>
          </select>
        </div>
        <!-- Team B -->
        <div v-if="formData.leagueId && formData.teamIds?.length > 0" class="p-1 mb-3">
          <label class="my-label">Team B</label>
          <select v-model="formData.teamIds[1]" class="my-input py-4">
            <option selected>Select Team</option>
            <template v-for="(item, index) in teamListB" :key="index">
              <option :value="item._id">{{ item.name }}</option>
            </template>
          </select>
        </div>
      </div>


      <!-- Winner Team -->
      <template v-if="formData.status === 'completed'">
        <div class="grid grid-cols-2">
          <div v-for="(teamId, index) in formData?.teamIds" :key="teamId" class="p-1 mb-3">
            <label class="my-label">Team {{ index%2 ? 'B' : 'A' }}</label>
            <input v-model="formData.teamScores[teamId]" type="number" class="my-input" placeholder="Enter Team Score">
          </div>
        </div>
        <div class="p-1 mb-3">
          <label class="my-label">Winner Team</label>
          <select v-model="formData.winnerTeamId" class="my-input py-4" required>
            <option value="">Select Team</option>
            <template v-for="(item, index) in teamList" :key="index">
              <option :value="item._id">{{ item.name }}</option>
            </template>
          </select>
        </div>
      </template>

      <!-- Address -->
      <div class="p-1 my-3">
        <label class="my-label">Address</label>
        <input v-model="formData.address" type="text" class="my-input" placeholder="Enter Address">
      </div>
      <!-- Address -->
      <div class="p-1 my-3">
        <label class="my-label">Time</label>
        <input v-model="formData.dateTime" type="datetime-local" class="my-input" placeholder="Enter Address">
      </div>

      <div class="grid grid-cols-2">
        <!-- Type -->
        <div v-if="formData._id" class="p-1 mb-3">
          <label class="my-label">Type</label>
          <select v-model="formData.type" required class="my-input py-4">
            <option value="">Select type</option>
            <option value="practice">Practice</option>
            <option value="sport">Match</option>
          </select>
        </div>
        <!-- Status -->
        <div v-if="formData._id" class="p-1 mb-3">
          <label class="my-label">Status</label>
          <select v-model="formData.status" @change="formData.winnerTeamId = ''" required class="my-input py-4">
            <option value="">Select status</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="postponed">Postponed</option>
          </select>
        </div>
      </div>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';

export default {
  name: "MatchPage",
  components: { DataTable },
  data() {
    return {
      headers: ["Team A", "Team B", "League", 'Date', 'Address', 'Status'],
      leagueList: [],
      teamList: [],
      defForm: {
        leagueId: "",
        winnerTeamId: "",
        teamIds: [],
        teamScores: {},
        type: "practice",
        status: "scheduled",
      },
    };
  },
  mounted() {
    this.httpReq({
      customUrl: 'league/all',
      method: 'get',
      callback: data => this.leagueList = data || []
    });

    // get teams
    this.httpReq({
      customUrl: `team/all`,
      method: 'get',
      callback: data => this.teamList = data || []
    })
  },
  methods: {
    onChangeLeague() {
      this.formData.teamIds = [];
      this.httpReq({
        customUrl: `team/all?leagueId=${this.formData.leagueId}`,
        method: 'get',
        callback: data => this.teamList = data?.teams
      })
    },

    onTeamAChange() {
      // Assign to second team slot
      if (this.formData.teamIds?.length > 1) this.formData.teamIds.pop();
    }
  },
  computed: {
    teamListB() {
      if (!this.formData?.teamIds[0]) return [];

      return this.teamList?.filter(
        team => team._id !== this.formData.teamIds[0]
      );
    }
  }
};
</script>