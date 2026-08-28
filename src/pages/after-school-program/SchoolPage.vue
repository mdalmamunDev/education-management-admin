<template>
  <data-table title="School List" :headers="headers" :action-info="false">
    <template #default="{ item }">
      <td class="my-td-1st">{{ item.name || 'N/A' }}</td>
      <td class="my-td">{{ item.totalStudents || 0 }}</td>
      <td class="my-td">{{ item.totalRoutes || 0 }}</td>
    </template>

    <template #modal>
      <!-- Name -->
      <div class="p-1 mb-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name">
      </div>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';

export default {
  name: "SchoolPage",
  components: { DataTable},
  data() {
    return {
      headers: ["Name", "Total Students", "Total Routes"],
    };
  },
};
</script>