<template>
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Coaches Card -->
    <div class="stat-card rounded-md p-8 text-white">
      <div class="flex items-center gap-4">
        <img src="/icons/dashboard/coaches.svg" alt="">
        <div>
          <span class="text-3xl">Coaches</span>
          <div class="text-4xl mt-2">{{ totalCoach }}</div>
        </div>
      </div>
    </div>
    <!-- Athletes Card -->
    <div class="stat-card-athletes rounded-md p-8 text-white">
      <div class="flex items-center gap-4">
        <img src="/icons/dashboard/athletes.svg" alt="">
        <div>
          <span class="text-3xl">Athletes</span>
          <div class="text-4xl mt-2">{{ totalAthlete }}</div>
        </div>
      </div>
    </div>

    <!-- Total Sessions Card -->
    <div class="bg-g rounded-md p-8 text-white">
      <div class="flex items-center gap-4">
        <img src="/icons/dashboard/total-sessions.svg" alt="">
        <div>
          <span class="text-3xl">Total Lessons</span>
          <div class="text-4xl mt-2">{{ totalLesson }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Charts and Activity Section -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Weekly Sessions Chart -->
    <div class="lg:col-span-2 bg-1 rounded-md p-6">
      <h3 class="text-xl font-semibold text-white mb-6">Weekly Sessions</h3>
      <div class="h-[500px]">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Right Column -->
    <div class="bg-1 rounded-md p-6 space-y-8">
      <!-- Pie Chart -->
      <div>
        <h3 class="text-xl font-semibold text-white mb-4">
          Users Distribution
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

  <!-- Recent Users Table -->
  <section class="mt-10 bg-1 rounded-md p-6">
    <div class="bg-1 min-h-[30vh]">
      <h3 class="text-xl font-semibold text-white mb-6">Recent Users</h3>
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
          <tr v-for="(item, index) in recentUsers" :key="index">
            <td class="my-td-1st ps-8">{{ item.name }}</td>
            <td class="my-td">{{ item.email }}</td>
            <td class="my-td"> {{ item.address }}</td>
            <td class="my-td"> {{ item.ago }}</td>
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
      headers: ['name', 'email', 'address', 'ago'],
      // Example totals (replace with API values later)
      totalAthlete: "Loading..",
      totalCoach: "Loading..",
      totalParent: "Loading..",
      recentUsers: [],
      totalLesson: "Loading..",

      chartData: {
        labels: ["Loading..", "Loading..", "Loading..", "Loading..", "Loading..", "Loading..", "Loading.."],
        datasets: [
          {
            label: "Weekly Sessions",
            data: [0, 0, 0, 0, 0, 0, 0],
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
      },

      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "#fff" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#fff", stepSize: 2 },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
        },
      },
    }
  },

  mounted() {
    this.httpReq({
      method: 'get', callback: ({ totalAthlete, totalParent, totalCoach, recentUsers, lessonsChart, totalLesson }) => {
        this.totalAthlete = totalAthlete || 0;
        this.totalParent = totalParent || 0;
        this.totalCoach = totalCoach || 0;
        this.recentUsers = recentUsers || [];
        this.totalLesson = totalLesson || 0;

        this.chartData = {
          labels: lessonsChart?.labels || [],
          datasets: [
            {
              label: "Weekly Sessions",
              data: lessonsChart?.data || [],
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
        }

      }
    })
  },

  computed: {
    pieData() {
      return {
        labels: ["Athletes", "Coaches", "Parents"],
        datasets: [
          {
            data: [
              this.totalAthlete,
              this.totalCoach,
              this.totalParent
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

    pieOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#fff" }
          }
        }
      }
    }
  }
}

</script>


<style scoped>
.stat-card {
  background: linear-gradient(180deg, #0175F2 0%, #0A427D 100%);
}

.stat-card-athletes {
  background: linear-gradient(180deg, #60a5fa 0%, #0175F2 100%);
}
</style>