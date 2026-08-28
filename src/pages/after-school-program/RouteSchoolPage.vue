<template>
  <data-table title="Route School List" :headers="headers" :action-info="false" :def-form-data="defFormData"
    :show-search="false">
    <template #filters>
      <select v-model="filters.routeId" @change="fetchData()"
        class="bg-white text-gray-900 p-4 py-2 rounded-xl border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option :value="undefined">All Routes</option>
        <option v-for="s in routeList" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
      <select v-model="filters.schoolId" @change="fetchData()"
        class="bg-white text-gray-900 p-4 py-2 rounded-xl border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option :value="undefined">All Schools</option>
        <option v-for="s in schoolList" :key="s._id" :value="s._id">
          {{ s.name }}
        </option>
      </select>
    </template>

    <template #default="{ item }">
      <td class="my-td-1st">{{ item.route?.name || 'N/A' }}</td>
      <td class="my-td">{{ item.school?.name || 'N/A' }}</td>
      <td class="my-td">{{ item.students?.length || 0 }}</td>
    </template>

    <template #modal>
      <!-- Route -->
      <div class="p-1 mb-3">
        <label for="route" class="my-label">Route</label>
        <select id="route" v-model="formData.routeId" required class="my-input py-4">
          <option disabled value="">Select route</option>
          <template v-for="(item, index) in routeList" :key="index">
            <option :value="item.id">{{ item.name }}</option>
          </template>
        </select>
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
      <!-- Other Guardians -->
      <fieldset class="border border-gray-600 p-3 mb-4">
        <legend>Students</legend>
        <div v-for="(student, index) in formData.students" :key="index"
          class="py-3 border-b border-gray-600 last:border-0">
          <div class="flex justify-between items-center">
            <label class="my-label">Student {{ index + 1 }}</label>
            <button @click="removeItem(formData.students, index)" type="button" class="p-1">
              <i class="fa fa-trash text-red-500"></i>
            </button>
          </div>
          <select v-model="student.studentId" required class="my-input py-4">
            <option disabled :value="undefined">Select student</option>
            <template v-for="(item, index) in studentList" :key="index">
              <option :value="item.id">{{ item.name }}</option>
            </template>
          </select>
          <input v-model="student.pickUp" required type="text" class="my-input mt-2" placeholder="Enter Pick Up">
          <input v-model="student.dropOff" required type="text" class="my-input mt-2" placeholder="Enter Drop Off">
        </div>
        <div v-if="formData.students?.length < 100" class="flex justify-center my-3">
          <button type="button" class="btn-g py-2 px-4 rounded-lg" @click="formData.students.push({})">
            <i class="fa fa-plus mr-2"></i>
            Add Student
          </button>
        </div>
      </fieldset>
    </template>
  </data-table>
</template>

<script>
import DataTable from '@/components/DataTable.vue';

export default {
  name: "RouteSchoolPage",
  components: { DataTable },
  data() {
    return {
      headers: ["Route", "School", "Total Students"],

      schoolList: [],
      routeList: [],
      studentList: [],
      defFormData: {
        students: [],
      },
    };
  },
  methods: {
    getStudentList(schoolId) {
      this.httpReq({
        customUrl: 'student/all?schoolId=' + schoolId,
        method: 'get',
        callback: data => this.studentList = data
      });
    },
  },
  mounted() {
    this.httpReq({
      customUrl: 'school/all',
      method: 'get',
      callback: data => this.schoolList = data
    });
    this.httpReq({
      customUrl: 'route/all',
      method: 'get',
      callback: data => this.routeList = data
    });
  },
  watch: {
    'formData.schoolId': function (newVal) {
      if (newVal) this.getStudentList(newVal);
    }
  }
};
</script>