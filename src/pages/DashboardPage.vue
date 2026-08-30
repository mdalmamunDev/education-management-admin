<template>
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Students Card -->
    <div class="stat-card-1 rounded-md p-8 text-white">
      <div class="flex items-center gap-4">
        <img src="/icons/dashboard/athletes.svg" alt="">
        <div>
          <span class="text-3xl">Students</span>
          <div class="text-4xl mt-2">{{ totalStudents }}</div>
        </div>
      </div>
    </div>
    <!-- Teachers Card -->
    <div class="stat-card-2 rounded-md p-8 text-white">
      <div class="flex items-center gap-4">
        <img src="/icons/dashboard/coaches.svg" alt="">
        <div>
          <span class="text-3xl">Teachers</span>
          <div class="text-4xl mt-2">{{ totalTeachers }}</div>
        </div>
      </div>
    </div>

    <!-- Courses Card -->
    <div class="stat-card-3 rounded-md p-8 text-white">
      <div class="flex items-center gap-4">
        <img src="/icons/dashboard/total-sessions.svg" alt="">
        <div>
          <span class="text-3xl">Courses</span>
          <div class="text-4xl mt-2">{{ totalCourses }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Charts and Activity Section -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Enrollments Chart -->
    <div class="lg:col-span-2 bg-1 rounded-md p-6">
      <h3 class="text-xl font-semibold text-main mb-6">Enrollments per Course</h3>
      <div class="h-[500px]">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Right Column -->
    <div class="bg-1 rounded-md p-6 space-y-8">
      <!-- Pie Chart -->
      <div>
        <h3 class="text-xl font-semibold text-main mb-4">
          People Distribution
        </h3>
        <div class="h-[500px]">
          <Pie :data="pieData" :options="pieOptions" />
        </div>
      </div>

      <!-- Recent Activity -->
      <!-- <div>
          <h3 class="text-xl font-semibold text-white mb-6">
            Recent Activity
          </h3>
          <div class="space-y-8">
            <div v-for="(item, index) in activities" :key="index"
              class="flex items-center gap-3 border-b-[0.5px] border-[#808080] pb-2">
              <img width="24" :src="item.icon" alt="">
              <p class="text-gray-300 text-sm">{{ item.text }}</p>
            </div>
          </div>
        </div> -->
    </div>
  </div>

  <!-- Recent Students Table -->
  <section class="mt-10 bg-1 rounded-md p-6">
    <div class="bg-1 min-h-[30vh]">
      <h3 class="text-xl font-semibold text-main mb-6">Recent Students</h3>
      <table class="w-full text-center">
        <!-- Table Header -->
        <thead class="bg-2">
          <tr class="text-gray-300 text-sm font-medium">
            <template v-for="(item, index) in headers" :key="index">
              <th class="my-td" :class="index === 0 ? 'text-start ps-8' : ''">
                {{ item }}
              </th>
            </template>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="divide-y divide-gray-600">
          <tr v-for="(item, index) in recentStudents" :key="index">
            <td class="my-td-1st ps-8">{{ item.firstName }} {{ item.lastName }}</td>
            <td class="my-td">{{ item.email }}</td>
            <td class="my-td"> {{ item.department?.departmentName || '—' }}</td>
            <td class="my-td"> <span v-html="printStatus((item.status || '').toLowerCase())"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { Bar, Pie } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from "chart.js"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
)

export default {
  name: "DashboardPage",
  components: { Bar, Pie },

  data() {
    return {
      headers: ['Name', 'Email', 'Department', 'Status'],
      totalStudents: 0,
      totalTeachers: 0,
      totalCourses: 0,
      totalGuardians: 0,
      recentStudents: [],

      chartData: {
        labels: ["Loading.."],
        datasets: [
          {
            label: "Enrollments",
            data: [0],
            backgroundColor: (ctx) => {
              const chart = ctx.chart
              const { ctx: canvasCtx, chartArea } = chart
              if (!chartArea) return null

              const gradient = canvasCtx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              )
              // gradient.addColorStop(0, "#54A7FF")
              // gradient.addColorStop(1, "#326499")
              return gradient
            },
            borderRadius: 6,
            barPercentage: 0.5,
          },
        ],
      },

    }
  },

  mounted() {
    // Reset stale list filters so dashboard requests are clean
    this.$store.commit('setFilters', {});

    // Students: total count + most recent rows
    this.fetchData({
      customUrl: 'students?limit=5',
      callback: (data, response) => {
        this.recentStudents = data || [];
        this.totalStudents = response?.data?.pagination?.totalCount || 0;
      }
    });
    this.fetchData({ customUrl: 'teachers?limit=1', callback: (_, response) => { this.totalTeachers = response?.data?.pagination?.totalCount || 0; } });
    this.fetchData({ customUrl: 'courses?limit=1', callback: (_, response) => { this.totalCourses = response?.data?.pagination?.totalCount || 0; } });
    this.fetchData({ customUrl: 'guardians?limit=1', callback: (_, response) => { this.totalGuardians = response?.data?.pagination?.totalCount || 0; } });

    // Enrollments grouped per course (top courses) for the bar chart
    this.fetchData({
      customUrl: 'enrollments?limit=200',
      callback: (data) => {
        const groups = {};
        (data || []).forEach((e) => {
          const key = e.course?.courseName || 'Unknown';
          groups[key] = (groups[key] || 0) + 1;
        });
        // Sort descending and keep top 8 courses
        const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 8);
        this.chartData = {
          labels: sorted.map(([name]) => name),
          datasets: [
            {
              label: "Enrollments",
              data: sorted.map(([, count]) => count),
              backgroundColor: (ctx) => {
                const chart = ctx.chart
                const { ctx: canvasCtx, chartArea } = chart
                if (!chartArea) return null

                const gradient = canvasCtx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                )
                gradient.addColorStop(0, "#54A7FF")
                gradient.addColorStop(1, "#326499")
                return gradient
              },
              borderRadius: 6,
              barPercentage: 0.5,
            },
          ],
        };
      }
    });
  },

  computed: {
    pieData() {
      return {
        labels: ["Students", "Teachers", "Guardians"],
        datasets: [
          {
            data: [
              this.totalStudents,
              this.totalTeachers,
              this.totalGuardians
            ],
            backgroundColor: [
              "#0175F2",
              "#60a5fa",
              "#326499"
            ]
          }
        ]
      }
    },

    /** Bar chart options — tick/grid colors follow the active theme */
    chartOptions() {
      const dark = this.$store.getters.theme === 'dark';
      const tick = dark ? "#e2e8f0" : "#334155";
      const grid = dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: tick },
            grid: { color: grid },
          },
          y: {
            beginAtZero: true,
            ticks: { color: tick, stepSize: 2 },
            grid: { color: grid },
          },
        },
      };
    },

    pieOptions() {
      const dark = this.$store.getters.theme === 'dark';
      return {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: dark ? "#e2e8f0" : "#334155" }
          }
        }
      };
    }
  }
}

</script>


<style scoped>
.stat-card-1 {
  background: linear-gradient(180deg, #faab00 0%, #9c6600 100%);
}

.stat-card-2 {
  background: linear-gradient(180deg, #2d29fc 0%, #000269 100%);
}

.stat-card-3 {
  background: linear-gradient(180deg, #3cff66 0%, #00702b 100%);
}
</style>