<script setup>
import { useStore } from "@/store/store.js";
import { useRouter } from "vue-router";
import { Clock } from "@vicons/fa";
import { LocationOnFilled, LocalPhoneFilled } from "@vicons/material";
const store = useStore();
const router = useRouter();
//回首頁
function goHome() {
    router.push("/");
}
function goRoundmap() {
    router.push("/roundmap");
}
</script>
<template>
    <header class="bg-yellow w-full h-[92px] relative">
        <div class="flex flex-row py-6 md:mx-6">
            <div class="flex-1">
                <div @click="goHome()" class="hidden lg:flex w-56 cursor-pointer">
                    <img src="@/assets/pictures/title.png" alt="title" />
                </div>
                <div @click="goHome()" class="flex lg:hidden cursor-pointer">
                    <LessThanFilled class="ml-6 w-9" />
                </div>
            </div>
            <div class="mr-5 flex items-center text-lg flex-2">{{ store.RoundDetails.Name }}</div>
        </div>
    </header>
    <div v-if="store.RoundDetails" class="mx-auto grid gap-5 w-1/3 my-7">
        <div class="bg-white rounded-lg grid place-items-center">
            <img :src="store.RoundDetails.Picture.PictureUrl1" class="rounded-lg shadow-xl" />
        </div>
        <div class="flex items-center">
            <Clock class="w-6 text-yellow" />
            <p class="ml-3">開放時間為{{ store.RoundDetails.OpenTime }}</p>
        </div>
        <div class="flex items-center">
            <LocalPhoneFilled class="w-7 text-yellow" />
            <p class="ml-3">{{ store.RoundDetails.Phone }}</p>
        </div>
        <div class="flex items-center">
            <LocationOnFilled class="text-yellow w-7" />
            <p class="ml-3">{{ store.RoundDetails.Address }}</p>
            <a class="bg-yellow rounded-3xl ml-3">
                <p class="mx-3 my-1 cursor-pointer hover:text-white">地圖</p>
            </a>
        </div>
        <div class="h-fit">
            <p class="text-gray">{{ store.RoundDetails.Description }}</p>
        </div>
    </div>
    <div v-if="store.RoundRestaurant" class="mx-auto grid gap-5 w-1/3 my-7">
        <div class="bg-white rounded-lg grid place-items-center">
            <img :src="store.RoundRestaurant.Picture.PictureUrl1" class="rounded-lg shadow-xl" />
        </div>
        <div class="flex items-center">
            <Clock class="w-6 text-yellow" />
            <p class="ml-3">開放時間為{{ store.RoundRestaurant.OpenTime }}</p>
        </div>
        <div class="flex items-center">
            <LocalPhoneFilled class="w-7 text-yellow" />
            <p class="ml-3">{{ store.RoundRestaurant.Phone }}</p>
        </div>
        <div class="flex items-center">
            <LocationOnFilled class="text-yellow w-7" />
            <p class="ml-3">{{ store.RoundRestaurant.Address }}</p>
            <a @click="goRoundmap()" class="bg-yellow rounded-3xl ml-3">
                <p class="mx-3 my-1 cursor-pointer hover:text-white">地圖</p>
            </a>
        </div>
        <div class="h-fit">
            <p class="text-gray">{{ store.RoundRestaurant.Description }}</p>
        </div>
    </div>
</template>