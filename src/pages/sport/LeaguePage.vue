<template>
  <data-table title="All League's List" :headers="headers" :def-form-data="defForm"
    @form-data-change="handleFormDataChange">

    <template #filters>
      <select v-model="filters.sportId" @change="fetchData()"
        class="bg-white text-gray-900 p-4 py-2 rounded-xl border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option :value="undefined">All Sports</option>
        <option v-for="s in sportList" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
    </template>

    <template #default="{ item }">
      <td class="my-td-1st">
        <img class="w-8 h-8 object-cover rounded-md" :src="showImg(item.logo)" alt="">
      </td>
      <td class="my-td">{{ item.name }}</td>
      <td class="my-td">{{ item.sport?.name || 'N/A' }}</td>
      <td class="my-td">{{ item.teamAndScore?.length || '0' }}</td>
      <td class="my-td" v-html="printStatus(item.status)"></td>
    </template>

    <template #modal>
      <!-- Logo -->
      <div class="p-1 mb-3">
        <label class="my-label">Logo</label>
        <FileUploader v-model="formData.logo" accept="image/*" class="flex justify-center mb-6">
          <div class="relative">
            <img class="w-32 h-32 object-cover rounded-md" :src="showImg(formData.logo)" alt="">
            <button type="button"
              class="absolute bottom-1.5 right-1.5 w-7 h-7 bg-gray-500 rounded-md flex items-center justify-center">
              <i class="fa fa-edit text-sm"></i>
            </button>
          </div>
        </FileUploader>
      </div>
      <!-- Name -->
      <div class="p-1 my-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name">
      </div>
      <!-- Sport -->
      <div class="p-1 mb-3">
        <label class="my-label">Sport</label>
        <select v-model="formData.sportId" @change="onChangeSport" class="my-input py-4">
          <option value="">Select Sport</option>
          <template v-for="item in sportList" :key="item._id">
            <option :value="item._id">{{ item.name }}</option>
          </template>
        </select>
      </div>
      <!-- Age Range -->
      <div class="grid grid-cols-2 gap-2 p-1 mb-3">
        <div>
          <label class="my-label">Start Age</label>
          <input v-model.number="formData.startAge" type="number" class="my-input" placeholder="Min age">
        </div>
        <div>
          <label class="my-label">End Age</label>
          <input v-model.number="formData.endAge" type="number" class="my-input" placeholder="Max age">
        </div>
      </div>
      <!-- Gender -->
      <div class="p-1 mb-3">
        <label class="my-label">Gender</label>
        <select v-model="formData.gender" class="my-input py-4">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>
      <!-- Date Range -->
      <div class="grid grid-cols-2 gap-2 p-1 mb-3">
        <div>
          <label class="my-label">Start Date</label>
          <input v-model="formData.startDate" type="date" class="my-input">
        </div>
        <div>
          <label class="my-label">End Date</label>
          <input v-model="formData.endDate" type="date" class="my-input">
        </div>
      </div>
      <!-- Team -->
      <div class="p-1 mb-3">
        <label class="my-label">Add Team</label>
        <!-- Selected teams (2-column layout) -->
        <div class="grid grid-cols-1 gap-2 mb-2">
          <div v-for="(item, index) in formData.teams" :key="item._id"
            class="flex justify-between items-center bg-1 px-3 py-2 rounded">
            <span>{{ item.name }}</span>
            <button type="button" @click="removeTeam(index)" class="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        </div>
        <select v-model="selectedTeamId" @change="addTeam" class="my-input py-4">
          <option value="">Add Team</option>
          <template v-for="item in teamListFiltered" :key="item._id">
            <option :value="item._id">{{ item.name }}</option>
          </template>
        </select>
      </div>
      <!-- Status -->
      <div class="p-1 mb-3">
        <label class="my-label">Status</label>
        <select v-model="formData.status" required class="my-input py-4">
          <option value="">Select status</option>
          <option value="upcoming">Upcoming</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';

export default {
  name: "MangeTeamsPage",
  components: { DataTable },
  data() {
    return {
      headers: ["Logo", "Name", "Sport", "Total Teams", "Status"],
      sportList: [],
      teamList: [],
      selectedTeamId: "",
      defForm: {
        name: "",
        sportId: "",
        startAge: null,
        endAge: null,
        gender: "",
        startDate: "",
        endDate: "",
        teams: [],
        teamAndScore: [],
        status: "upcoming",
      },
    };
  },
  mounted() {
    this.httpReq({
      customUrl: 'sport/all',
      method: 'get',
      callback: data => this.sportList = data
    });
  },
  methods: {
    handleFormDataChange(newFormData) {
      this.formData = { ...this.defForm, ...newFormData };
    },

    onChangeSport() {
      this.formData.teams = [];
      this.formData.teamAndScore = [];
      this.selectedTeamId = "";

      if (this.formData.sportId) {
        this.httpReq({
          customUrl: `team/all?sportId=${this.formData.sportId}`,
          method: 'get',
          callback: data => this.teamList = data
        });
      } else {
        this.teamList = [];
      }
    },

    addTeam() {
      if (!this.selectedTeamId) return;

      const team = this.teamList.find(t => t._id === this.selectedTeamId);
      if (team && !this.formData.teams.find(t => t._id === team._id)) {
        this.formData.teams.push({
          _id: team._id,
          name: team.name
        });

        this.formData.teamAndScore.push({
          teamId: team._id,
          score: 0
        });

        this.selectedTeamId = "";
      }
    },

    removeTeam(index) {
      if (index >= 0 && index < this.formData.teams?.length) {
        this.formData.teams.splice(index, 1);
        this.formData.teamAndScore.splice(index, 1);
      }
    },

    printStatus(status) {
      const statusMap = {
        'upcoming': '<span class="text-yellow-500">Upcoming</span>',
        'running': '<span class="text-green-500">Running</span>',
        'completed': '<span class="text-blue-500">Completed</span>'
      };
      return statusMap[status] || '<span class="text-gray-500">Unknown</span>';
    }
  },
  computed: {
    teamListFiltered() {
      if (!this.teamList?.length || !this.formData.teams?.length) {
        return this.teamList;
      }

      const selectedIds = this.formData.teams.map(t => t._id);
      return this.teamList.filter(team => !selectedIds.includes(team._id));
    }
  },
};
</script>