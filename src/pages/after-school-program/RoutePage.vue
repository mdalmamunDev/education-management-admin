<template>
  <data-table title="Route List" :headers="headers">
    <template #default="{ item }">
      <td class="my-td-1st">{{ item.name || 'N/A' }}</td>
      <td class="my-td">
        <UserWithEmail :user="item.coach" />
      </td>
      <td class="my-td">{{ item.totalStudents || 0 }}</td>
      <td class="my-td">{{ item.totalSchools || 0 }}</td>
    </template>

    <template #modal>
      <!-- Name -->
      <div class="p-1 mb-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name">
      </div>
      <!-- Coach -->
      <div class="p-1 mb-3">
        <label class="my-label">Coach</label>
        <div class="grid grid-cols-3 gap-3">
          <template v-if="formData.coach">
            <UserWithEmail :user="formData.coach" style="justify-content: start;" />
            <button type="button" class="text-red-600" @click="formData.coachId = null; formData.coach = null">
              <i class="fa fa-trash"></i>
            </button>
          </template>
          <AssignUser v-else label="Assign Coach" :show-delete="false" :fetch-url="`user/all?role=coach&limit=20`"
            @change="(u) => { formData.coachId = u.id; formData.coach = u }" drop-down-bg="bg-1"
            style="justify-content: start;" />
        </div>
      </div>

      <!-- Active Days -->
      <div class="p-1 mb-3">
        <label class="my-label">Active Days</label>
        <div class="grid grid-cols-4 gap-2 mt-2">
          <template v-for="day in ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']" :key="day">
            <label class="flex items-center space-x-2">
              <input v-model="formData.activeDays" type="checkbox" :value="day" class="form-checkbox h-4 w-4 text-blue-600">
              <span class="text-sm">{{ day }}</span>
            </label>
          </template>
        </div>
      </div>
    </template>
  </data-table>
</template>

<script>
import AssignUser from '@/components/AssignUser.vue';
import DataTable from '@/components/DataTable.vue';
import UserWithEmail from '@/components/UserWithEmail.vue';

export default {
  name: "RoutePage",
  components: { DataTable, UserWithEmail, AssignUser },
  data() {
    return {
      headers: ["Name", "Coach", "Total Students", "Total Schools"],
    };
  },
};
</script>