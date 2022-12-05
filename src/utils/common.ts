import type { ISTableStyles } from "vrame";
import { computed } from "vue";

export const descriptionTableStyles = computed<ISTableStyles>(
  () =>
    ({
      tableStyle: {
        width: "100%",
      },
      tBodyStyle: {
        width: "100%",
      },
      tHeaderStyle: {
        width: "100%",
        backgroundColor: "#eeeeee",
      },
      thStyle(i: number) {
        if (i == 0)
          return {
            width: "20%",
          };
        else if (i == 1)
          return {
            width: "30%",
          };
        else if (i == 2)
          return {
            width: "50%",
          };
      },
      columnStyle(i: number) {
        if (i == 0)
          return {
            width: "20%",
          };
        else if (i == 1)
          return {
            width: "30%",
          };
        else if (i == 2)
          return {
            width: "50%",
          };
      },
    } as ISTableStyles)
);
