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
    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [store.RoundRestaurant.Position.PositionLon, store.RoundRestaurant.Position.PositionLat]
        }
    };
    L.geoJSON(geojsonFeature).addTo(mymap.value);
    mymap.value.setView([store.RoundRestaurant.Position.PositionLat, store.RoundRestaurant.Position.PositionLon], 18);
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
            <div class="mr-5 flex items-center text-lg flex-2">{{ store.RouteName }}</div>
        </div>
    </header>
    <div>
        <p v-if="!store.RouteName" class="text-gray">尚未選擇任何路線</p>
        <div id="mapid"></div>
    </div>
</template>
