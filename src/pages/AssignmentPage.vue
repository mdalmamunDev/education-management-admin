<template>
  <data-table title="Assign Assignment List" :headers="headers" :show-add-btn="false" :show-action="false"
    :show-search="false">
    <template #default="{ item }">
      <td class="my-td-1st ps-8">{{ item.title }}</td>
      <td class="my-td">{{ getDate(item.date) }}</td>
      <td class="my-td"> {{ getTime(item.date) }}</td>
      <td class="my-td">
        <user-with-email :user="item.athlete" />
      </td>
      <td class="my-td">
        <user-with-email :user="item.coach" />
      </td>
      <td class="my-td" v-html="printStatus(item.status)"></td>
    </template>
    <!-- <template #modal>
      <div class="p-1 mb-3 grid grid-cols-2">
        <div>
          <label class="my-label">Coach</label>
          <AssignUser :user="formData.coach" label="Add Coach" fetch-url="user/all?role=coach&limit=20"
            @change="(u) => { formData.coachId = u.id, formData.coach = u }" drop-down-bg="bg-1"
            style="justify-content: start;" />
        </div>
        <div>
          <label class="my-label">Athlete</label>
          <AssignUser :user="formData.athlete" label="Add Athlete" fetch-url="user/all?role=athlete&limit=20"
            @change="(u) => { formData.athleteId = u.id, formData.athlete = u }" drop-down-bg="bg-1"
            style="justify-content: start;" />
        </div>
      </div>
      <div class="p-1 mb-3">
        <label for="gender" class="my-label">Assign a task</label>
        <select id="gender" v-model="formData.taskId" required class="my-input py-4">
          <option disabled value="">Select task</option>
          <option v-for="(item, index) in taskList" :key="index" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
      <div class="p-1 mb-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name">
      </div>
    </template> -->
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import UserWithEmail from '@/components/UserWithEmail.vue';

export default {
  name: "AssignmentPage",
  components: { DataTable, UserWithEmail },
  data() {
    return {
      headers: ["Title", "Date", "Time", "Athlete", "Coach", "Status"],
    };
  },
  mounted() {
    // this.$store.commit('setFormData', {
    //   taskId: '',
    //   athleteId: '',
    //   coachId: '',
    // })

    // this.httpReq({
    //   customUrl: 'task/all',
    //   method: 'get',
    //   callback: (data) => {
    //     this.taskList = data;
    //   }
    // })
  },
};
</script>