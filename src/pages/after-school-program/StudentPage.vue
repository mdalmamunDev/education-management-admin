<template>
  <data-table title="Student List" :headers="headers" :action-info="false" :def-form-data="defFormData">
    <template #default="{ item }">
      <td class="my-td-1st">
        <div class="flex items-center space-x-3">
          <img class="w-8 h-8 object-cover rounded-full" :src="showImg(item.profileImage)" alt="">
          <span class="">{{ item.name }}</span>
        </div>
      </td>
      <td class="my-td">{{ item.school?.name || 'N/A' }}</td>
      <td class="my-td"> <UserWithEmail :user="item.parent" /></td>
    </template>

    <template #modal>
      <!-- Profile Picture -->
      <FileUploader v-model="formData.profileImage" class="flex justify-center mb-6" accept="image/*">
        <div class="relative">
          <img class="w-32 h-32 object-cover rounded-full" :src="showImg(formData.profileImage)" alt="">
          <button
            class="absolute bottom-1.5 right-1.5 w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center">
            <i class="fa fa-edit text-sm"></i>
          </button>
        </div>
      </FileUploader>
      <!-- Name -->
      <div class="p-1 mb-3">
        <label class="my-label">Name</label>
        <input v-model="formData.name" type="text" class="my-input" placeholder="Enter name" required>
      </div>
      <!-- School -->
      <div class="p-1 mb-3">
        <label for="school" class="my-label">School</label>
        <select id="school" v-model="formData.schoolId" required class="my-input py-4">
          <option disabled value="">Select school</option>
          <template v-for="(item, index) in schoolList" :key="index">
            <option :value="item.id">{{ item.name }}</option>
          </template>
        </select>
      </div>
      <!-- Parent -->
      <div class="p-1 mb-3">
        <label class="my-label">Parent</label>
        <div class="grid grid-cols-3 gap-3">
          <template v-if="formData.parent">
            <UserWithEmail :user="formData.parent" style="justify-content: start;" />
            <button type="button" class="text-red-600" @click="formData.parentId = null; formData.parent = null">
              <i class="fa fa-trash"></i>
            </button>
          </template>
          <AssignUser v-else label="Assign Parent" :show-delete="false" :fetch-url="`user/all?role=parent&limit=20`"
            @change="(u) => { formData.parentId = u.id; formData.parent = u }" drop-down-bg="bg-1"
            style="justify-content: start;" />
        </div>
      </div>
      <!-- Other Guardians -->
      <fieldset class="border border-gray-600 p-3 mb-4">
        <legend>Other Guardians</legend>
        <div v-for="(guardian, index) in formData.otherGuardians" :key="index"
          class="py-3 border-b border-gray-600 last:border-0">
          <div class="flex justify-between items-center">
            <label class="my-label">Guardian {{ index + 1 }}</label>
            <button @click="removeItem(formData.otherGuardians, index)" type="button" class="p-1">
              <i class="fa fa-trash text-red-500"></i>
            </button>
          </div>
          <!-- Profile Picture -->
          <FileUploader v-model="guardian.profileImage" class="flex justify-center mb-2" accept="image/*">
            <div class="relative">
              <img class="w-24 h-24 object-cover rounded-full" :src="showImg(guardian.profileImage)" alt="">
              <button type="button"
                class="absolute bottom-1.5 right-1.5 w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center">
                <i class="fa fa-edit text-sm"></i>
              </button>
            </div>
          </FileUploader>
          <input v-model="guardian.name" type="text" class="my-input mt-2" placeholder="Enter Name">
          <input v-model="guardian.phone" type="text" class="my-input mt-2" placeholder="Enter Phone">
          <input v-model="guardian.relation" type="text" class="my-input mt-2" placeholder="Enter Relationship">
        </div>
        <div v-if="formData.otherGuardians?.length < 5" class="flex justify-center my-3">
          <button type="button" class="btn-g py-2 px-4 rounded-lg" @click="formData.otherGuardians.push({})">
            <i class="fa fa-plus mr-2"></i>
            Add Guardian
          </button>
        </div>
      </fieldset>
      <!-- Note -->
      <div class="p-1 mb-3">
        <label class="my-label">Note</label>
        <input v-model="formData.note" type="text" class="my-input" placeholder="Enter note">
      </div>
    </template>
  </data-table>
</template>

<script>
import AssignUser from '@/components/AssignUser.vue';
import DataTable from '@/components/DataTable.vue';
import FileUploader from '@/components/FileUploader.vue';
import UserWithEmail from '@/components/UserWithEmail.vue';

export default {
  name: "StudentPage",
  components: { DataTable, UserWithEmail, AssignUser, FileUploader },
  data() {
    return {
      headers: ["Name", "School", "Parent"],

      schoolList: [],
      defFormData: {
        otherGuardians: [],
      },
    };
  },
  mounted() {
    this.httpReq({
      customUrl: 'school/all',
      method: 'get',
      callback: data => this.schoolList = data
    });
  },
};
</script>