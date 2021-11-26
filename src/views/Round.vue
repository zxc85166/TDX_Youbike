<script setup>
import axios from "axios";
import jsSHA from "jssha";
import { ref } from 'vue'
import { useStore } from "@/store/store.js";
import { useRouter } from "vue-router";
import { Switch } from '@headlessui/vue'
import { FastfoodFilled, LessThanFilled, LocalPhoneFilled } from '@vicons/material'
import { Mountain } from '@vicons/fa'
import { onMounted } from "vue";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
//loading
const isLoading = ref(false);
const onCancel = () => console.log('User cancelled the loader.');
const fullPage = ref(false);
// 切換狀態
const enabled = ref(false)
const store = useStore();
const router = useRouter();
onMounted(() => {
    if (store.Restaurant.length == 0) {
        isLoading.value = true;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const longitude = position.coords.longitude; // 經度
                const latitude = position.coords.latitude; // 緯度
                // 將經緯度當作參數傳給 getData 執行
                getScenicSpotData(latitude, longitude);
                getRestaurantData(latitude, longitude);
            },
            // 錯誤訊息
            function (e) {
                const msg = e.code;
                const dd = e.message;
                console.error(msg);
                console.error(dd);
            }
        );
    }

});

// 串接附近的即時景點資料
function getScenicSpotData(longitude, latitude) {
    axios({
        method: 'get',
        url: `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$spatialFilter=nearby(${longitude},${latitude},1000)&$format=JSON`,
        headers: GetAuthorizationHeader()
    })
        .then((response) => {
            const availableData = response.data;
            store.ScenicSpot = availableData;
        })
        .catch((error) => console.log('error', error))
}
// 串接附近的即時美食資料

function getRestaurantData(longitude, latitude) {
    axios({
        method: 'get',
        // url: `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/NantouCounty?$top=10&$format=JSON`,
        url: `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$spatialFilter=nearby(${longitude},${latitude},1000)&$format=JSON`,
        headers: GetAuthorizationHeader()
    })
        .then((response) => {
            const availableData = response.data;
            store.Restaurant = availableData;
            isLoading.value = false;
        })
        .catch((error) => console.log('error', error))
}
// API 驗證用
function GetAuthorizationHeader() {
    var AppID = import.meta.env.VITE_APP_AppID;
    var AppKey = import.meta.env.VITE_APP_AppKey;
    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA("SHA-1", "TEXT");
    ShaObj.setHMACKey(AppKey, "TEXT");
    ShaObj.update("x-date: " + GMTString);
    var HMAC = ShaObj.getHMAC("B64");
    var Authorization =
        'hmac username="' +
        AppID +
        '", algorithm="hmac-sha1", headers="x-date", signature="' +
        HMAC +
        '"';
    return {
        Authorization: Authorization,
        "X-Date": GMTString /*,'Accept-Encoding': 'gzip'*/,
    }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}
//傳送資料進詳情景點頁面
function openRoundDetails(ScenicSpot) {
    store.RoundDetails = ScenicSpot;
    router.push({
        path: '/RoundDetails',
    })
    store.RoundRestaurant = '';
}
//傳送資料進詳情美食頁面
function openRestaurantDetails(Restaurant) {
    store.RoundRestaurant = Restaurant;
    router.push({
        path: '/RoundDetails',
    })
    store.RoundDetails = '';
}
</script>

<template>
    <header class="bg-yellow w-full h-[92px] relative">
        <div class="flex flex-row py-6 justify-around">
            <div class="w-56">
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
            <div></div>
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
    <loading
        v-model:active="isLoading"
        :can-cancel="true"
        :on-cancel="onCancel"
        :is-full-page="fullPage"
    />
    <!-- 景點 -->
    <div v-if="enabled" class="grid place-items-center my-[42px] mx-4">
        <p v-if="!store.ScenicSpot" class="text-gray">尚未定位</p>
        <!-- cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-y-16">
            <div
                v-for="ScenicSpot in store.ScenicSpot"
                :key="ScenicSpot.index"
                class="card bordered shadow-md max-w-[362px] bg-white rounded-md cursor-pointer hover:shadow-inner"
            >
                <div
                    class="grid grid-cols-2 grid-flow-row gap-1 m-3"
                    @click="openRoundDetails(ScenicSpot)"
                >
                    <div class="h-full w-full">
                        <img
                            v-if="ScenicSpot.Picture.PictureUrl1"
                            :src="ScenicSpot.Picture.PictureUrl1"
                            class="bg-cover bg-center"
                        />
                        <img
                            v-if="!ScenicSpot.Picture.PictureUrl1"
                            src="@/assets/pictures/logo.png"
                            class="bg-cover bg-center"
                        />
                    </div>
                    <div class="grid">
                        <div class="flex">
                            <div class="flex-1">
                                <h2 class="text-lg text-center">{{ ScenicSpot.Name }}</h2>
                                <h2 v-if="!ScenicSpot.Name" class="text-lg">一一</h2>
                            </div>
                        </div>

                        <div class="flex my-auto">
                            <LocalPhoneFilled class="w-5 text-yellow" />
                            <p>
                                <span class="px-1 text-gray">{{ ScenicSpot.Phone }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 美食 -->
    <div v-if="!enabled" class="grid place-items-center my-[42px] mx-4">
        <p v-if="!store.Restaurant" class="text-gray">尚未定位</p>
        <!-- cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-y-16">
            <div
                v-for="Restaurant in store.Restaurant"
                :key="Restaurant.index"
                class="card bordered shadow-md max-w-[362px] bg-white rounded-md cursor-pointer hover:shadow-inner"
            >
                <div
                    class="grid grid-cols-2 grid-flow-row gap-1 m-3"
                    @click="openRestaurantDetails(Restaurant)"
                >
                    <div>
                        <img
                            v-if="Restaurant.Picture.PictureUrl1"
                            :src="Restaurant.Picture.PictureUrl1"
                            class="w-full"
                        />
                        <img
                            v-if="!Restaurant.Picture.PictureUrl1"
                            src="@/assets/pictures/logo.png"
                            class="w-full"
                        />
                    </div>
                    <div class="grid">
                        <div class="flex">
                            <div class="flex-1">
                                <h2 class="text-lg text-center">{{ Restaurant.Name }}</h2>
                                <h2 v-if="!Restaurant.Name" class="text-lg">查無餐廳名</h2>
                            </div>
                        </div>

                        <div class="flex my-auto">
                            <LocalPhoneFilled class="w-5 text-yellow" />
                            <p>
                                <span class="px-1 text-gray">{{ Restaurant.Phone }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
