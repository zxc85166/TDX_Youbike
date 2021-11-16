<script setup>
import { LessThanFilled } from "@vicons/material";
import { useStore } from "@/store/store.js";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import { ref } from "vue";
import L from "leaflet";
const router = useRouter();
const store = useStore();
const mymap = ref(null);
console.log(store.RoundRestaurant);
console.log(store.RoundDetails);
onMounted(() => {
    mymap.value = L.map("mapid").setView([0, 0], 13);
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: import.meta.env.VITE_APP_accessToken,
        }
    ).addTo(mymap.value);


    var marker = L.marker([store.RoundRestaurant.Position.PositionLat, store.RoundRestaurant.Position.PositionLon]).addTo(mymap.value);
    mymap.value.setView([store.RoundRestaurant.Position.PositionLat, store.RoundRestaurant.Position.PositionLon], 18);
    marker.bindPopup(
        `<div class="bg-white rounded-lg text-center">
         <div class="text-gray">
            <div class="pb-5">
            <img src="${store.RoundRestaurant.Picture.PictureUrl1}" />
            </div>
           <p class="text-black font-bold text-2xl">${store.RoundRestaurant.RestaurantName}</p>
           <p class="mb-2">電話：${store.RoundRestaurant.Phone}</p>
           <p class="mb-2">地址：${store.RoundRestaurant.Address}</p>
           <p class="mb-2">營業時間：${store.RoundRestaurant.OpenTime}</p>
           <p class="mb-2">介紹：${store.RoundRestaurant.Description}</p>
         </div>
       </div>`
    ).openPopup();
});

//回首頁
function goHome() {
    router.push("/");
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
                class="mr-5 flex items-center text-lg flex-2"
            >{{ store.RoundRestaurant.RestaurantName }}</div>
        </div>
    </header>

    <div id="mapid"></div>
</template>
