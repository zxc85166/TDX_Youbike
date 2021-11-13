<script setup>
import axios from 'axios';
import jsSHA from "jssha";
import { ref, watch } from "vue";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";
//顯示開關
const noData = ref(true); //尚未選擇任何縣市
// api參數儲存區
const Lanedatas = ref([]);
//
const cities = [
    { id: 1, name: "所有縣市", value: "" },
    { id: 2, name: "臺北市", value: "Taipei" },
    { id: 3, name: "新北市", value: "NewTaipei" },
    { id: 4, name: "桃園市", value: "Taoyuan" },
    { id: 5, name: "臺中市", value: "Taichung" },
    { id: 6, name: "臺南市", value: "Tainan" },
    { id: 7, name: "高雄市", value: "Kaohsiung" },
    { id: 8, name: "基隆市", value: "Keelung" },
    { id: 9, name: "新竹市", value: "Hsinchu" },
    { id: 10, name: "新竹縣", value: "HsinchuCounty" },
    { id: 11, name: "苗栗縣", value: "MiaoliCounty" },
    { id: 12, name: "彰化縣", value: "ChanghuaCounty" },
    { id: 13, name: "南投縣", value: "NantouCounty" },
    { id: 14, name: "雲林縣", value: "YunlinCounty" },
    { id: 15, name: "嘉義縣", value: "ChiayiCounty" },
    { id: 16, name: "嘉義市", value: "Chiayi" },
    { id: 17, name: "屏東縣", value: "PingtungCounty" },
    { id: 18, name: "宜蘭縣", value: "YilanCounty" },
    { id: 19, name: "花蓮縣", value: "HualienCounty" },
    { id: 20, name: "臺東縣", value: "TaitungCounty" },
    { id: 21, name: "金門縣", value: "KinmenCounty" },
    { id: 22, name: "澎湖縣", value: "PenghuCounty" },
    { id: 23, name: "連江縣", value: "LienchiangCounty" },
];

const selectedCity = ref(cities[0]);
function getLanes() {
    const city = selectedCity.value.value;
    axios({
        method: "get",
        url: `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${city}?$top=12&$format=JSON`,
        headers: GetAuthorizationHeader(),
    })
        .then((res) => {
            const data = res.data;
            Lanedatas.value = data;
            console.log(data);
            for (let index = 0; index < Lanedatas.value.length; index++) {
                Lanedatas.value[index].visibility = false;
            }
            if (data.length === 0) {
                alert("查無該條件資料");
                noData.value = true;
            } else {
                noData.value = false;
                // document.getElementById("showRes").scrollIntoView({ behavior: "smooth" });
            }
        })
        .catch((error) => console.log("error", error));
}
// API 驗證用
function GetAuthorizationHeader() {
    var AppID = (import.meta.env.VITE_APP_AppID)
    var AppKey = (import.meta.env.VITE_APP_AppKey)
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
//縣市選擇後動作
watch(selectedCity, () => {
    getLanes();
})
</script>

<template>
    <header class="bg-yellow w-full h-[92px] relative">
        <div class="flex flex-row py-6 justify-around">
            <div class="w-56">
                <router-link to="/">
                    <img src="@/assets/pictures/title.png" alt="title" />
                </router-link>
            </div>
            <div></div>
            <div class="grid place-items-center">
                <!-- 所有縣市 -->
                <div class="dropdown dropdown-hover bg-black rounded-3xl leading-9">
                    <Listbox v-model="selectedCity">
                        <ListboxButton>
                            <div
                                tabindex="0"
                                class="flex justify-around btn w-[143px] md:w-[191px] text-white border-0 text-sm md:text-base"
                            >
                                <span>{{ selectedCity.name }}</span>
                                <span>▼</span>
                            </div>
                        </ListboxButton>
                        <ListboxOptions
                            tabindex="0"
                            class="py-2 menu dropdown-content rounded-b-lg w-[143px] md:w-[191px] top-[40px]"
                        >
                            <ListboxOption v-for="city in cities" :key="city" :value="city">
                                <li class="hover:bg-blue-main rounded-lg">
                                    <a>
                                        <p
                                            class="text-white cursor-pointer pl-5 mx-auto hover:bg-yellow hover:text-black"
                                        >{{ city.name }}</p>
                                    </a>
                                </li>
                            </ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
            </div>
        </div>
    </header>
    <div class="mt-[42px] mx-[89px] -z-20">
        <p v-if="noData" class="text-gray">尚未選擇任何縣市</p>
        <!-- cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-y-16">
            <div
                v-for="(Lanedata) in Lanedatas"
                :key="Lanedata.index"
                class="card bordered shadow-lg max-w-[350px]"
            >
                <div class="card-body p-5">
                    <div class="grid gap-1">
                        <div class="flex">
                            <h2 class="card-title">{{ Lanedata.RouteName }}</h2>
                        </div>
                        <div class="flex items-center">
                            <ClockIcon class="md:h-5 md:w-5 h-4 w-4 mr-2" />
                            <span class="text-gray-content text-sm">{{ Lanedata.Direction }}</span>
                        </div>
                        <div class="flex items-center pt-2">
                            <LocationMarkerIcon class="h-5 w-5 text-blue-main" />
                            <p class="text-gray-content ml-2">{{ Lanedata.City }}{{ Lanedata.Town }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
