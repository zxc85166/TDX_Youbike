<script setup>
import ButtonRound from "@/components/ButtonRound.vue";
import { ref } from "vue";
import { Switch } from "@headlessui/vue";
import { DirectionsBikeFilled } from "@vicons/material";
import { Parking } from "@vicons/fa";

const enabled = ref(false);
</script>

<template>
  <header class="bg-yellow w-full h-[92px]">
    <div class="flex flex-row py-6 justify-around">
      <div class="w-56">
        <div class="hidden lg:flex">
          <router-link to="/">
            <img src="@/assets/pictures/title.png" alt="title" />
          </router-link>
        </div>
      </div>
      <div class="bg-white rounded-full flex">
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-black text-yellow' : 'bg-white text-black'"
          class="
            flex flex-row
            items-center
            gap-5
            justify-center
            h-[42px]
            w-[138px]
            rounded-full
          "
        >
          <DirectionsBikeFilled class="w-5" />
          <span>租</span>
          <span>車</span>
        </Switch>
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-white text-black' : 'bg-black text-yellow'"
          class="
            flex flex-row
            items-center
            gap-5
            justify-center
            h-[42px]
            w-[138px]
            rounded-full
          "
        >
          <Parking class="w-5" />
          <span>還</span>
          <span>車</span>
        </Switch>
      </div>
      <div class="w-56"></div>
    </div>
  </header>
  <div id="mapid">
    <h2>尋找youbike</h2>
    <ButtonRound />
  </div>
</template>
<style>
#mapid {
  height: 100vh;
}
</style>
