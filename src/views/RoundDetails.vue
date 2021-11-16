<script setup>
import { useStore } from "@/store/store.js";
import { LessThanFilled } from "@vicons/material";
import { useRouter } from "vue-router";
import { Clock } from "@vicons/fa";
import { LocationOnFilled, LocalPhoneFilled } from "@vicons/material";
const store = useStore();
const router = useRouter();
//回首頁
function goHome() {
    router.push("/");
}
function goRoundDetailsMap() {
    router.push("/RoundDetailsMap");
}
function goRoundRestaurantMap() {
    router.push("/RoundRestaurantMap");
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
            <div
                v-if="store.RoundDetails.Name"
                class="mr-5 flex items-center text-lg flex-2"
            >{{ store.RoundDetails.Name }}</div>
            <div
                v-if="store.RoundRestaurant.Name"
                class="mr-5 flex items-center text-lg flex-2"
            >{{ store.RoundRestaurant.Name }}</div>
        </div>
    </header>
    <div v-if="store.RoundDetails" class="mx-auto grid gap-5 w-4/5 md:w-1/3 my-7">
        <div class="rounded-lg grid place-items-center">
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
            <a @click="goRoundDetailsMap()" class="bg-yellow rounded-3xl ml-3 min-w-max">
                <p class="mx-3 my-1 cursor-pointer hover:text-white">地圖</p>
            </a>
        </div>
        <div class="h-fit">
            <p class="text-gray">{{ store.RoundDetails.Description }}</p>
        </div>
    </div>
    <div v-if="store.RoundRestaurant" class="mx-auto grid gap-5 w-4/5 md:w-1/3 my-7">
        <div class="rounded-lg grid place-items-center">
            <img :src="store.RoundRestaurant.Picture.PictureUrl1" class="rounded-lg shadow-xl" />
        </div>
        <div class="flex items-center">
            <Clock class="w-6 text-yellow" />
            <p class="ml-3">開放時間為：{{ store.RoundRestaurant.OpenTime }}</p>
        </div>
        <div class="flex items-center">
            <LocalPhoneFilled class="w-7 text-yellow" />
            <p class="ml-3">{{ store.RoundRestaurant.Phone }}</p>
        </div>
        <div class="flex items-center">
            <LocationOnFilled class="text-yellow w-7" />
            <p class="ml-3">{{ store.RoundRestaurant.Address }}</p>
            <a @click="goRoundRestaurantMap()" class="bg-yellow rounded-3xl ml-3 min-w-max">
                <p class="mx-3 my-1 cursor-pointer hover:text-white">地圖</p>
            </a>
        </div>
        <div class="h-fit">
            <p class="text-gray">{{ store.RoundRestaurant.Description }}</p>
        </div>
    </div>
</template>