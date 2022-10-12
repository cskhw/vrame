import SDrawer from "@/components/r-drawer/RDrawer.vue";
import SAppbar from "@/components/r-appbar/RAppbar.vue";
import SList from "@/components/r-list/RList.vue";
import SBtn from "@/components/r-btn/RBtn.vue";
import SIcon from "@/components/r-icon/RIcon.vue";
import STable from "@/components/r-table/RTable.vue";
import SMain from "@/components/r-main/RMain.vue";
import SSelect from "@/components/r-select/RSelect.vue";

export default [
  { name: "r-appbar", component: SAppbar },
  { name: "r-drawer", component: SDrawer },
  { name: "r-main", component: SMain },
  { name: "r-list", component: SList },
  { name: "r-btn", component: SBtn },
  { name: "r-icon", component: SIcon },
  { name: "r-table", component: STable },
  { name: "r-select", component: SSelect },
];
