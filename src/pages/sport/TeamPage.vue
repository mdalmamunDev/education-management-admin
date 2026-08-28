<template>
  <data-table title="All Team’s List" :headers="headers" modal-w="3xl" :def-form-data="defForm" :action-info="false">
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
      <!-- <td class="my-td">
        <UserWithEmail :user="item.coach" />
      </td> -->
      <td class="my-td">{{ item.coaches?.length || 0 }}</td>
      <td class="my-td">{{ item.athletes?.length || 0 }}</td>
      <td class="my-td">{{ item.startAge }}-{{ item.endAge }}</td>
    </template>

    <template #modal>
      <div class="grid grid-cols-2 gap-3 gap-y-8 mb-4">
        <div class="col-span-2">
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
        <div class="col-span-2">
          <label class="my-label">Coaches</label>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="(coach, index) in formData.coaches" :key="index" class="flex items-center gap-4">
              <UserWithEmail :user="coach" style="justify-content: start;" />
              <button type="button" class="text-red-600"
                @click="removeItem(formData.coaches, index); removeItem(formData.coachIds, index)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <AssignUser label="Add Coach" :show-delete="false" :fetch-url="`user/all?role=coach&limit=20`"
              @change="(u) => { addItem(formData.coaches, u); addItem(formData.coachIds, u.id) }" drop-down-bg="bg-1"
              style="justify-content: start;" />
          </div>
        </div>
        <div class="col-span-2">
          <label class="my-label">Athletes</label>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="(athlete, index) in formData.athletes" :key="index" class="flex items-center gap-4">
              <UserWithEmail :user="athlete" style="justify-content: start;" />
              <button type="button" class="text-red-600"
                @click="removeItem(formData.athletes, index); removeItem(formData.athleteIds, index)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <AssignUser label="Add Athlete" :show-delete="false"
              :fetch-url="`user/all?role=athlete&minAge=${formData.startAge}$maxAge=${formData.endAge}&limit=20`"
              @change="(u) => { addItem(formData.athletes, u); addItem(formData.athleteIds, u.id) }" drop-down-bg="bg-1"
              style="justify-content: start;" />
          </div>
        </div>
        <!-- Name -->
        <div>
          <label class="my-label">Name</label>
          <input v-model="formData.name" required type="text" class="my-input" placeholder="Enter name">
        </div>
        <div>
          <label for="sport" class="my-label">Sport</label>
          <select id="sport" v-model="formData.sportId" required class="my-input py-4">
            <option disabled value="">Select sport</option>
            <template v-for="(item, index) in sportList" :key="index">
              <option :value="item.id">{{ item.name }}</option>
            </template>
          </select>
        </div>
        <div class="col-span-2">
          <label class="my-label">Age Group</label>
          <div class="flex gap-3">
            <input v-model="formData.startAge" required type="number" min="5" max="100" class="my-input"
              placeholder="Enter start age">
            <input v-model="formData.endAge" required type="number" min="5" max="100" class="my-input"
              placeholder="Enter end age">
          </div>
        </div>
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
  name: "MangeTeamsPage",
  components: { DataTable, UserWithEmail, AssignUser, FileUploader },
  data() {
    return {
      headers: ["Logo", "Name", "Sport", "Total Coaches", "Total Athletes", "Age Group"],
      sportList: [],
      defForm: {
        sportId: "",
        coaches: [],
        coachIds: [],
        athletes: [],
        athleteIds: [],
      }
    };
  },
  mounted() {
    this.httpReq({
      customUrl: 'sport/all',
      method: 'get',
      callback: data => this.sportList = data
    })
  },
};
</script>