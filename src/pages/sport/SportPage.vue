<template>
  <data-table title="All League’s List" :headers="headers" :action-info="false">
    <template #default="{ item }">
      <td class="my-td-1st">
        <img class="w-8 h-8 object-cover rounded-md" :src="showImg(item.logo)" alt="">
      </td>
      <td class="my-td">{{ item.name || 'N/A' }}</td>
      <td class="my-td">{{ item.totalAthletes || 0 }}</td>
      <td class="my-td">{{ item.totalTeams || 0 }}</td>
      <td class="my-td">{{ item.totalLeagues || 0 }}</td>
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
      <div class="p-1 mb-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name">
      </div>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import FileUploader from '@/components/FileUploader.vue';

export default {
  name: "SportPage",
  components: { DataTable, FileUploader },
  data() {
    return {
      headers: ["Logo", "Name", "Total Athletes", "Total Teams", "Total Leagues"],
    };
  },
};
</script>