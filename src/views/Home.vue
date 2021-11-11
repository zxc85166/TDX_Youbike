<script setup>
</script>

<template>
  <div class="bg-yellow h-screen grid place-items-center">
    <div class="w-[245px] mt-28">
      <img class="w-full" src="@/assets/pictures/logo.png" alt="logo" />
      <div class="flex flex-col mt-28 gap-3">
        <router-link to="youbike">
          <button
            class="my-1 p-[10px] border-[3px] hover:bg-black hover:text-yellow border-black rounded-[10px] w-full"
          >尋找 YouBike</button>
        </router-link>
        <router-link to="lane">
          <button
            class="my-1 p-[10px] border-[3px] hover:bg-black hover:text-yellow border-black rounded-[10px] w-full"
          >查詢自行車道</button>
        </router-link>
        <router-link to="round">
          <button
            class="my-1 p-[10px] border-[3px] hover:bg-black hover:text-yellow border-black rounded-[10px] w-full"
          >附近景點、美食</button>
        </router-link>
      </div>
    </div>
    <div class="mt-auto mb-5 justify-center xl:justify-self-end xl:mr-8">
      Where’s YouBike
      <span class="px-1">©</span>Code: 罐頭
      <span class="px-1">/</span> Design: KT
    </div>
  </div>
</template>
