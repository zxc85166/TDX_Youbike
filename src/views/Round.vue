<script setup>
import { ref } from 'vue'
import { Switch } from '@headlessui/vue'
import { FastfoodFilled } from '@vicons/material'
import { Mountain } from '@vicons/fa'
const enabled = ref(false)
</script>

<template>
    <header class="bg-yellow w-full h-[92px]">
        <div class="flex flex-row py-6 justify-around">
            <div class="w-56">
                <router-link to="/">
                    <img src="@/assets/pictures/title.png" alt="title" />
                </router-link>
            </div>
            <div class="bg-white rounded-full flex">
                <Switch
                    v-model="enabled"
                    :class="enabled ? 'bg-black text-yellow' : 'bg-white text-black'"
                    class="flex flex-row items-center gap-5 justify-center h-[42px] w-[138px] rounded-full"
                >
                    <Mountain class="w-5" />
                    <span>景</span>
                    <span>點</span>
                </Switch>
                <Switch
                    v-model="enabled"
                    :class="enabled ? 'bg-white text-black' : 'bg-black text-yellow'"
                    class="flex flex-row items-center gap-5 justify-center h-[42px] w-[138px] rounded-full"
                >
                    <FastfoodFilled class="w-5" />
                    <span>美</span>
                    <span>食</span>
                </Switch>
            </div>
            <div class="w-56"></div>
        </div>
    </header>
    <h2>尋找youbike</h2>
</template>
