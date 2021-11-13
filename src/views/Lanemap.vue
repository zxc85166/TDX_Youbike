<script setup>
import { LessThanFilled } from '@vicons/material'
import { useStore } from "@/store/store.js";

const store = useStore();

// api參數儲存區


</script>

<template>
    <header class="bg-yellow w-full h-[92px] relative">
        <div class="flex flex-row py-6 justify-around">
            <div class="w-56 flex-1">
                <div class="hidden lg:flex">
                    <router-link to="/">
                        <img src="@/assets/pictures/title.png" alt="title" />
                    </router-link>
                </div>
                <div class="flex lg:hidden">
                    <router-link to="/">
                        <LessThanFilled class="ml-6 w-9" />
                    </router-link>
                </div>
            </div>
            <div class="mr-5 flex items-center text-lg flex-2">{{ store.RouteName }}</div>
        </div>
    </header>
    <div class="grid place-items-center my-[42px] mx-4">
        <p v-if="!store.RouteName" class="text-gray">尚未選擇任何路線</p>
        <p>{{ store.Geometry }}</p>
    </div>
</template>
